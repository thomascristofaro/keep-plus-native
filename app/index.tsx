import { MasonryGrid } from '@/components/MasonryGrid';
import { SearchBar } from '@/components/SearchBar';
import { TagFilter } from '@/components/TagFilter';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Fab, FabIcon } from '@/components/ui/fab';
import { HStack } from '@/components/ui/hstack';
import { AddIcon, CloseIcon, MenuIcon, TrashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNoteStore } from '@/store/noteStore';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { notes, fetchNotes, loading, deleteNotes } = useNoteStore();
  const systemColorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(systemColorScheme === 'dark');
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    setDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#1a1a1a' : 'white' }}>
      <Box className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Top Toolbar - Full Width */}
        <HStack className={`px-4 py-3 border-b items-center w-full ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-outline-100'
        }`}>
          {/* Hamburger Menu Button */}
          <Button 
            variant="link" 
            onPress={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="p-2 mr-2 hidden md:flex"
          >
            <ButtonIcon as={MenuIcon} size="xl" className={darkMode ? 'text-gray-100' : 'text-typography-900'} />
          </Button>

          {/* Keep+ Title */}
          <Text className={`font-bold text-xl mr-4 ${darkMode ? 'text-gray-100' : 'text-typography-900'}`}>Keep+</Text>

          {/* Search Bar (takes remaining space) */}
          {!selectionMode && (
            <Box className="flex-1 max-w-md">
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </Box>
          )}

          {/* Selection Mode Toolbar */}
          {selectionMode && (
            <HStack className="flex-1 items-center justify-between">
              <Text className="font-bold text-primary-900">{selectedNotes.length} selected</Text>
              <HStack space="md">
                <Button variant="link" action="negative" onPress={handleBulkDelete}>
                  <ButtonIcon as={TrashIcon} size="xl" />
                </Button>
                <Button variant="link" onPress={cancelSelection}>
                  <ButtonIcon as={CloseIcon} size="xl" />
                </Button>
              </HStack>
            </HStack>
          )}
        </HStack>

        {/* Content Area with Sidebar */}
        <HStack className="flex-1">
          {/* Left Sidebar for Desktop/Tablet */}
          <TagFilter 
            tags={allTags} 
            selectedTag={selectedTag} 
            onSelectTag={setSelectedTag}
            collapsed={sidebarCollapsed}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />

          <Box className="flex-1 relative">

          {/* Main Content */}
          <MasonryGrid
            notes={filteredNotes}
            onNotePress={handleNotePress}
            onNoteLongPress={handleNoteLongPress}
            selectedNotes={selectedNotes}
            selectionMode={selectionMode}
            darkMode={darkMode}
          />

          {/* FAB for adding new note */}
          {!selectionMode && (
            <Link href="/note" as any asChild>
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
      </Box>
    </SafeAreaView>
  );
}
