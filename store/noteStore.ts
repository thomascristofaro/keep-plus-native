import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Note {
    id: string;
    title: string;
    content: string | null;
    link: string | null;
    cover_image: string | null;
    tags: string[];
    created_at: string;
    updated_at: string;
}

interface NoteState {
    notes: Note[];
    loading: boolean;
    fetchNotes: () => Promise<void>;
    addNote: (note: Partial<Note>) => Promise<Note | null>;
    updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    deleteNotes: (ids: string[]) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
    notes: [],
    loading: false,

    fetchNotes: async () => {
        set({ loading: true });
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching notes:', error);
        } else {
            set({ notes: data as Note[] });
        }
        set({ loading: false });
    },

    addNote: async (note) => {
        const { data, error } = await supabase
            .from('notes')
            .insert([note])
            .select()
            .single();

        if (error) {
            console.error('Error adding note:', error);
            return null;
        } else {
            set((state) => ({ notes: [data as Note, ...state.notes] }));
            return data as Note;
        }
    },

    updateNote: async (id, updates) => {
        // Optimistic update
        set((state) => ({
            notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        }));

        const { error } = await supabase
            .from('notes')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error updating note:', error);
            // Revert if needed (omitted for simplicity, but recommended for prod)
            get().fetchNotes();
        }
    },

    deleteNote: async (id) => {
        set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
        }));

        const { error } = await supabase.from('notes').delete().eq('id', id);

        if (error) {
            console.error('Error deleting note:', error);
            get().fetchNotes();
        }
    },

    deleteNotes: async (ids) => {
        set((state) => ({
            notes: state.notes.filter((n) => !ids.includes(n.id)),
        }));

        const { error } = await supabase.from('notes').delete().in('id', ids);

        if (error) {
            console.error('Error deleting notes:', error);
            get().fetchNotes();
        }
    },
}));
