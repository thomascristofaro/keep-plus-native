import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { ArrowLeftIcon, TrashIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Note, useNoteStore } from '@/store/noteStore';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';

interface NoteEditorProps {
    noteId?: string; // If undefined, it's a new note
}

export const NoteEditor = ({ noteId }: NoteEditorProps) => {
    const router = useRouter();
    const { notes, addNote, updateNote, deleteNote } = useNoteStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [currentNoteId, setCurrentNoteId] = useState<string | undefined>(noteId);

    // Load existing note data
    useEffect(() => {
        if (noteId) {
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                setTitle(note.title);
                setContent(note.content || '');
                setCoverImage(note.cover_image || '');
                setTags(note.tags || []);
            }
        }
    }, [noteId, notes]);

    // Autosave logic
    const saveNote = useCallback(
        async (updates: Partial<Note>) => {
            if (currentNoteId) {
                await updateNote(currentNoteId, updates);
            } else {
                // Create new note if it doesn't exist yet and we have some content
                if (updates.title || updates.content) {
                    const newNote = await addNote({
                        title: title || 'Untitled', // Ensure title is not empty for creation if possible, or handle it
                        ...updates,
                    });
                    if (newNote) {
                        setCurrentNoteId(newNote.id);
                        // Optionally update URL without reload if possible, or just keep local state
                    }
                }
            }
        },
        [currentNoteId, title, addNote, updateNote]
    );

    const debouncedSave = useCallback(
        debounce((updates: Partial<Note>) => {
            saveNote(updates);
        }, 1000),
        [saveNote]
    );

    const handleTitleChange = (text: string) => {
        setTitle(text);
        debouncedSave({ title: text });
    };

    const handleContentChange = (text: string) => {
        setContent(text);
        debouncedSave({ content: text });
    };

    const handleCoverImageChange = (text: string) => {
        setCoverImage(text);
        debouncedSave({ cover_image: text });
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setTagInput('');
            saveNote({ tags: newTags }); // Save immediately for tags
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(newTags);
        saveNote({ tags: newTags });
    };

    const handleDelete = async () => {
        if (currentNoteId) {
            await deleteNote(currentNoteId);
        }
        router.back();
    };

    return (
        <Box className="flex-1 bg-white h-full">
            <SafeAreaView style={{ flex: 1 }}>
                <HStack className="p-4 items-center justify-between border-b border-outline-100">
                    <Button variant="link" onPress={() => router.back()} className="p-0">
                        <ButtonIcon as={ArrowLeftIcon} size="xl" className="text-typography-900" />
                    </Button>
                    <Button variant="link" action="negative" onPress={handleDelete}>
                        <ButtonIcon as={TrashIcon} />
                    </Button>
                </HStack>

                <ScrollView className="flex-1 p-4">
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <VStack space="md">
                            <Input variant="outline" size="md" className="mb-4">
                                <InputField
                                    placeholder="Cover Image URL"
                                    value={coverImage}
                                    onChangeText={handleCoverImageChange}
                                />
                            </Input>

                            {coverImage ? (
                                <Image
                                    source={{ uri: coverImage }}
                                    alt="Cover Image"
                                    className="w-full h-48 rounded-lg mb-4 object-cover"
                                />
                            ) : null}

                            <TextInput
                                placeholder="Title"
                                value={title}
                                onChangeText={handleTitleChange}
                                style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}
                                placeholderTextColor="#A3A3A3"
                            />

                            <TextInput
                                placeholder="Start typing..."
                                value={content}
                                onChangeText={handleContentChange}
                                multiline
                                style={{ fontSize: 16, minHeight: 200, textAlignVertical: 'top' }}
                                placeholderTextColor="#A3A3A3"
                            />

                            <Box className="mt-8">
                                <Text className="font-bold mb-2">Tags</Text>
                                <HStack className="flex-wrap gap-2 mb-2">
                                    {tags.map((tag) => (
                                        <Button key={tag} size="xs" variant="outline" action="secondary" onPress={() => handleRemoveTag(tag)}>
                                            <ButtonText>{tag} ×</ButtonText>
                                        </Button>
                                    ))}
                                </HStack>
                                <HStack space="sm">
                                    <Input className="flex-1">
                                        <InputField
                                            placeholder="Add a tag..."
                                            value={tagInput}
                                            onChangeText={setTagInput}
                                            onSubmitEditing={handleAddTag}
                                        />
                                    </Input>
                                    <Button onPress={handleAddTag} size="sm">
                                        <ButtonText>Add</ButtonText>
                                    </Button>
                                </HStack>
                            </Box>
                        </VStack>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
        </Box>
    );
};

import { SafeAreaView } from 'react-native-safe-area-context';
