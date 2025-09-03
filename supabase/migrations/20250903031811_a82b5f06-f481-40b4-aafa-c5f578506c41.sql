-- Fix infinite recursion in profiles RLS policies

-- First, drop all existing policies on profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_select_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_update_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;

-- Create security definer function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create new non-recursive policies
CREATE POLICY "users_can_view_own_profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "admins_can_view_all_profiles" 
ON public.profiles FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "admins_can_update_all_profiles" 
ON public.profiles FOR UPDATE 
USING (public.get_current_user_role() = 'admin');