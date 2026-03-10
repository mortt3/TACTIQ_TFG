// Archivo: app/(tabs)/index.tsx
import { useRouter } from 'expo-router'; // Para navegar a la pantalla de detalles
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import MatchCard from '../../src/components/MatchCard';

// MOCK DATA: Simulando lo que nos devolvería la base de datos (Equipos + Partidos)
const mockMatches = [
  {
    id_partido: '1',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png', // Escudo genérico local
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805477.png', // Escudo genérico rival
    status: 'future', // Partido a futuro
    fecha: new Date('2026-04-15T18:00:00'),
  },
  {
    id_partido: '2',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png',
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805481.png',
    status: 'next', // Próximo partido
    fecha: new Date('2026-03-14T12:30:00'),
  },
  {
    id_partido: '3',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png',
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805488.png',
    status: 'played', // Partido ya jugado
    fecha: new Date('2026-03-01T18:00:00'),
    score_local: 34,
    score_rival: 23,
  },
  {
    id_partido: '4',
    local_logo: 'https://cdn-icons-png.flaticon.com/512/805/805504.png',
    rival_logo: 'https://cdn-icons-png.flaticon.com/512/805/805494.png',
    status: 'played',
    fecha: new Date('2026-02-23T18:00:00'),
    score_local: 32,
    score_rival: 37,
  }
];

export default function MatchListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Cuando tocas un partido, navegamos a la pantalla de detalles pasándole el ID
  const handlePressMatch = (id_partido: string) => {
    router.push(`/match/${id_partido}`);
  };

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar partido o equipo..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Listado de Partidos */}
      <FlatList
        data={mockMatches}
        keyExtractor={(item) => item.id_partido}
        renderItem={({ item }) => (
          <MatchCard 
            match={item} 
            onPress={() => handlePressMatch(item.id_partido)} 
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Un fondo gris muy clarito para que las tarjetas resalten
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
});