import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://ltqrimjyvoidstbzfffz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cXJpbWp5dm9pZHN0YnpmZmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDU5MTEsImV4cCI6MjA5MTMyMTkxMX0.GXYtN-MDu9S_izoLb44c47o1HHrMKnEIaWIL2_LoQck";

export const supabase = createClient(supabaseUrl, supabaseKey);