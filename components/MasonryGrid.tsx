import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Note } from '@/store/noteStore';
import React from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { NoteCard } from './NoteCard';

interface MasonryGridProps {
    notes: Note[];
    onNotePress?: (note: Note) => void;
    onNoteLongPress?: (note: Note) => void;
    selectedNotes?: string[];
    selectionMode?: boolean;
}

export const MasonryGrid = ({
    notes,
    onNotePress,
    onNoteLongPress,
    selectedNotes = [],
    selectionMode = false,
}: MasonryGridProps) => {
    const { width } = useWindowDimensions();
    const numColumns = width > 768 ? 3 : 2; // Simple responsive breakpoint

    const columns: Note[][] = Array.from({ length: numColumns }, () => []);

    notes.forEach((note, index) => {
        columns[index % numColumns].push(note);
    });

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <HStack space="md" className="items-start">
                {columns.map((columnNotes, colIndex) => (
                    <VStack key={colIndex} space="md" className="flex-1">
                        {columnNotes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onPress={() => onNotePress?.(note)}
                                onLongPress={() => onNoteLongPress?.(note)}
                                selected={selectedNotes.includes(note.id)}
                                selectionMode={selectionMode}
                            />
                        ))}
                    </VStack>
                ))}
            </HStack>
        </ScrollView>
    );
};
