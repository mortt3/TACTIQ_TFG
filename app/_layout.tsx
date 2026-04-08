import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext'; // IMPORTAMOS EL TEMA

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
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}