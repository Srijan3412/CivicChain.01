import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface YearSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  // Generate years from current year back to 5 years ago
  for (let i = 0; i < 6; i++) {
    years.push(currentYear - i);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="year-select">Year</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="year-select" className="bg-background">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent className="bg-background border border-border z-50">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelector;