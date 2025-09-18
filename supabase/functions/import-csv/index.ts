import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const csvFile = formData.get('file');

    if (!csvFile) {
      return new Response(JSON.stringify({ error: 'No CSV file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Read CSV
    const csvContent = await csvFile.text();
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    console.log('CSV headers:', headers);

    // Accept 'budget_a' column and map it to account_budget_a
    const requiredColumns = ['account', 'glcode', 'budget_a', 'used_amt', 'remaining_amt'];
    const missingColumns = requiredColumns.filter(
      (col) => !headers.some((h) => h === col)
    );

    if (missingColumns.length > 0) {
      return new Response(JSON.stringify({
        error: `Missing required columns: ${missingColumns.join(', ')}`
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const budgetData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          if (header === 'account') row.account = values[index];
          if (header === 'glcode') row.glcode = values[index];
          if (header === 'budget_a') row.account_budget_a = parseFloat(values[index].replace(/[$,]/g, '')) || 0;
          if (header === 'used_amt') row.used_amt = parseFloat(values[index].replace(/[$,]/g, '')) || 0;
          if (header === 'remaining_amt') row.remaining_amt = parseFloat(values[index].replace(/[$,]/g, '')) || 0;
        });

        if (row.account && row.glcode) {
          budgetData.push(row);
        }
      }
    }

    console.log(`Parsed ${budgetData.length} budget records`);

    if (budgetData.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid rows found in CSV' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase.from('municipal_budget').insert(budgetData);

    if (error) {
      console.error('Error inserting data:', error);
      return new Response(JSON.stringify({ error: 'Failed to insert budget data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      message: `Successfully imported ${budgetData.length} budget records`,
      recordsImported: budgetData.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in import-csv function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
