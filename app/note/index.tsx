import { NoteEditor } from '@/components/NoteEditor';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function CreateNoteScreen() {
    const colorScheme = useColorScheme();
    return <NoteEditor darkMode={colorScheme === 'dark'} />;
}
