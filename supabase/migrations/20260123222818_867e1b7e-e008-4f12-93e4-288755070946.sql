-- Allow users to view their own approved application by email
CREATE POLICY "Users can view their own approved application"
ON public.membership_applications
FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND status = 'approved'
);

-- Allow users to update their own approved application
CREATE POLICY "Users can update their own approved application"
ON public.membership_applications
FOR UPDATE
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND status = 'approved'
)
WITH CHECK (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND status = 'approved'
);