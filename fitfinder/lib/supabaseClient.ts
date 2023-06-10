import { createClient } from '@supabase/supabase-js'
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const supabase = createClient(URL, KEY)
console.log("in supabase")