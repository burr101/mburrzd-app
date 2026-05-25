import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signInWithApple: (identityToken: string, fullName?: { givenName?: string | null } | null) => Promise<void>;
  signOut: () => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
  clearError: () => void;
}

function extractUser(supabaseUser: any): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    firstName: supabaseUser.user_metadata?.first_name ?? supabaseUser.email?.split('@')[0] ?? 'Member',
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      set({ user: extractUser(data.session.user) });
    }
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ? extractUser(session.user) : null });
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set({ loading: false, user: data.user ? extractUser(data.user) : null });
  },

  signUp: async (email, password, firstName, lastName) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    set({ loading: false, user: data.user ? extractUser(data.user) : null });
  },

  signInWithApple: async (identityToken, fullName) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: identityToken,
    });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    // Save first name on first Apple sign-in (Apple only sends it once)
    if (fullName?.givenName && data.user) {
      await supabase.auth.updateUser({ data: { first_name: fullName.givenName } });
    }
    set({ loading: false, user: data.user ? extractUser(data.user) : null });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  requestAccountDeletion: async () => {
    // Calls a Supabase database function that deletes the authenticated user's account
    // See README for the SQL needed in Supabase dashboard to enable this
    const { error } = await supabase.rpc('delete_user');
    if (error) {
      // Fallback: mark for deletion if the DB function isn't set up yet
      await supabase.auth.updateUser({ data: { deletion_requested: true, deletion_requested_at: new Date().toISOString() } });
    }
    await supabase.auth.signOut();
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));
