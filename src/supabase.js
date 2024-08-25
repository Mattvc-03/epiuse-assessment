import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// console.log('Supabase Key:',supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey);
