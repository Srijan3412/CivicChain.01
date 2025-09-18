-- Ensure RLS is enabled on all public tables that need it
-- This addresses the security linter warnings

-- Enable RLS on any tables that might not have it enabled
-- (This is idempotent - won't error if already enabled)
ALTER TABLE public.budget_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipal_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;