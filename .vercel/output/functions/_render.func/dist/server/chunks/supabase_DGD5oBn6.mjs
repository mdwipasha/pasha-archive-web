import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://imhvcxwkpyajlcygncby.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaHZjeHdrcHlhamxjeWduY2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDk2ODAsImV4cCI6MjA5NjAyNTY4MH0.SjxoQ8HolJkL518JOarl20Dhk1jKpyjNcxuH_0BdNII"
);

export { supabase as s };
