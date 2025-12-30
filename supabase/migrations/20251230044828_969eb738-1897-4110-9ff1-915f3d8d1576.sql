-- Create membership applications table
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  birthday DATE,
  phone TEXT,
  current_location TEXT,
  origin TEXT,
  professions TEXT[],
  introduction TEXT,
  industry_experience TEXT,
  photo_url TEXT,
  instagram TEXT,
  linkedin TEXT,
  referrals TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (no auth required for insert)
CREATE POLICY "Anyone can submit applications" 
ON public.membership_applications 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view applications (admins)
CREATE POLICY "Authenticated users can view applications" 
ON public.membership_applications 
FOR SELECT 
TO authenticated
USING (true);

-- Only authenticated users can update applications (admins)
CREATE POLICY "Authenticated users can update applications" 
ON public.membership_applications 
FOR UPDATE 
TO authenticated
USING (true);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_membership_applications_updated_at
  BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();