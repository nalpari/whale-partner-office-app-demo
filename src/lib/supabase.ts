import { createClient } from '@supabase/supabase-js';

// coffee-assistant-with-ai 프로젝트
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zczapgkqnrjbxjgsatxp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjemFwZ2txbnJqYnhqZ3NhdHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MjkwNjgsImV4cCI6MjA3NzIwNTA2OH0.vjGGH2B-mCH5AXS_Ca9ULCABmN_c1nYrF1rF_qRY-nY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

