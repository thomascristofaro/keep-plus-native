import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Note } from '@/store/noteStore';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

interface NoteCardProps {
    note: Note;
    onPress?: () => void;
    onLongPress?: () => void;
    selected?: boolean;
    selectionMode?: boolean;
    darkMode?: boolean;
}

export const NoteCard = ({ note, onPress, onLongPress, selected, selectionMode, darkMode = false }: NoteCardProps) => {
    const CardContent = (
        <Box
            className={`rounded-lg overflow-hidden mb-4 border ${
                selected ? 'border-primary-500 border-2' : (darkMode ? 'border-gray-700' : 'border-outline-100')
            } ${
                darkMode ? 'bg-gray-800' : 'bg-background-0'
            }`}
        >
            {note.cover_image && (
                <Image
                    source={{ uri: note.cover_image }}
                    alt={note.title}
                    className="w-full h-40 object-cover"
                />
            )}
            <VStack className="p-4 space-y-2">
                <Text className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-typography-900'}`}>{note.title}</Text>
                {note.content && (
                    <Text className={`text-sm ${darkMode ? 'text-gray-300' : 'text-typography-500'}`} numberOfLines={5}>
                        {note.content}
                    </Text>
                )}
                {note.tags && note.tags.length > 0 && (
                    <HStack className="flex-wrap gap-2 mt-2">
                        {note.tags.map((tag) => (
                            <Badge key={tag} size="sm" variant="outline" action="info">
                                <BadgeText>{tag}</BadgeText>
                            </Badge>
                        ))}
                    </HStack>
                )}
            </VStack>
        </Box>
    );

    // In selection mode, use Pressable directly without Link
    if (selectionMode) {
        return (
            <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={200}>
                {CardContent}
            </Pressable>
        );
    }

    // Otherwise, use Link for navigation
    return (
        <Link href={`/note/${note.id}` as any} asChild>
            <Pressable onLongPress={onLongPress} delayLongPress={200}>
                {CardContent}
            </Pressable>
        </Link>
    );
};
