import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext'; // Importamos el contexto

export default function PlayerDetailScreen() {
  const { theme } = useTheme(); // Extraemos el tema actual
  const { id } = useLocalSearchParams();

  // MOCK DATA DEL JUGADOR
  const player = {
    nombre: 'Joel Romero', edad: 22, dorsal: 18, posicion: 'Lateral Izquierdo', foto_url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    stats: { lanzados: 53, goles: 31, sanciones: 4, valoracion: '+6' },
    zonas: [
      { zona: '6m', lanz: 30, gol: 7, ef: '23%' },
      { zona: '9m', lanz: 15, gol: 12, ef: '80%' },
      { zona: '7m', lanz: 8, gol: 7, ef: '87%' },
    ]
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* CABECERA */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Image source={{ uri: player.foto_url }} style={styles.photo} />
        <Text style={[styles.name, { color: theme.text }]}>{player.nombre}</Text>
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, { backgroundColor: theme.background, color: theme.textSecondary }]}>
            Dorsal {player.dorsal}
          </Text>
          <Text style={[styles.badge, { backgroundColor: theme.background, color: theme.textSecondary }]}>
            {player.posicion}
          </Text>
        </View>
      </View>

      {/* BLOQUE DE 4 ESTADÍSTICAS */}
      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Lanzados</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player.stats.lanzados}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Goles</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player.stats.goles}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sanciones</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player.stats.sanciones}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Valoración</Text>
          <Text style={[styles.statValue, { color: '#28a745' }]}>{player.stats.valoracion}</Text>
        </View>
      </View>

      {/* DESGLOSE POR ZONA */}
      <View style={[styles.section, { backgroundColor: theme.card, borderTopColor: theme.border, borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Desglose por zona</Text>
        
        <View style={[styles.table, { borderColor: theme.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Zona</Text>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Lanz</Text>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Gol</Text>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Eficacia</Text>
          </View>
          
          {player.zonas.map((z, index) => (
            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.cell, { color: theme.text }]}>{z.zona}</Text>
              <Text style={[styles.cell, { color: theme.text }]}>{z.lanz}</Text>
              <Text style={[styles.cell, { color: theme.text }]}>{z.gol}</Text>
              <Text style={[styles.cell, { color: theme.text, fontWeight: 'bold' }]}>{z.ef}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

// ESTILOS: Limpios de colores estáticos (hemos dejado solo el layout y el verde de la valoración)
const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1 
  },
  photo: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 10,
    backgroundColor: '#CCC' // Color de fondo temporal para la imagen si tarda en cargar
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  badgeRow: { 
    flexDirection: 'row', 
    marginTop: 10 
  },
  badge: { 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 15, 
    marginHorizontal: 5, 
    fontSize: 14 
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    padding: 10, 
    justifyContent: 'space-between' 
  },
  statBox: { 
    width: '48%', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10, 
    borderWidth: 1 
  },
  statLabel: { 
    fontSize: 14, 
    marginBottom: 5 
  },
  statValue: { 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  section: { 
    padding: 20, 
    marginTop: 10, 
    borderTopWidth: 1, 
    borderBottomWidth: 1 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  table: { 
    borderWidth: 1, 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  tableHeader: { 
    flexDirection: 'row', 
    padding: 10, 
    borderBottomWidth: 1 
  },
  tableRow: { 
    flexDirection: 'row', 
    padding: 10, 
    borderBottomWidth: 1 
  },
  cell: { 
    flex: 1, 
    textAlign: 'center' 
  },
  headerText: { 
    fontWeight: 'bold' 
  }
});