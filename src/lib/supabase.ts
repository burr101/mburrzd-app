import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://nkmeeqpymvwqfsjeqwgy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TAyU_bEne0fW2z6-wnRgqg_0vugAa-8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
