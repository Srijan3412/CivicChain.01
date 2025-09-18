-- Create citizen_reports table
CREATE TABLE public.citizen_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for citizen_reports
CREATE POLICY "Anyone can submit reports" 
ON public.citizen_reports 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view reports" 
ON public.citizen_reports 
FOR SELECT 
USING (true);

-- Create storage bucket for citizen reports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('citizen_reports', 'citizen_reports', true);

-- Create storage policies for citizen_reports bucket
CREATE POLICY "Anyone can upload citizen report images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'citizen_reports');

CREATE POLICY "Anyone can view citizen report images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'citizen_reports');