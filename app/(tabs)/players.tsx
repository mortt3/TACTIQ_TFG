import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react'; // Añadido useEffect
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import PlayerListItem from '../../src/components/PlayerListItem';
import { useTheme } from '../../src/context/ThemeContext';

interface Jugador {
  idJugador: number;     
  nombreJugador: string; 
  dorsal: number;
  idPosicion: string;   
  edad: string;
  imagenJugador?: string;
}

export default function PlayersScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [search, setSearch] = useState('');

  // estados para api
  const [players, setPlayers] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);

  //conectarse  a la api para datos reales
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('https://tactiq-tfg-api.onrender.com/api/Jugadores');
        setPlayers(response.data);
      } catch (error) {
        console.error("Error cargando jugadores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // filtrado
  const filteredPlayers = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (query === '') return players;

    return players.filter((player) => {
      const nameMatch = player.nombreJugador?.toLowerCase().includes(query);
      const dorsalMatch = player.dorsal?.toString().includes(query);

      const posMatch = player.idPosicion?.toString().includes(query);

      return nameMatch || dorsalMatch || posMatch;
    });
  }, [search, players]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.primary} />;
  }

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

      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.idJugador.toString()}
        renderItem={({ item }: { item: any }) => ( // :any para evitar errores con el componente hijo por ahora !!!CORREGIR imporante!!!!!!!!
          <PlayerListItem 
            player={item} 
            onPress={() => router.push(`/player/${item.idJugador}`)} 
          />
        )}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="users" size={50} color={theme.textSecondary} style={{ opacity: 0.3 }} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No se han encontrado jugadores reales
            </Text>
          </View>
        }
      />
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