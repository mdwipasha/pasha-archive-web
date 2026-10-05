-- Keep the three newest featured records and normalize any pre-existing excess.
WITH ranked_featured AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      ORDER BY date DESC NULLS LAST, year DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
    ) AS position
  FROM public.memories
  WHERE featured IS TRUE
)
UPDATE public.memories AS memories
SET featured = FALSE
FROM ranked_featured
WHERE memories.id = ranked_featured.id
  AND ranked_featured.position > 3;

-- Support the public featured strip, admin pagination, relations, and comments.
CREATE INDEX IF NOT EXISTS memories_created_at_desc_idx
  ON public.memories (created_at DESC);

CREATE INDEX IF NOT EXISTS memories_featured_recent_idx
  ON public.memories (date DESC NULLS LAST, year DESC NULLS LAST, created_at DESC NULLS LAST)
  WHERE featured IS TRUE;

CREATE INDEX IF NOT EXISTS memory_tags_memory_id_idx
  ON public.memory_tags (memory_id);

CREATE INDEX IF NOT EXISTS memory_people_memory_id_idx
  ON public.memory_people (memory_id);

CREATE INDEX IF NOT EXISTS memory_comments_memory_created_at_idx
  ON public.memory_comments (memory_id, created_at DESC);

CREATE INDEX IF NOT EXISTS memory_liked_visitors_memory_visitor_idx
  ON public.memory_liked_visitors (memory_id, visitor_id);

-- An application check improves feedback, but this trigger is the authoritative
-- guard against concurrent inserts or direct API writes.
CREATE OR REPLACE FUNCTION public.enforce_max_featured_memories()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.featured IS TRUE
    AND (TG_OP = 'INSERT' OR OLD.featured IS DISTINCT FROM TRUE) THEN
    PERFORM pg_advisory_xact_lock(20261005);

    IF (
      SELECT COUNT(*)
      FROM public.memories
      WHERE featured IS TRUE
        AND (TG_OP = 'INSERT' OR id <> NEW.id)
    ) >= 3 THEN
      RAISE EXCEPTION 'Only three memories can be featured at one time.'
        USING ERRCODE = '23514';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS memories_featured_limit ON public.memories;

CREATE TRIGGER memories_featured_limit
BEFORE INSERT OR UPDATE OF featured ON public.memories
FOR EACH ROW
EXECUTE FUNCTION public.enforce_max_featured_memories();
