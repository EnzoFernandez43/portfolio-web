'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSobreMi() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('sobre_mi').select('*');
    if (error) throw error;
    const map: Record<string, string> = {};
    data.forEach(row => { map[row.id] = row.valor; });
    return map;
}

export async function updateSobreMi(id: string, valor: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('sobre_mi').update({ valor }).eq('id', id);
    if (error) throw error;
    revalidatePath('/sobre-mi');
}