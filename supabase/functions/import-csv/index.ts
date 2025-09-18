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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await req.formData();
    const csvFile = formData.get('file') as File;

    if (!csvFile) {
      return new Response(
        JSON.stringify({ error: 'No CSV file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Read and parse CSV content
    const csvContent = await csvFile.text();
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    console.log('CSV headers:', headers);

    // Validate required columns
    const requiredColumns = ['Ward', 'Year', 'Category', 'Amount'];
    const missingColumns = requiredColumns.filter(col => 
      !headers.some(h => h.toLowerCase() === col.toLowerCase())
    );

    if (missingColumns.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Missing required columns: ${missingColumns.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse data rows
    const budgetData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const row: any = {};
        
        headers.forEach((header, index) => {
          const normalizedHeader = header.toLowerCase();
          if (normalizedHeader === 'ward') {
            row.ward = parseInt(values[index]);
          } else if (normalizedHeader === 'year') {
            row.year = parseInt(values[index]);
          } else if (normalizedHeader === 'category') {
            row.category = values[index];
          } else if (normalizedHeader === 'amount') {
            row.amount = parseFloat(values[index].replace(/[$,]/g, ''));
          }
        });

        // Validate parsed data
        if (row.ward && row.year && row.category && !isNaN(row.amount)) {
          budgetData.push(row);
        }
      }
    }

    console.log(`Parsed ${budgetData.length} valid budget records`);

    if (budgetData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid budget data found in CSV' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert data into municipal_budget table
    const { data, error } = await supabase
      .from('municipal_budget')
      .insert(budgetData);

    if (error) {
      console.error('Error inserting budget data:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to import budget data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${budgetData.length} budget records`,
        recordsImported: budgetData.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in import-csv function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});