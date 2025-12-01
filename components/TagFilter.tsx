import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

interface TagFilterProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

export const TagFilter = ({ tags, selectedTag, onSelectTag }: TagFilterProps) => {
    return (
        <Box className="w-64 h-full bg-background-50 border-r border-outline-100 p-4 hidden md:flex">
            <Text className="font-bold text-xl mb-6 ml-2">Keep+</Text>
            <ScrollView>
                <VStack space="sm">
                    <Pressable
                        onPress={() => onSelectTag(null)}
                        className={`p-3 rounded-lg flex-row items-center ${selectedTag === null ? 'bg-primary-100' : 'hover:bg-background-100'
                            }`}
                    >
                        {/* Use a generic icon or text for "All Notes" */}
                        <Text className={`font-medium ${selectedTag === null ? 'text-primary-900' : 'text-typography-700'}`}>
                            All Notes
                        </Text>
                    </Pressable>

                    {tags.map((tag) => (
                        <Pressable
                            key={tag}
                            onPress={() => onSelectTag(tag)}
                            className={`p-3 rounded-lg flex-row items-center ${selectedTag === tag ? 'bg-primary-100' : 'hover:bg-background-100'
                                }`}
                        >
                            <Text className={`font-medium ${selectedTag === tag ? 'text-primary-900' : 'text-typography-700'}`}>
                                # {tag}
                            </Text>
                        </Pressable>
                    ))}
                </VStack>
            </ScrollView>
        </Box>
    );
};
