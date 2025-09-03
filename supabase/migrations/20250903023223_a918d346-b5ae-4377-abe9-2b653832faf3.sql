-- Add RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles admin_profile 
  WHERE admin_profile.id = auth.uid() 
  AND admin_profile.role = 'admin'
));

-- Add RLS policy for admins to update all profiles
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles admin_profile 
  WHERE admin_profile.id = auth.uid() 
  AND admin_profile.role = 'admin'
));