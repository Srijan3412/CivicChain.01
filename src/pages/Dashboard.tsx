import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, Search, BarChart3, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SummaryCards from '@/components/budget/SummaryCards';
import BudgetTable from '@/components/budget/BudgetTable';
import BudgetChart from '@/components/budget/BudgetChart';
import AiInsights from '@/components/budget/AiInsights';
import { CsvImport } from '@/components/budget/CsvImport';
import DepartmentSelector from '@/components/budget/DepartmentSelector';

interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  ward: number;
  year: number;
}

interface BudgetSummary {
  totalBudget: number;
  largestCategory: {
    category: string;
    amount: number;
  } | null;
  yearOverYearChange: number;
}

const Dashboard = () => {
  const [department, setDepartment] = useState('');
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchBudgetData = async () => {
    if (!department) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a department.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-budget', {
        body: {
          department: department
        }
      });

      if (error) {
        throw error;
      }

      setBudgetData(data.budgetData || []);
      setSummary(data.summary || null);
      
      toast({
        title: "Data Loaded",
        description: `Found ${data.budgetData?.length || 0} budget items for ${department}.`,
      });
    } catch (error) {
      console.error('Error fetching budget data:', error);
      toast({
        variant: "destructive",
        title: "Fetch Failed",
        description: "Failed to fetch budget data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Budget Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.email}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8">
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Budget Data Explorer
              </CardTitle>
              <p className="text-muted-foreground">Select a department to analyze municipal budget allocation and spending patterns.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <DepartmentSelector value={department} onChange={setDepartment} />
                </div>
                <div className="md:col-span-1">
                  <Button 
                    onClick={fetchBudgetData} 
                    disabled={loading || !department}
                    className="w-full bg-gradient-primary hover:opacity-90 shadow-md"
                    size="lg"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Search className="mr-2 h-4 w-4" />
                    {loading ? 'Loading...' : 'Analyze Budget'}
                  </Button>
                </div>
                <div className="md:col-span-1">
                  <CsvImport />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="animate-fade-in">
            <SummaryCards summary={summary} />
          </div>
        )}

        {/* Main Content Grid */}
        {budgetData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
            <BudgetTable budgetData={budgetData} department={department} />
            <BudgetChart budgetData={budgetData} />
          </div>
        )}

        {/* AI Insights */}
        <div className="animate-fade-in">
          <AiInsights budgetData={budgetData} department={department} />
        </div>

        {/* Empty State */}
        {!summary && !loading && (
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Ready to Explore Budget Data?</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
                Select a department from the dropdown above and click "Analyze Budget" to view detailed financial insights and visualizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="lg" className="hover-scale">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Sample Data
                </Button>
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
                  <Link to="/insights">
                    <Brain className="mr-2 h-4 w-4" />
                    Try AI Insights
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;