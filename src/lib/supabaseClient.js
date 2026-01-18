import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : {
        from: () => ({ select: () => ({ eq: () => ({ single: () => ({}) }) }), insert: () => ({ select: () => ({ single: () => ({}) }) }) }),
        storage: { from: () => ({ upload: () => ({}), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
    } // Mock for build/missing env
