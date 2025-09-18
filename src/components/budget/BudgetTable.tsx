import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Corrected BudgetItem interface to match the database schema
interface BudgetItem {
  id: string;
  account: string;
  glcode: string;
  budget_a: number;
  used_amt: number;
  remaining_amt: number;
  account_budget_a: string;
}

interface BudgetTableProps {
  budgetData: BudgetItem[];
  department: string;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ budgetData, department }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalUsedAmount = budgetData.reduce((sum, item) => sum + Number(item.used_amt), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Data - {department}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            Municipal budget allocation by category
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetData.map((item) => {
              const percentage = totalUsedAmount > 0 
                ? ((Number(item.used_amt) / totalUsedAmount) * 100).toFixed(1) 
                : '0';
              return (
                <TableRow key={item.id}>
                  {/* Correctly using 'account_budget_a' for the category display */}
                  <TableCell className="font-medium">{item.account_budget_a}</TableCell>
                  {/* Correctly using 'used_amt' for the amount display */}
                  <TableCell className="text-right">{formatCurrency(Number(item.used_amt))}</TableCell>
                  <TableCell className="text-right">{percentage}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BudgetTable;
