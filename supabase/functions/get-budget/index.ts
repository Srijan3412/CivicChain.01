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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { department, ward } = await req.json();

    console.log(`Fetching budget data for department: ${department}, ward: ${ward}`);

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

    // Build query with optional ward filter
    let query = supabase.from('municipal_budget')
      .select('id, account, glcode, account_budget_a, budget_a, used_amt, remaining_amt') // Explicitly select required fields
      .eq('account', department);
    
    // Add ward filter if provided
    if (ward && ward !== 'all') {
      console.log('Ward filtering not implemented yet - showing all wards');
    }

    const { data: budgetData, error } = await query.order('used_amt', { ascending: false });

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
    
    // Send raw fetched data without transformation
    const response = {
      budgetData: budgetData || [],
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
