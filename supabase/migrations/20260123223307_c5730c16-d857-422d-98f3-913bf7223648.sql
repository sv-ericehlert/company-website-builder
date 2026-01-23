-- Extend profiles to store user-editable profile fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birthday date,
  ADD COLUMN IF NOT EXISTS current_location text,
  ADD COLUMN IF NOT EXISTS origin text,
  ADD COLUMN IF NOT EXISTS professions text[],
  ADD COLUMN IF NOT EXISTS introduction text,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS linkedin text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS company text;

-- Keep updated_at fresh
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Harden public application submission policy (fixes "RLS Policy Always True" warning)
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.membership_applications;
CREATE POLICY "Anyone can submit applications"
ON public.membership_applications
FOR INSERT
TO public
WITH CHECK (
  status = 'pending'
  AND reviewed_by IS NULL
  AND reviewed_at IS NULL
);