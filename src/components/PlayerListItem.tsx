import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface PlayerData {
  player: {
    id_jugador: string,
    nombre: string,
    edad: number,
    dorsal: number,
    posicion: string,
    foto_url: string
  },
  onPress: () => void
}

export default function PlayerListItem({ player, onPress }: PlayerData) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: player.foto_url }} style={styles.photo} />
      
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{player.nombre}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Edad</Text>
            <Text style={styles.value}>{player.edad}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Dorsal</Text>
            <Text style={styles.value}>{player.dorsal}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Posición</Text>
            <Text style={styles.value}>{player.posicion}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: 
  {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  photo: 
  { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginRight: 15, 
    backgroundColor: '#EEE' 
  },
  infoContainer: 
  { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  row: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  column: 
  { 
    flex: 1
  },
  label: 
  { 
    fontSize: 12, 
    color: '#888', 
    fontWeight: '600' 
  },
  value: 
  { 
    fontSize: 15, 
    color: '#333', 
    fontWeight: 'bold' 
  },
});