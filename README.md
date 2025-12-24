# Keep+ Native 📝

A cross-platform note-taking app (Keep/Notion-style) built with Expo, React Native, and Supabase.

## Features

- ✨ **Cross-platform**: Works on iOS, Android, and Web
- 📱 **Android Share Intent**: Share text from any Android app directly to Keep+
- 🎨 **Beautiful UI**: NativeWind (Tailwind CSS) + Gluestack UI
- 🔄 **Real-time sync**: Supabase backend with optimistic updates
- 🏷️ **Tags & Organization**: Filter notes by tags
- 🔍 **Search**: Quick search across all notes
- 📸 **Cover Images**: Add cover images to notes
- 🌓 **Dark mode ready**: Automatic theme support

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the app

   ```bash
   npx expo start
   ```

4. For Android (to test share intent):

   ```bash
   npm run android
   ```

## Android Share Intent

The app supports receiving text shared from other Android apps:

1. Open any app with text (browser, notes, messages, etc.)
2. Select text and tap "Share"
3. Choose "Keep+ Native" from the share menu
4. A new note will be automatically created with the shared text

**Technical details:**
- Uses custom Expo config plugin (`plugins/withShareIntent.js`)
- Integrates `react-native-receive-sharing-intent`
- Automatically creates notes with shared content

## Project Structure

```
app/                    # File-based routing (expo-router)
  index.tsx            # Home screen (note grid)
  note/[id].tsx        # Note editor
components/            # Reusable components
  ui/                  # Gluestack UI primitives
store/                 # Zustand state management
lib/                   # Utilities (Supabase client)
plugins/               # Expo config plugins
```

## Tech Stack

- **Framework**: Expo SDK 54 with new architecture
- **UI**: React Native 0.81.5 + React 19.1
- **Routing**: Expo Router v6 (file-based)
- **Styling**: NativeWind v4 + Gluestack UI
- **State**: Zustand with optimistic updates
- **Backend**: Supabase (PostgreSQL)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
