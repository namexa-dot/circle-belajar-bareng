-- Create RLS policies for admin operations

-- Categories: Allow admin to insert, update, delete
CREATE POLICY "Admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Educations: Allow admin to insert, update, delete
CREATE POLICY "Admins can insert educations" 
ON public.educations 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update educations" 
ON public.educations 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete educations" 
ON public.educations 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create premium packages table for managing pricing
CREATE TABLE public.premium_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on premium_packages
ALTER TABLE public.premium_packages ENABLE ROW LEVEL SECURITY;

-- Policies for premium_packages (public read, admin write)
CREATE POLICY "Everyone can view active packages" 
ON public.premium_packages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage packages" 
ON public.premium_packages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Insert default premium packages
INSERT INTO public.premium_packages (name, duration_months, price, description, is_popular) VALUES
('1 Bulan', 1, 40000, 'Akses premium selama 1 bulan', false),
('1 Tahun', 12, 400000, 'Akses premium selama 1 tahun - Hemat Rp 80.000!', true);

-- Add trigger for updated_at
CREATE TRIGGER update_premium_packages_updated_at
BEFORE UPDATE ON public.premium_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();