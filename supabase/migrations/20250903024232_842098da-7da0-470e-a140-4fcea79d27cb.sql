-- Drop all existing policies on profiles table to fix infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can select all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create correct, non-recursive policies
CREATE POLICY "users_select_own_profile" ON public.profiles
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.profiles
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Admin policies that don't cause recursion
CREATE POLICY "admin_select_all_profiles" ON public.profiles
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "admin_update_all_profiles" ON public.profiles
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );