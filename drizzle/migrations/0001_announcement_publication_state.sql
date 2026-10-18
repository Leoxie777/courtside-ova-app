ALTER TABLE public.announcements ADD COLUMN active boolean NOT NULL DEFAULT true;
COMMENT ON COLUMN public.announcements.active IS 'Published when true; draft or deactivated when false.';
ALTER POLICY "Public announcements" ON public.announcements USING (active = true);