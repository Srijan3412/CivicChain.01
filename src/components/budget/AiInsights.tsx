import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  ward: number;
  year: number;
}

interface AiInsightsProps {
  budgetData: BudgetItem[];
  department: string;
}

const AiInsights: React.FC<AiInsightsProps> = ({ budgetData, department }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAiInsights = async () => {
    if (!budgetData || budgetData.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "Please fetch budget data first before analyzing.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-ai-insights', {
        body: {
          budgetData,
          department
        }
      });

      if (error) {
        throw error;
      }

      setInsights(data.insights);
      toast({
        title: "AI Analysis Complete",
        description: "Generated insights for your budget data.",
      });
    } catch (error) {
      console.error('Error getting AI insights:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to generate AI insights. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Powered Budget Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={getAiInsights} 
            disabled={loading || !budgetData.length}
            className="w-full md:w-auto"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Analyzing...' : 'Analyze Budget with AI'}
          </Button>
          
          {insights && (
            <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-accent animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="font-semibold mb-2 text-accent-foreground">AI Analysis Results:</h4>
              <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                {insights}
              </div>
            </div>
          )}
          
          {!insights && !loading && (
            <p className="text-muted-foreground text-sm">
              Click the analyze button to get AI-powered insights about spending patterns, 
              anomalies, and optimization opportunities for this department's budget.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsights;