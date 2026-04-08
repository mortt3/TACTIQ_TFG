// Archivo: app/(tabs)/index.tsx
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import MatchCard from '../../src/components/MatchCard';
import { useTheme } from '../../src/context/ThemeContext';
import mockMatches from '../consts/matches';

export default function MatchListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // LÓGICA DE FILTRADO DE PARTIDOS
  const filteredMatches = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return mockMatches;

    return mockMatches.filter((match) => {
      return (
        match.local_nombre.toLowerCase().includes(query) ||
        match.rival_nombre.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const handlePressMatch = (id_partido: number) => {
    router.push(`/match/${id_partido}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
          <FontAwesome name="search" size={18} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar por equipo..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id_partido.toString()}
        renderItem={({ item }) => (
          <MatchCard 
            match={item} 
            onPress={() => handlePressMatch(item.id_partido)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.textSecondary }}>No hay partidos que coincidan</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: 15, borderBottomWidth: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16 },
  listContent: { padding: 15 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
});