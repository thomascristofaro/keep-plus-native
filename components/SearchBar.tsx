import { Box } from '@/components/ui/box';
import { SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import React from 'react';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
}

export const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
    return (
        <Box className="w-full max-w-[600px] mx-auto px-4 py-2">
            <Input className="rounded-full bg-background-100 border-none h-12">
                <InputSlot className="pl-4">
                    <InputIcon as={SearchIcon} />
                </InputSlot>
                <InputField
                    placeholder="Search notes..."
                    value={value}
                    onChangeText={onChangeText}
                    className="text-lg"
                />
            </Input>
        </Box>
    );
};
