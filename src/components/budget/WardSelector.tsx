import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface WardSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const WardSelector: React.FC<WardSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="ward-select">Ward</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="ward-select" className="bg-background">
          <SelectValue placeholder="Select a ward" />
        </SelectTrigger>
        <SelectContent className="bg-background border border-border z-50">
          <SelectItem value="1">Ward 1</SelectItem>
          <SelectItem value="2">Ward 2</SelectItem>
          <SelectItem value="3">Ward 3</SelectItem>
          <SelectItem value="4">Ward 4</SelectItem>
          <SelectItem value="5">Ward 5</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WardSelector;