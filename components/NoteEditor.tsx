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
import { SafeAreaView } from 'react-native-safe-area-context';

interface NoteEditorProps {
    noteId?: string; // If undefined, it's a new note
    darkMode?: boolean;
}

export const NoteEditor = ({ noteId, darkMode = false }: NoteEditorProps) => {
    const router = useRouter();
    const { notes, addNote, updateNote, deleteNote } = useNoteStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [link, setLink] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [currentNoteId, setCurrentNoteId] = useState<string | undefined>(noteId);
    const [isCreatingNote, setIsCreatingNote] = useState(false);

    // Load existing note data
    useEffect(() => {
        if (noteId) {
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                setTitle(note.title);
                setContent(note.content || '');
                setLink(note.link || '');
                setCoverImage(note.cover_image || '');
                setTags(note.tags || []);
                setCurrentNoteId(note.id);
            }
        }
    }, [noteId, notes]);

    // ESC key handler for web
    useEffect(() => {
        if (Platform.OS === 'web') {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    router.back();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [router]);

    // Autosave logic with guard against duplicate creation
    const saveNote = useCallback(
        async (updates: Partial<Note>) => {
            if (currentNoteId) {
                // Update existing note
                await updateNote(currentNoteId, updates);
            } else if (!isCreatingNote) {
                // Only create note if we have meaningful content and we're not already creating
                if (updates.title?.trim() || updates.content?.trim()) {
                    setIsCreatingNote(true);
                    const newNote = await addNote({
                        title: updates.title?.trim() || 'Untitled',
                        content: updates.content || '',
                        link: updates.link || null,
                        cover_image: updates.cover_image || null,
                        tags: updates.tags || [],
                    });
                    if (newNote) {
                        setCurrentNoteId(newNote.id);
                    }
                    setIsCreatingNote(false);
                }
            }
        },
        [currentNoteId, addNote, updateNote, isCreatingNote]
    );

    const debouncedSave = useCallback(
        debounce((updates: Partial<Note>) => {
            saveNote(updates);
        }, 1000),
        [saveNote]
    );

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSave.cancel();
        };
    }, [debouncedSave]);

    const handleTitleChange = (text: string) => {
        setTitle(text);
        if (currentNoteId) {
            debouncedSave({ title: text });
        } else if (text.trim()) {
            // For new notes, only save when user stops typing
            debouncedSave({ title: text, content, link, cover_image: coverImage, tags });
        }
    };

    const handleContentChange = (text: string) => {
        setContent(text);
        if (currentNoteId) {
            debouncedSave({ content: text });
        }
    };

    const handleLinkChange = (text: string) => {
        setLink(text);
        if (currentNoteId) {
            debouncedSave({ link: text });
        }
    };

    const handleCoverImageChange = (text: string) => {
        setCoverImage(text);
        if (currentNoteId) {
            debouncedSave({ cover_image: text });
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setTagInput('');
            if (currentNoteId) {
                saveNote({ tags: newTags }); // Save immediately for tags
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(newTags);
        if (currentNoteId) {
            saveNote({ tags: newTags });
        }
    };

    const handleDelete = async () => {
        if (currentNoteId) {
            await deleteNote(currentNoteId);
        }
        router.back();
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <Box className={`flex-1 h-full ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Cover Image Header with Overlaid Controls */}
                <Box className="relative">
                    {coverImage ? (
                        <Box className="relative">
                            <Image
                                source={{ uri: coverImage }}
                                alt="Cover Image"
                                className="w-full h-48 object-cover"
                            />
                            {/* Gradient overlay for better button visibility */}
                            <Box 
                                className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"
                                style={{
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)'
                                }}
                            />
                            {/* Back button - top left */}
                            <Box className="absolute top-4 left-4">
                                <Button 
                                    variant="solid" 
                                    size="sm"
                                    onPress={handleBack} 
                                    className="bg-white/90 rounded-full p-2"
                                >
                                    <ButtonIcon as={ArrowLeftIcon} className="text-typography-900" />
                                </Button>
                            </Box>
                            {/* Delete button - top right */}
                            <Box className="absolute top-4 right-4">
                                <Button 
                                    variant="solid" 
                                    size="sm"
                                    action="negative"
                                    onPress={handleDelete}
                                    className="bg-white/90 rounded-full p-2"
                                >
                                    <ButtonIcon as={TrashIcon} className="text-error-600" />
                                </Button>
                            </Box>
                            {/* Title input - bottom left */}
                            <Box className="absolute bottom-4 left-4 right-4">
                                <TextInput
                                    placeholder="Title"
                                    value={title}
                                    onChangeText={handleTitleChange}
                                    style={{ 
                                        fontSize: 32, 
                                        fontWeight: 'bold', 
                                        color: 'white',
                                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                        textShadowOffset: { width: 0, height: 1 },
                                        textShadowRadius: 3
                                    }}
                                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                />
                            </Box>
                        </Box>
                    ) : (
                        // No cover image - simple toolbar
                        <Box className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-background-50 border-outline-100'}`}>
                            <HStack className="p-4 items-center justify-between">
                                <Button variant="link" onPress={handleBack} className="p-0">
                                    <ButtonIcon as={ArrowLeftIcon} size="xl" className={darkMode ? 'text-gray-100' : 'text-typography-900'} />
                                </Button>
                                <Button variant="link" action="negative" onPress={handleDelete}>
                                    <ButtonIcon as={TrashIcon} />
                                </Button>
                            </HStack>
                            {/* Title input when no cover */}
                            <Box className="px-4 pb-4">
                                <TextInput
                                    placeholder="Title"
                                    value={title}
                                    onChangeText={handleTitleChange}
                                    style={{ fontSize: 32, fontWeight: 'bold', color: darkMode ? '#f3f4f6' : '#000000' }}
                                    placeholderTextColor={darkMode ? '#9CA3AF' : '#A3A3A3'}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>

                <ScrollView className="flex-1 p-4">
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <VStack space="md">
                            {/* Cover Image URL Input */}
                            <Box>
                                <Text className={`font-semibold mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-typography-600'}`}>Cover Image URL</Text>
                                <Input variant="outline" size="md" className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                                    <InputField
                                        placeholder="https://example.com/image.jpg"
                                        value={coverImage}
                                        onChangeText={handleCoverImageChange}
                                        className={darkMode ? 'text-gray-100' : ''}
                                        placeholderTextColor={darkMode ? '#9CA3AF' : undefined}
                                    />
                                </Input>
                            </Box>

                            {/* Content Editor */}
                            <Box className="mt-4">
                                <TextInput
                                    placeholder="Start typing..."
                                    value={content}
                                    onChangeText={handleContentChange}
                                    multiline
                                    style={{ fontSize: 16, minHeight: 200, textAlignVertical: 'top', color: darkMode ? '#f3f4f6' : '#000000' }}
                                    placeholderTextColor={darkMode ? '#9CA3AF' : '#A3A3A3'}
                                />
                            </Box>

                            {/* Link Field */}
                            <Box className="mt-4">
                                <Text className={`font-semibold mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-typography-600'}`}>Link</Text>
                                <Input variant="outline" size="md" className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
                                    <InputField
                                        placeholder="https://example.com"
                                        value={link}
                                        onChangeText={handleLinkChange}
                                        keyboardType="url"
                                        className={darkMode ? 'text-gray-100' : ''}
                                        placeholderTextColor={darkMode ? '#9CA3AF' : undefined}
                                    />
                                </Input>
                            </Box>

                            {/* Tags Section */}
                            <Box className="mt-6">
                                <Text className={`font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-typography-900'}`}>Tags</Text>
                                <HStack className="flex-wrap gap-2 mb-2">
                                    {tags.map((tag) => (
                                        <Button key={tag} size="xs" variant="outline" action="secondary" onPress={() => handleRemoveTag(tag)}>
                                            <ButtonText>{tag} ×</ButtonText>
                                        </Button>
                                    ))}
                                </HStack>
                                <HStack space="sm">
                                    <Input className={`flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                                        <InputField
                                            placeholder="Add a tag..."
                                            value={tagInput}
                                            onChangeText={setTagInput}
                                            onSubmitEditing={handleAddTag}
                                            className={darkMode ? 'text-gray-100' : ''}
                                            placeholderTextColor={darkMode ? '#9CA3AF' : undefined}
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
