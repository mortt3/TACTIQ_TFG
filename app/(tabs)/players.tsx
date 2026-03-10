import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import PlayerListItem from '../../src/components/PlayerListItem';

const mockPlayers = [
  { id_jugador: '1', nombre: 'Joel Romero', edad: 22, dorsal: 18, posicion: 'Lateral Izquierdo', foto_url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
  { id_jugador: '2', nombre: 'Carlos Pérez', edad: 25, dorsal: 5, posicion: 'Pivote', foto_url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
];

export default function PlayersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="🔍 Buscar jugador..." value={search} onChangeText={setSearch} />
      </View>
      <FlatList
        data={mockPlayers}
        keyExtractor={(item) => item.id_jugador}
        renderItem={({ item }) => (
          <PlayerListItem player={item} onPress={() => router.push(`/player/${item.id_jugador}`)} />
        )}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  searchContainer: { padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  searchInput: { backgroundColor: '#F0F2F5', padding: 10, borderRadius: 8 },
});