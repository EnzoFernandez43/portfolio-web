'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type Proyecto = {
    id: string;
    titulo: string;
    subtitulo: string;
    descripcion: string;
    imagen_url: string;
    github_url: string;
    demo_url: string;
    categoria: string[];
    tecnologias: string[];
    destacado: boolean;
    orden: number;
};

export async function getProyectos() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('orden', { ascending: true });
    if (error) throw error;
    return data as Proyecto[];
}

export async function createProyecto(proyecto: Omit<Proyecto, 'id'>) {
    const supabase = await createClient();
    const { error } = await supabase.from('proyectos').insert([proyecto]);
    if (error) throw error;
    revalidatePath('/proyectos');
    revalidatePath('/admin');
}

export async function updateProyecto(id: string, proyecto: Partial<Proyecto>) {
    const supabase = await createClient();
    const { error } = await supabase.from('proyectos').update(proyecto).eq('id', id);
    if (error) throw error;
    revalidatePath('/proyectos');
    revalidatePath('/admin');
}

export async function deleteProyecto(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('proyectos').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/proyectos');
    revalidatePath('/admin');
}