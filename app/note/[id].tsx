import { NoteEditor } from '@/components/NoteEditor';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function EditNoteScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const colorScheme = useColorScheme();
    return <NoteEditor noteId={id} darkMode={colorScheme === 'dark'} />;
}
