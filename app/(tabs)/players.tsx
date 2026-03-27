import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import PlayerListItem from '../../src/components/PlayerListItem';
import mockPlayers from '../consts/players';


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
  container: 
  { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  searchContainer: 
  { 
    padding: 15, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderColor: '#E0E0E0' 
  },
  searchInput: 
  { 
    backgroundColor: '#F0F2F5', 
    padding: 10, 
    borderRadius: 8 
  },
});