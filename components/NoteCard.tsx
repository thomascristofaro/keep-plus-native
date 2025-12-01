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
}

export const NoteCard = ({ note, onPress, onLongPress, selected, selectionMode }: NoteCardProps) => {
    return (
        <Link href={`/note/${note.id}` as any} asChild>
            <Pressable onPress={selectionMode ? onPress : undefined} onLongPress={onLongPress} delayLongPress={200}>
                <Box
                    className={`bg-background-0 rounded-lg overflow-hidden mb-4 border ${selected ? 'border-primary-500 border-2' : 'border-outline-100'
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
                        <Text className="font-bold text-lg text-typography-900">{note.title}</Text>
                        {note.content && (
                            <Text className="text-typography-500 text-sm" numberOfLines={5}>
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
            </Pressable>
        </Link>
    );
};
