-- Update current user to admin role for testing
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = '20a8f038-5782-4bef-bf6d-d93b9ffd7105';