-- Tighten access to membership applications (PII)
-- Replace overly permissive SELECT/UPDATE policies with admin-only policies

BEGIN;

-- Drop permissive policies
DROP POLICY IF EXISTS "Authenticated users can view applications" ON public.membership_applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON public.membership_applications;

-- Admin-only read access
CREATE POLICY "Admins can view applications"
ON public.membership_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admin-only update access (both gate access and enforce admin on writes)
CREATE POLICY "Admins can update applications"
ON public.membership_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

COMMIT;