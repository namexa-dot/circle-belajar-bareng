-- Fix the function search path mutable issue by setting proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, nama, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nama', split_part(new.email, '@', 1)),
    'biasa'
  );
  RETURN new;
END;
$function$;

-- Fix the update timestamp function by setting search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;