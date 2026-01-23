-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own approved application" ON public.membership_applications;
DROP POLICY IF EXISTS "Users can update their own approved application" ON public.membership_applications;

-- Create a security definer function to get user email from JWT
CREATE OR REPLACE FUNCTION public.get_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.jwt() ->> 'email'
$$;

-- Recreate policies using the function
CREATE POLICY "Users can view their own approved application"
ON public.membership_applications
FOR SELECT
TO authenticated
USING (
  email = public.get_user_email()
  AND status = 'approved'
);

CREATE POLICY "Users can update their own approved application"
ON public.membership_applications
FOR UPDATE
TO authenticated
USING (
  email = public.get_user_email()
  AND status = 'approved'
)
WITH CHECK (
  email = public.get_user_email()
  AND status = 'approved'
);