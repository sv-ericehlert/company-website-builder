-- Add cover photo column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cover_url text;