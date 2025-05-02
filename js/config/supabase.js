import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabaseUrl = "https://fsnmxswkdyuhbkdmskys.supabase.co";

export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbm14c3drZHl1aGJrZG1za3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjc4MjQsImV4cCI6MjA2MTc0MzgyNH0.FIVaBmAHlmQ5SxPJp-8JgekLV6Bx1L4T9A1HcLe6uOs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
