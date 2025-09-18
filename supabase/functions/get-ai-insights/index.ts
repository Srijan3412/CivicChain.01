import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ✅ Securely load Gemini API key from environment
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { budgetData, department } = await req.json();

    if (!budgetData || !department) {
      return new Response(
        JSON.stringify({ error: "Budget data and department are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ✅ Format data
    const formattedData = budgetData.map((item: any) => ({
      category: item.category,
      amount: item.amount,
      percentage: (
        (item.amount /
          budgetData.reduce(
            (sum: number, b: any) => sum + Number(b.amount),
            0,
          )) *
        100
      ).toFixed(1),
    }));

    const prompt = `You are an AI analyzing municipal budget data for transparency.
Department: ${department}
Budget Data: ${JSON.stringify(formattedData, null, 2)}

Provide:
- 3-line summary of key spending for this department
- Highlight anomalies or overspending within categories
- Suggest optimization areas

Respond in plain English, no code blocks.`;

    console.log("📤 Sending request to Gemini API...");

    // ✅ Gemini API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI insights from Gemini", details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    console.log("✅ Gemini API response:", data);

    // Gemini's response format: data.candidates[0].content.parts[0].text
    const insights =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No insights returned.";

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("💥 Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
