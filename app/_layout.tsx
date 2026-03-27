import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      {/* Incluir el grupo de pestañas como una pantalla del stack */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Pantallas que deben mostrar flecha de retroceso cuando se navega a ellas */}
      <Stack.Screen name="match/[id]" options={{ title: 'Partido' }} />
      <Stack.Screen name="player/[id]" options={{ title: 'Jugador' }} />
      <Stack.Screen name="upload-video/[id]" options={{ title: 'Subir Vídeo' }} />
    </Stack>
  );
}
