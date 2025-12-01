import { MasonryGrid } from '@/components/MasonryGrid';
import { SearchBar } from '@/components/SearchBar';
import { TagFilter } from '@/components/TagFilter';
import { Box } from '@/components/ui/box';
import { Fab, FabIcon } from '@/components/ui/fab';
import { HStack } from '@/components/ui/hstack';
import { AddIcon, CloseIcon, TrashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNoteStore } from '@/store/noteStore';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { notes, fetchNotes, loading, deleteNotes } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  // Extract unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag ? note.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleNoteLongPress = (note: any) => {
    setSelectionMode(true);
    setSelectedNotes([note.id]);
  };

  const handleNotePress = (note: any) => {
    if (selectionMode) {
      if (selectedNotes.includes(note.id)) {
        const newSelected = selectedNotes.filter((id) => id !== note.id);
        setSelectedNotes(newSelected);
        if (newSelected.length === 0) {
          setSelectionMode(false);
        }
      } else {
        setSelectedNotes([...selectedNotes, note.id]);
      }
    } else {
      router.push(`/note/${note.id}` as any);
    }
  };

  const handleBulkDelete = async () => {
    await deleteNotes(selectedNotes);
    setSelectionMode(false);
    setSelectedNotes([]);
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedNotes([]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HStack className="flex-1">
        {/* Left Sidebar for Desktop/Tablet */}
        <TagFilter tags={allTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />

        <Box className="flex-1 relative">
          {/* Header with Search or Selection Toolbar */}
          <Box className="pt-4 pb-2 bg-white z-10">
            {selectionMode ? (
              <HStack className="px-4 h-12 items-center justify-between bg-primary-100 rounded-lg mx-4">
                <Text className="font-bold text-primary-900">{selectedNotes.length} selected</Text>
                <HStack space="md">
                  <Fab size="sm" placement="top right" onPress={handleBulkDelete} className="bg-error-500 relative">
                    <FabIcon as={TrashIcon} />
                  </Fab>
                  <Fab size="sm" placement="top right" onPress={cancelSelection} className="bg-secondary-500 relative ml-2">
                    <FabIcon as={CloseIcon} />
                  </Fab>
                </HStack>
              </HStack>
            ) : (
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            )}
          </Box>

          {/* Main Content */}
          <MasonryGrid
            notes={filteredNotes}
            onNotePress={handleNotePress}
            onNoteLongPress={handleNoteLongPress}
            selectedNotes={selectedNotes}
            selectionMode={selectionMode}
          />

          {/* FAB for adding new note */}
          {!selectionMode && (
            <Link href={"/note" as any} asChild>
              <Fab
                size="lg"
                placement="bottom right"
                isHovered={false}
                isDisabled={false}
                isPressed={false}
              >
                <FabIcon as={AddIcon} />
              </Fab>
            </Link>
          )}
        </Box>
      </HStack>
    </SafeAreaView>
  );
}
