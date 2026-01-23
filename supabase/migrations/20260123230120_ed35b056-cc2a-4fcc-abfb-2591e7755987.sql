-- Add frequently_visited_cities column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN frequently_visited_cities text[] DEFAULT NULL;