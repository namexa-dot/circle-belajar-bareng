-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('biasa', 'premium');

-- Create enum for content types
CREATE TYPE public.content_type AS ENUM ('artikel', 'video', 'gambar');

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kategori TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nama TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'biasa',
  premium_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create educations table
CREATE TABLE public.educations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  topik TEXT NOT NULL,
  kategori_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  tipe content_type NOT NULL,
  konten TEXT,
  media_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- RLS Policies for educations
CREATE POLICY "Everyone can view non-premium content" 
ON public.educations 
FOR SELECT 
USING (NOT is_premium);

CREATE POLICY "Premium users can view all content" 
ON public.educations 
FOR SELECT 
USING (
  is_premium = false OR 
  (auth.uid() IS NOT NULL AND 
   EXISTS (
     SELECT 1 FROM public.profiles 
     WHERE id = auth.uid() 
     AND role = 'premium' 
     AND (premium_until IS NULL OR premium_until > now())
   ))
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nama', split_part(new.email, '@', 1)),
    'biasa'
  );
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_educations_updated_at
  BEFORE UPDATE ON public.educations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (nama_kategori) VALUES 
  ('Investasi'),
  ('Budgeting'),
  ('Tabungan'),
  ('Cryptocurrency'),
  ('Asuransi'),
  ('Perencanaan Keuangan');

-- Insert sample education content
INSERT INTO public.educations (judul, topik, kategori_id, tipe, konten, is_premium) VALUES 
  (
    'Panduan Investasi untuk Pemula',
    'investasi saham reksadana',
    (SELECT id FROM public.categories WHERE nama_kategori = 'Investasi'),
    'artikel',
    'Investasi adalah cara terbaik untuk mengembangkan kekayaan jangka panjang. Untuk pemula, mulailah dengan reksadana...',
    false
  ),
  (
    'Strategi Budgeting 50/30/20',
    'budgeting pengeluaran keuangan',
    (SELECT id FROM public.categories WHERE nama_kategori = 'Budgeting'),
    'artikel',
    'Aturan 50/30/20 adalah metode budgeting yang membagi pendapatan menjadi tiga kategori utama...',
    false
  ),
  (
    'Analisis Saham Premium',
    'analisis fundamental teknikal saham',
    (SELECT id FROM public.categories WHERE nama_kategori = 'Investasi'),
    'video',
    'Video eksklusif tentang cara menganalisis saham dengan metode fundamental dan teknikal...',
    true
  ),
  (
    'Cryptocurrency untuk Pemula',
    'bitcoin ethereum crypto trading',
    (SELECT id FROM public.categories WHERE nama_kategori = 'Cryptocurrency'),
    'artikel',
    'Panduan lengkap memahami dunia cryptocurrency dan cara memulai investasi digital...',
    false
  );