import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import MatchCard from '../../src/components/MatchCard';
import { useTheme } from '../../src/context/ThemeContext';

interface Partido {
  idPartido: number;
  idEquipoLocal: number;
  idEquipoVisitante: number;
  golesLocal: number;
  golesVisitante: number;
  fecha: string;
  equipoLocal: string;    
  equipoVisitante: string;  
  lugar?: string;
}

export default function MatchListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const [matches, setMatches] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('https://tactiq-tfg-api.onrender.com/api/partidos');
        setMatches(response.data);
      } catch (error) {
        console.error("Error cargando partidos reales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return matches;

    return matches.filter((match) => {
      return (
        match.equipoLocal.toLowerCase().includes(query) ||
        match.equipoVisitante.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, matches]);

  const handlePressMatch = (id_partido: number) => {
    router.push(`/match/${id_partido}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

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
        keyExtractor={(item) => item.idPartido.toString()}
        renderItem={({ item }: { item: any }) => (
          <MatchCard
            match={item}
            onPress={() => handlePressMatch(item.idPartido)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.textSecondary }}>No hay partidos reales en la base de datos</Text>
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