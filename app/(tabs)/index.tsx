// Archivo: app/(tabs)/index.tsx
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MatchCard from '../../src/components/MatchCard';
import { useTheme } from '../../src/context/ThemeContext';
import db from '../../src/services/database';

export default function MatchListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const loadMatches = useCallback(async () => {
    setLoadingMatches(true);
    try {
      const matchesArray = await db.getMatches();

      const mappedMatches = matchesArray.map((p: any) => ({
        id_partido: p.idPartido,
        local_nombre: p.nombreEquipoLocal || 'Local',
        rival_nombre: p.nombreEquipoVisitante || 'Rival',
        local_logo: 'https://via.placeholder.com/50',
        rival_logo: 'https://via.placeholder.com/50',
        status: new Date(p.fecha) < new Date() ? 'played' : 'future',
        fecha: p.fecha ? new Date(p.fecha) : null,
        score_local: p.golesLocal,
        score_rival: p.golesVisitante,
      }));

      setMatches(mappedMatches);
    } catch (err) {
      console.warn('Failed to load matches from API', err);
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [loadMatches])
  );

  // LÓGICA DE FILTRADO DE PARTIDOS
  const filteredMatches = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return matches;

    return matches.filter((match) => {
      return (
        match.local_nombre.toLowerCase().includes(query) ||
        match.rival_nombre.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, matches]);

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

      {loadingMatches ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.text, marginTop: 10 }}>Cargando partidos...</Text>
        </View>
      ) : (
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
      )}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
});