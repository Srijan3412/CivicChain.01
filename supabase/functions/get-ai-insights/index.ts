import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

// Helper function to format large numbers
const formatNumber = (num) => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Crore`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} Lakh`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} Thousand`;
  }
  return num.toLocaleString();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("❌ Missing GEMINI_API_KEY in environment");
      return new Response(JSON.stringify({
        error: "Gemini API key not configured"
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("❌ Invalid JSON body:", e);
      return new Response(JSON.stringify({
        error: "Invalid JSON body"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const { budgetData, department } = body;
    if (!budgetData || !Array.isArray(budgetData) || !department) {
      return new Response(JSON.stringify({
        error: "Budget data and department are required"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // ✅ Clean and format data based on the provided dataset fields
    const formattedData = budgetData.map((item) => ({
      // Using 'account' for the primary label as it's present in the frontend payload
      account: item.account ?? "Unknown", 
      glcode: item.glcode ?? "Unknown",
      account_budget_a: item.account_budget_a ?? "Unknown",
      allocated: Number(item.budget_a) || 0,
      used: Number(item.used_amt) || 0,
      remaining: Number(item.remaining_amt) || 0,
      used_percent: Number(item.budget_a) > 0 ? (Number(item.used_amt) / Number(item.budget_a) * 100).toFixed(1) : "0"
    }));

    // ✅ Calculate totals
    const totalAllocated = formattedData.reduce((sum, b) => sum + b.allocated, 0);
    const totalUsed = formattedData.reduce((sum, b) => sum + b.used, 0);
    const totalRemaining = formattedData.reduce((sum, b) => sum + b.remaining, 0);

    // ✅ Gemini-friendly prompt
    const prompt = `
You are a financial analyst AI.
Your job is to summarize the budget data for the department: "${department}".

SUMMARY OF TOTALS:
- Total Allocated: ${formatNumber(totalAllocated)}
- Total Used: ${formatNumber(totalUsed)}
- Total Remaining: ${formatNumber(totalRemaining)}

DETAILED DATA:
${JSON.stringify(formattedData.map(item => ({
    account: item.account,
    glcode: item.glcode,
    account_description: item.account_budget_a,
    allocated: formatNumber(item.allocated),
    used: formatNumber(item.used),
    remaining: formatNumber(item.remaining),
    used_percent: item.used_percent,
  })), null, 2)}

TASK:
1. Write a short, clear summary of this department's financials:
   - Total allocated budget, total spent, total remaining.
   - Top 3 accounts by amount spent (include name and amount).
   - If there are major unspent funds, call that out.
2. Identify anomalies such as:
   - Spending higher than allocation.
   - Very low usage (less than 20% of allocation).
3. Provide ONE practical suggestion for this department to optimize or better plan its spending.
4. Make it concise (5–8 sentences max), easy to read, and formatted as a brief report.

OUTPUT FORMAT:
- Start with a **one-sentence overview** (big picture).
- Then list 2–3 key insights as bullet points.
- End with a single actionable recommendation.

IMPORTANT:
- Always use the provided numbers — do not say "unknown" or "no data".
- If some accounts have zero usage, mention that as a potential saving or opportunity.
- Your answer must be written in plain English for citizens, not accountants.
`;
    console.log("📤 Sending to Gemini API...");
    console.log("📝 Prompt length:", prompt.length);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });
    const rawResponse = await response.text();
    console.log("🔍 Gemini raw response:", rawResponse);
    if (!response.ok) {
      console.error("❌ Gemini API error:", rawResponse);
      return new Response(JSON.stringify({
        error: "Failed to get AI insights from Gemini",
        details: rawResponse
      }), {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      console.error("❌ Failed to parse Gemini response:", e);
      return new Response(JSON.stringify({
        error: "Invalid JSON from Gemini",
        details: rawResponse
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    const insights = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No insights returned.";
    return new Response(JSON.stringify({
      insights
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("💥 Edge Function Error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
