-- Public is the safe default: all existing memories stay visible unless an
-- administrator explicitly changes their visibility to private.
ALTER TABLE public.memories
  ADD COLUMN IF NOT EXISTS visibility text;

UPDATE public.memories
SET visibility = 'public'
WHERE visibility IS NULL;

UPDATE public.memories
SET featured = FALSE
WHERE visibility = 'private'
  AND featured IS TRUE;

ALTER TABLE public.memories
  ALTER COLUMN visibility SET DEFAULT 'public',
  ALTER COLUMN visibility SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'memories_visibility_check'
      AND conrelid = 'public.memories'::regclass
  ) THEN
    ALTER TABLE public.memories
      ADD CONSTRAINT memories_visibility_check
      CHECK (visibility IN ('public', 'private'));
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'memories_private_not_featured_check'
      AND conrelid = 'public.memories'::regclass
  ) THEN
    ALTER TABLE public.memories
      ADD CONSTRAINT memories_private_not_featured_check
      CHECK (visibility = 'public' OR COALESCE(featured, FALSE) = FALSE);
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS memories_public_recent_idx
  ON public.memories (date DESC NULLS LAST, year DESC NULLS LAST, created_at DESC NULLS LAST)
  WHERE visibility = 'public';

CREATE INDEX IF NOT EXISTS memories_public_featured_recent_idx
  ON public.memories (date DESC NULLS LAST, year DESC NULLS LAST, created_at DESC NULLS LAST)
  WHERE visibility = 'public' AND featured IS TRUE;
