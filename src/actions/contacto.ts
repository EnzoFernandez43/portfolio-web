'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getContacto() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('contacto').select('*');
    if (error) throw error;
    const map: Record<string, string> = {};
    data.forEach(row => { map[row.id] = row.valor; });
    return map;
}

export async function updateContacto(id: string, valor: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('contacto').update({ valor }).eq('id', id);
    if (error) throw error;
    revalidatePath('/contacto');
}