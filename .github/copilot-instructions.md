# Keep+ Native - AI Coding Instructions

## Architecture Overview

This is a **cross-platform note-taking app** (Keep/Notion-style) built with **Expo Router** (file-based routing), **React Native**, **Supabase** (backend), **Zustand** (state), **NativeWind/Tailwind** (styling), and **Gluestack UI** (component library).

**Key stack decisions:**
- **Expo SDK 54** with new architecture enabled (`newArchEnabled: true`)
- **React 19.1** and React Native 0.81.5
- **File-based routing**: `app/` directory with `expo-router` v6
- **Styling**: NativeWind v4 (Tailwind for React Native) + Gluestack UI primitives
- **State**: Zustand store pattern with optimistic updates
- **Backend**: Supabase (PostgreSQL) with RLS disabled (public access for now)

## Critical Workflows

### Running the App
```bash
npx expo start          # Start dev server
npm run android         # Android emulator
npm run ios            # iOS simulator
npm run web            # Web browser
```

### Environment Setup
Required environment variables (`.env` not committed):
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Database Schema
See `supabase_schema.sql` for the `notes` table structure:
- Fields: `id`, `title`, `content`, `link`, `cover_image`, `tags[]`, timestamps
- RLS enabled but currently allows public access (`using (true)`)
- Auto-updated `updated_at` via `moddatetime` trigger

## Project-Specific Patterns

### 1. State Management (Zustand + Optimistic Updates)
Location: `store/noteStore.ts`

**Pattern**: All mutations use optimistic updates with rollback on error:
```typescript
updateNote: async (id, updates) => {
    // 1. Update local state immediately
    set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
    // 2. Call Supabase
    const { error } = await supabase.from('notes').update(updates).eq('id', id);
    // 3. On error, refetch to revert
    if (error) get().fetchNotes();
}
```
**Why**: Keeps UI responsive; errors are rare with Supabase.

### 2. Routing with Expo Router
- **Home**: `app/index.tsx` (note grid with search/filter)
- **Note editor**: `app/note/[id].tsx` (dynamic route)
- **New note**: Navigate to `/note` (no id) to create

**Navigation examples:**
```typescript
router.push(`/note/${note.id}` as any);  // Edit existing
router.push("/note" as any);             // Create new
router.back();                           // Go back
```

### 3. Autosave with Debounce
Location: `components/NoteEditor.tsx`

**Pattern**: Use lodash `debounce` (1000ms) for title/content changes:
```typescript
const debouncedSave = useCallback(
    debounce((updates: Partial<Note>) => {
        saveNote(updates);
    }, 1000),
    [saveNote]
);
```
**Known issue** (see `TODO.md`): New notes trigger multiple saves while typing partial titles. Need to ensure single note creation.

### 4. Styling Convention
- **NativeWind classes**: Use Tailwind classes directly on components via `className`
- **Gluestack UI**: Pre-styled primitives from `@/components/ui/*` (Box, Text, Button, etc.)
- **Custom theme**: Extended Tailwind config in `tailwind.config.js` with CSS variable colors (`--color-primary-*`)

**Example:**
```tsx
<Box className="flex-1 bg-white p-4">
  <Text className="font-bold text-lg text-typography-900">
    {note.title}
  </Text>
</Box>
```

### 5. Component Structure
- **Presentational**: `components/*.tsx` (NoteCard, MasonryGrid, SearchBar, etc.)
- **UI primitives**: `components/ui/*` (Gluestack wrappers with NativeWind styles)
- **Editor logic**: `NoteEditor.tsx` handles both create and edit modes (check `noteId` prop)

### 6. Masonry Grid Layout
Location: `components/MasonryGrid.tsx`

**Pattern**: Simple round-robin distribution across 2-3 columns (not true masonry):
```typescript
const numColumns = width > 768 ? 3 : 2;
notes.forEach((note, index) => {
    columns[index % numColumns].push(note);
});
```
**Why**: React Native lacks native masonry layout; this provides good-enough UX.

### 7. Selection Mode Pattern
Location: `app/index.tsx`

**How it works:**
- Long-press a note → enter selection mode
- Tap notes to toggle selection
- Show bulk action toolbar (delete, cancel)
- **Known bug** (see `TODO.md`): Second tap opens note instead of selecting it

## Active Development Focus (TODO.md)

### UI Refinements Needed:
1. **Collapsible sidebar**: Add hamburger menu for TagFilter on desktop/tablet
2. **Search in toolbar**: Move SearchBar to top toolbar for space efficiency
3. **Cover image header**: Replace note editor toolbar with cover image overlay containing back/delete buttons
4. **Link field**: Add `link` input field in NoteEditor below content

### Critical Bugs:
1. **Multi-select broken**: Second note tap opens instead of selecting
2. **Duplicate notes on creation**: Multiple saves fire while typing new note title (debounce issue)

## Integration Points

### Supabase Client
Location: `lib/supabase.ts`

**Pattern**: Platform-aware storage setup:
```typescript
const SupabaseStorage = {
    getItem: (key) => {
        if (Platform.OS === 'web' && typeof window === 'undefined') {
            return Promise.resolve(null);  // SSR safety
        }
        return AsyncStorage.getItem(key);
    },
    // ... setItem, removeItem
};
```
**Why**: Handles SSR for web builds; uses AsyncStorage for native.

### Cross-Platform Considerations
- **SafeAreaView**: Always wrap screen content (handles notches/status bars)
- **KeyboardAvoidingView**: Use in NoteEditor for iOS keyboard behavior
- **Platform checks**: Use `Platform.OS === 'web'` for web-specific logic

## Common Pitfalls

1. **Type assertions**: Routes require `as any` cast due to Expo Router typed routes experiment
2. **GluestackUI imports**: Always import from `@/components/ui/*`, not `@gluestack-ui/themed`
3. **Tags array**: PostgreSQL text array; Supabase auto-converts to/from JS arrays
4. **Image URIs**: External URLs work directly; no need for `require()` for remote images
5. **Debounce cleanup**: Don't forget to cancel debounced saves when component unmounts

## File Aliases
Babel module resolver configured with `@/` alias pointing to project root (see `babel.config.js`).
