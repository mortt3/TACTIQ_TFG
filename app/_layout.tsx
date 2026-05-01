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
    // In development, use localhost:5268; in production, use your API server
    const apiUrl = __DEV__ ? 'http://localhost:5268' : 'https://api.tactiq.app';
    setApiBase(apiUrl);
    console.log(`[APP INIT] API configured to: ${apiUrl}`);
  }, []);

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}