import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmmvpvujbwjshxvshpzh.supabase.co'
const supabaseKey = 'sb_publishable_v1RdRa-9cMKBtPTglB4m0g_ZUvMf6wy'

export const supabase = createClient(supabaseUrl, supabaseKey)