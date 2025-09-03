-- Fix the security warning about function search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;