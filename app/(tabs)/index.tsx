import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import MatchCard from '../../src/components/MatchCard';
import { useTheme } from '../../src/context/ThemeContext';
<<<<<<< HEAD
import db from '../../src/services/database';
=======

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
>>>>>>> d26a4cea730223ea6012e763d18ddbcc33544bfb

export default function MatchListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Load matches from API on mount
  useEffect(() => {
    let mounted = true;
    async function loadMatches() {
      setLoadingMatches(true);
      try {
        const response = await fetch('http://localhost:5268/api/partidos');
        if (!response.ok) throw new Error('Failed to load matches');
        const data = await response.json();
        
        // Map API response to MatchCard format
        // Note: /api/partidos returns { value: [...], Count: N }
        const matchesArray = data.value || data || [];
        const mappedMatches = matchesArray.map((p: any) => ({
          id_partido: p.idPartido,
          local_nombre: p.nombreEquipoLocal || 'Local',
          rival_nombre: p.nombreEquipoVisitante || 'Rival',
          local_logo: 'https://via.placeholder.com/50', // List endpoint doesn't return logos
          rival_logo: 'https://via.placeholder.com/50',   // They'll load from detail endpoint
          // Determine status based on date (condicion field is about home/away, not match status)
          status: new Date(p.fecha) < new Date() ? 'played' : 'future',
          fecha: new Date(p.fecha),
          score_local: p.golesLocal,
          score_rival: p.golesVisitante,
        }));
        
        if (mounted) setMatches(mappedMatches);
      } catch (err) {
        console.warn('Failed to load matches from API', err);
        if (mounted) setMatches([]);
      } finally {
        if (mounted) setLoadingMatches(false);
      }
    }
    loadMatches();
    return () => { mounted = false; };
  }, []);

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

<<<<<<< HEAD
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
=======
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
>>>>>>> d26a4cea730223ea6012e763d18ddbcc33544bfb
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