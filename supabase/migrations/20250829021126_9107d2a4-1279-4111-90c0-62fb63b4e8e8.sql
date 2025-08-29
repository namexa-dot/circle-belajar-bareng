-- Fix RLS policy for transactions table to allow service role insertions
-- Drop existing policy and recreate with proper permissions

DROP POLICY IF EXISTS "Insert transactions for authenticated users" ON public.transactions;

-- Create new policy that allows both authenticated users and service role to insert
CREATE POLICY "Insert transactions for authenticated users and service role" 
ON public.transactions 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (auth.jwt() ->> 'role' = 'service_role')
);

-- Also ensure service role can bypass RLS for this operation
-- by creating a separate policy for service role updates
DROP POLICY IF EXISTS "Update transactions via service role" ON public.transactions;

CREATE POLICY "Update transactions via service role and webhook" 
ON public.transactions 
FOR UPDATE 
USING (
  (auth.jwt() ->> 'role' = 'service_role') OR
  (auth.uid() = user_id)
);