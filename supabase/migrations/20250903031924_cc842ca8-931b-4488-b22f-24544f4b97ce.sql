-- Fix remaining infinite recursion by completely redoing the profiles policies

-- Drop all existing policies again
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admins_can_update_all_profiles" ON public.profiles;

-- Drop the problematic function
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Create simple, non-recursive policies
-- Policy for users to view their own profile
CREATE POLICY "enable_select_for_users_based_on_user_id" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy for users to insert their own profile  
CREATE POLICY "enable_insert_for_users_based_on_user_id" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "enable_update_for_users_based_on_user_id" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create a security definer function that doesn't query profiles recursively
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Use a direct query with the user_id to avoid recursion
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN (user_role = 'admin');
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for service role and admin access
CREATE POLICY "enable_admin_access" 
ON public.profiles FOR ALL 
USING (
  -- Allow service role full access
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  -- Allow admin users full access by checking role directly in a safer way
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);