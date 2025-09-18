import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepartmentSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ value, onChange }) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('municipal_budget')
        .select('account')
        .not('account', 'is', null);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        setDepartments([]);
        return;
      }

      // Extract unique departments and sort alphabetically
      const uniqueDepartments = [...new Set(data.map((item: any) => item.account))]
        .filter(Boolean)
        .sort();

      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load departments. Please try again.",
      });
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="department-select">Department</Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger id="department-select" className="bg-background">
          <SelectValue placeholder={loading ? "Loading departments..." : "Select a department"} />
          {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
        </SelectTrigger>
        <SelectContent className="bg-background border border-border z-50 max-h-60">
          {departments.length === 0 && !loading ? (
            <div className="p-2 text-sm text-muted-foreground">No departments found</div>
          ) : (
            departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DepartmentSelector;