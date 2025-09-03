-- Fix the remaining infinite recursion by removing the problematic admin policy

-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "enable_admin_access" ON public.profiles;

-- Create a simple, safe policy for service role access only
CREATE POLICY "service_role_full_access" 
ON public.profiles FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');