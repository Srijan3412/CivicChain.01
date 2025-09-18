import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { department } = await req.json();

    console.log(`Fetching budget data for department: ${department}`);

    // Validate inputs
    if (!department) {
      return new Response(
        JSON.stringify({ error: 'Department is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch budget data
    const { data: budgetData, error } = await supabase
      .from('municipal_budget')
      .select('*')
      .eq('account', department)
      .order('used_amt', { ascending: false });

    if (error) {
      console.error('Error fetching budget data:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch budget data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Transform data to match expected format
    const transformedData = budgetData?.map(item => ({
      id: item.id,
      category: item.glcode || 'Unknown Category',
      amount: Number(item.used_amt || 0),
      ward: 0, // Not used anymore but kept for compatibility
      year: new Date().getFullYear() // Default to current year
    })) || [];

    // Calculate summary statistics
    const totalBudget = transformedData.reduce((sum, item) => sum + item.amount, 0);
    const largestItem = transformedData[0]; // Already sorted by used_amt desc

    const response = {
      budgetData: transformedData,
      summary: {
        totalBudget,
        largestCategory: largestItem ? {
          category: largestItem.category,
          amount: largestItem.amount
        } : null,
        yearOverYearChange: 0 // TODO: Calculate when we have historical data
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-budget function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});