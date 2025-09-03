-- Add policy to allow admins to update other users' profiles
CREATE POLICY "admins_can_update_all_users" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin_user(auth.uid()));