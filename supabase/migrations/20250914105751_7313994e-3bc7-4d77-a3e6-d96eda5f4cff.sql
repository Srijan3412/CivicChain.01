-- Create municipal_budget table for budget transparency platform
CREATE TABLE IF NOT EXISTS public.municipal_budget (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ward INTEGER NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.municipal_budget ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to budget data
CREATE POLICY "Anyone can view municipal budget data" 
ON public.municipal_budget 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert budget data
CREATE POLICY "Authenticated users can insert budget data" 
ON public.municipal_budget 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'::text);

-- Create policy for authenticated users to update budget data
CREATE POLICY "Authenticated users can update budget data" 
ON public.municipal_budget 
FOR UPDATE 
USING (auth.role() = 'authenticated'::text);

-- Add indexes for better performance
CREATE INDEX idx_municipal_budget_ward_year ON public.municipal_budget(ward, year);
CREATE INDEX idx_municipal_budget_category ON public.municipal_budget(category);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_municipal_budget_updated_at
  BEFORE UPDATE ON public.municipal_budget
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.municipal_budget (ward, category, amount, year) VALUES
  (1, 'Infrastructure', 500000, 2024),
  (1, 'Education', 300000, 2024),
  (1, 'Healthcare', 200000, 2024),
  (1, 'Public Safety', 150000, 2024),
  (1, 'Parks & Recreation', 100000, 2024),
  (2, 'Infrastructure', 750000, 2024),
  (2, 'Education', 450000, 2024),
  (2, 'Healthcare', 250000, 2024),
  (2, 'Public Safety', 200000, 2024),
  (2, 'Parks & Recreation', 120000, 2024),
  (3, 'Infrastructure', 600000, 2024),
  (3, 'Education', 350000, 2024),
  (3, 'Healthcare', 220000, 2024),
  (3, 'Public Safety', 180000, 2024),
  (3, 'Parks & Recreation', 110000, 2024),
  -- Previous year data for comparison
  (1, 'Infrastructure', 480000, 2023),
  (1, 'Education', 280000, 2023),
  (1, 'Healthcare', 190000, 2023),
  (1, 'Public Safety', 140000, 2023),
  (1, 'Parks & Recreation', 95000, 2023),
  (2, 'Infrastructure', 720000, 2023),
  (2, 'Education', 420000, 2023),
  (2, 'Healthcare', 240000, 2023),
  (2, 'Public Safety', 190000, 2023),
  (2, 'Parks & Recreation', 115000, 2023),
  (3, 'Infrastructure', 580000, 2023),
  (3, 'Education', 330000, 2023),
  (3, 'Healthcare', 210000, 2023),
  (3, 'Public Safety', 170000, 2023),
  (3, 'Parks & Recreation', 105000, 2023);