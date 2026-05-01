import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import PlayerListItem from '../../src/components/PlayerListItem';
import { useTheme } from '../../src/context/ThemeContext';
import db from '../../src/services/database';
import mockPlayers from '../consts/players';

type Player = {
  id_jugador?: string;
  id?: string;
  nombre: string;
  nombreJugador?: string;
  posicion?: string;
  dorsal?: number;
};

export default function PlayersScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadPlayers() {
      setLoading(true);
      try {
        const remote = await db.getPlayers();
        if (mounted) {
          // Map API response to local format
          const mapped = remote.map(p => ({
            id_jugador: p.id,
            nombre: p.nombre,
            dorsal: p.dorsal,
            posicion: 'N/A', // API doesn't return posicion in list endpoint
          }));
          setPlayers(mapped.length > 0 ? mapped : mockPlayers);
        }
      } catch (error) {
        console.warn('Error loading players, using mock data:', error);
        if (mounted) setPlayers(mockPlayers);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    loadPlayers();
    return () => { mounted = false; };
  }, []);

  // LÓGICA DE FILTRADO
  // useMemo hace que el filtrado solo se ejecute cuando cambia el texto de 'search'
  const filteredPlayers = useMemo(() => {
    const query = search.toLowerCase().trim();
    
    if (query === '') return players;

    return players.filter((player) => {
      // 1. Buscamos por nombre
      const nameMatch = player.nombre.toLowerCase().includes(query);
      
      // 2. Buscamos por posición
      const positionMatch = (player.posicion || '').toLowerCase().includes(query);
      
      // 3. Buscamos por dorsal (convertimos el número a string)
      const dorsalMatch = (player.dorsal || 0).toString().includes(query);

      return nameMatch || positionMatch || dorsalMatch;
    });
  }, [search, players]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Buscador */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
          <FontAwesome name="search" size={18} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput 
            style={[styles.searchInput, { color: theme.text }]} 
            placeholder="Nombre, posición o dorsal..." 
            placeholderTextColor={theme.textSecondary}
            value={search} 
            onChangeText={setSearch} 
          />
        </View>
      </View>

      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Cargando jugadores...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlayers} // Usamos la lista filtrada en lugar de mockPlayers
          keyExtractor={(item) => item.id_jugador || item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <PlayerListItem 
              player={item} 
              onPress={() => router.push(`/player/${item.id_jugador || item.id}`)} 
            />
          )}
          contentContainerStyle={{ padding: 15 }}
          // ESTADO VACÍO: Si no hay resultados, mostramos este mensaje
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="users" size={50} color={theme.textSecondary} style={{ opacity: 0.3 }} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No se han encontrado jugadores
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  searchContainer: { 
    padding: 15, 
    borderBottomWidth: 1, 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: { 
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  }
});