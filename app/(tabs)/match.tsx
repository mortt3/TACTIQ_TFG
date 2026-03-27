// Archivo: app/(tabs)/index.tsx
import { useRouter } from 'expo-router'; // Para navegar a la pantalla de detalles
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import MatchCard from '../../src/components/MatchCard';
import { mockMatches } from '../consts/matches';



export default function MatchListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Cuando tocas un partido, navegamos a la pantalla de detalles pasándole el ID
  const handlePressMatch = (id_partido: number) => {
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
        keyExtractor={(item) => item.id_partido.toString()}
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