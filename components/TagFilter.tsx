import { Box } from '@/components/ui/box';
import { CircleIcon, EditIcon, Icon, MoonIcon, SunIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

interface TagFilterProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
    collapsed: boolean;
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export const TagFilter = ({ tags, selectedTag, onSelectTag, collapsed, darkMode = false, onToggleDarkMode }: TagFilterProps) => {
    return (
        <Box className={`${collapsed ? 'w-16' : 'w-64'} h-full border-r p-4 hidden md:flex transition-all flex-col ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-background-50 border-outline-100'
        }`}>
            {!collapsed && <Text className={`font-bold text-xl mb-6 ml-2 ${darkMode ? 'text-gray-100' : 'text-typography-900'}`}>Keep+</Text>}
            <ScrollView className="flex-1">
                <VStack space="sm">
                    <Pressable
                        onPress={() => onSelectTag(null)}
                        className={`p-3 rounded-lg flex-row items-center ${collapsed ? 'justify-center' : ''} ${
                            selectedTag === null 
                                ? (darkMode ? 'bg-primary-900' : 'bg-primary-100')
                                : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-background-100')
                        }`}
                    >
                        <Icon as={EditIcon} size={collapsed ? 'xl' : 'lg'} className={
                            selectedTag === null 
                                ? (darkMode ? 'text-primary-100' : 'text-primary-900')
                                : (darkMode ? 'text-gray-300' : 'text-typography-700')
                        } />
                        {!collapsed && (
                            <Text className={`font-medium ml-3 ${
                                selectedTag === null 
                                    ? (darkMode ? 'text-primary-100' : 'text-primary-900')
                                    : (darkMode ? 'text-gray-300' : 'text-typography-700')
                            }`}>
                                All Notes
                            </Text>
                        )}
                    </Pressable>

                    {tags.map((tag) => (
                        <Pressable
                            key={tag}
                            onPress={() => onSelectTag(tag)}
                            className={`p-3 rounded-lg flex-row items-center ${collapsed ? 'justify-center' : ''} ${
                                selectedTag === tag 
                                    ? (darkMode ? 'bg-primary-900' : 'bg-primary-100')
                                    : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-background-100')
                            }`}
                        >
                            <Icon as={CircleIcon} size={collapsed ? 'xl' : 'lg'} className={
                                selectedTag === tag 
                                    ? (darkMode ? 'text-primary-100' : 'text-primary-900')
                                    : (darkMode ? 'text-gray-300' : 'text-typography-700')
                            } />
                            {!collapsed && (
                                <Text className={`font-medium ml-3 ${
                                    selectedTag === tag 
                                        ? (darkMode ? 'text-primary-100' : 'text-primary-900')
                                        : (darkMode ? 'text-gray-300' : 'text-typography-700')
                                }`}>
                                    {tag}
                                </Text>
                            )}
                        </Pressable>
                    ))}
                </VStack>
            </ScrollView>
            
            {/* Dark Mode Toggle at Bottom */}
            {onToggleDarkMode && (
                <Box className={`border-t pt-4 mt-4 ${darkMode ? 'border-gray-700' : 'border-outline-100'}`}>
                    <Pressable
                        onPress={onToggleDarkMode}
                        className={`p-3 rounded-lg flex-row items-center ${collapsed ? 'justify-center' : ''} ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-background-100'
                        }`}
                    >
                        <Icon as={darkMode ? SunIcon : MoonIcon} size={collapsed ? 'xl' : 'lg'} className={darkMode ? 'text-gray-300' : 'text-typography-700'} />
                        {!collapsed && (
                            <Text className={`font-medium ml-3 ${darkMode ? 'text-gray-300' : 'text-typography-700'}`}>
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </Text>
                        )}
                    </Pressable>
                </Box>
            )}
        </Box>
    );
};
