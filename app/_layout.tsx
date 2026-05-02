import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext'; // IMPORTAMOS EL TEMA
import { setApiBase } from '../src/services/database'; // Importar setApiBase

// 1. Separamos el Stack en un componente interno para poder leer el tema actual
function RootStack() {
  const { theme } = useTheme();

  return (
    <Stack
      // Aplicamos el tema a las cabeceras generales (fondo y flecha/texto)
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
      }}
    >
      {/* Incluir el grupo de pestañas como una pantalla del stack */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Pantallas que deben mostrar flecha de retroceso cuando se navega a ellas */}
      <Stack.Screen name="match/[id]" options={{ title: 'Partido' }} />
      <Stack.Screen name="player/[id]" options={{ title: 'Jugador' }} />
      <Stack.Screen name="upload-video/[id]" options={{ title: 'Subir Vídeo' }} />
    </Stack>
  );
}

// 2. El componente principal envuelve TODA la app con el Provider
export default function RootLayout() {
  useEffect(() => {
    // Configure API base URL when app starts
    // Use the deployed backend by default so Expo can reach the API from any device/emulator.
    // If you need a local override, set __API_BASE_URL before the app boots.
    const apiUrl = (global as any).__API_BASE_URL || 'https://tactiq-tfg-api.onrender.com';
    setApiBase(apiUrl);
    console.log(`[APP INIT] API configured to: ${apiUrl}`);
  }, []);

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}