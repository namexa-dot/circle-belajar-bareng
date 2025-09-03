-- Add policy to allow admins to view all user profiles
CREATE POLICY "admins_can_view_all_users" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin_user(auth.uid()));