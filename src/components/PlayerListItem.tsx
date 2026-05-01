import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // Importamos el contexto global

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
  const { theme } = useTheme(); // Extraemos el tema actual

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={onPress}
    >
      {/* Usamos theme.border como fondo de la foto temporal (gris claro/oscuro) */}
      <Image source={{ uri: player.foto_url }} style={[styles.photo, { backgroundColor: theme.border }]} />
      
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre</Text>
            <Text style={[styles.value, { color: theme.text }]}>{player.nombre}</Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Edad</Text>
            <Text style={[styles.value, { color: theme.text }]}>{player.edad}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Dorsal</Text>
            <Text style={[styles.value, { color: theme.text }]}>{player.dorsal}</Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Posición</Text>
            <Text style={[styles.value, { color: theme.text }]}>{player.posicion}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ESTILOS: He eliminado los backgroundColor, borderColor y color fijos
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  photo: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginRight: 15, 
  },
  infoContainer: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  column: { 
    flex: 1
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  value: { 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
});