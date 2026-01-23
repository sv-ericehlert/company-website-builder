-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'link')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Users can view all portfolio items (public profiles)
CREATE POLICY "Portfolio items are viewable by everyone"
ON public.portfolio_items
FOR SELECT
TO authenticated
USING (true);

-- Users can manage their own portfolio items
CREATE POLICY "Users can insert their own portfolio items"
ON public.portfolio_items
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items"
ON public.portfolio_items
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items"
ON public.portfolio_items
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();