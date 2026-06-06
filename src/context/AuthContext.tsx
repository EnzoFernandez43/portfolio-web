'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext<{ session: Session | null; isAdmin: boolean }>({
    session: null,
    isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, isAdmin: !!session }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);