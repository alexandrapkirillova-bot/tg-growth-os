-- Run this in the Supabase SQL Editor to auto-assign founder/free plans on signup.
-- The first 20 users get plan = 'founder', the rest get plan = 'free'.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  founder_count int;
BEGIN
  SELECT COUNT(*) INTO founder_count
  FROM public.users
  WHERE plan = 'founder';

  IF founder_count < 20 THEN
    INSERT INTO public.users (id, email, plan)
    VALUES (new.id, new.email, 'founder');
  ELSE
    INSERT INTO public.users (id, email, plan)
    VALUES (new.id, new.email, 'free');
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
