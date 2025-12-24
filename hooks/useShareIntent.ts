import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

import { useNoteStore } from '@/store/noteStore';

/**
 * Custom hook to handle Android share intents
 * Automatically creates a new note when text is shared from other apps
 */
export function useShareIntent() {
  const router = useRouter();
  const addNote = useNoteStore((state) => state.addNote);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const handleSharedContent = async (files: any[]) => {
      if (!files || files.length === 0) {
        return;
      }

      const sharedText = files[0]?.text || files[0]?.weblink;
      
      if (!sharedText) {
        return;
      }

      // Create a new note with the shared text
      const newNote = await addNote({
        title: 'Nota condivisa',
        content: sharedText,
        tags: [],
      });

      if (newNote) {
        // Clear the shared data to prevent duplicates
        ReceiveSharingIntent.clearReceivedFiles();
        
        // Navigate to the new note
        setTimeout(() => {
          router.push(`/note/${newNote.id}` as any);
        }, 100);
      }
    };

    const handleError = (error: any) => {
      console.log('Error receiving share intent:', error);
    };

    // Listen for share intents
    ReceiveSharingIntent.getReceivedFiles(
      handleSharedContent,
      handleError,
      'ShareMedia'
    );

    // Cleanup on unmount
    return () => {
      ReceiveSharingIntent.clearReceivedFiles();
    };
  }, [addNote, router]);
}
