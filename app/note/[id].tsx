import { NoteEditor } from '@/components/NoteEditor';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function EditNoteScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <NoteEditor noteId={id} />;
}
