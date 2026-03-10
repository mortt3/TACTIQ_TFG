import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import GoalZoneMap from '../../src/components/GoalZoneMap';

export default function PlayerDetailScreen() {
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
    <ScrollView style={styles.container}>
      {/* CABECERA */}
      <View style={styles.header}>
        <Image source={{ uri: player.foto_url }} style={styles.photo} />
        <Text style={styles.name}>{player.nombre}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>Dorsal {player.dorsal}</Text>
          <Text style={styles.badge}>{player.posicion}</Text>
        </View>
      </View>

      {/* BLOQUE DE 4 ESTADÍSTICAS */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Lanzados</Text>
          <Text style={styles.statValue}>{player.stats.lanzados}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Goles</Text>
          <Text style={styles.statValue}>{player.stats.goles}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Sanciones</Text>
          <Text style={styles.statValue}>{player.stats.sanciones}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Valoración</Text>
          <Text style={[styles.statValue, { color: '#28a745' }]}>{player.stats.valoracion}</Text>
        </View>
      </View>

      {/* DESGLOSE POR ZONA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Desglose por zona</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerText]}>Zona</Text>
            <Text style={[styles.cell, styles.headerText]}>Lanz</Text>
            <Text style={[styles.cell, styles.headerText]}>Gol</Text>
            <Text style={[styles.cell, styles.headerText]}>Eficacia</Text>
          </View>
          {player.zonas.map((z, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{z.zona}</Text>
              <Text style={styles.cell}>{z.lanz}</Text>
              <Text style={styles.cell}>{z.gol}</Text>
              <Text style={[styles.cell, { fontWeight: 'bold' }]}>{z.ef}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* MAPA DE PORTERÍA */}
      <GoalZoneMap />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderBottomWidth: 1, borderColor: '#E0E0E0' },
  photo: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  badgeRow: { flexDirection: 'row', marginTop: 10 },
  badge: { backgroundColor: '#E9ECEF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, marginHorizontal: 5, fontSize: 14, color: '#555' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  statBox: { width: '48%', backgroundColor: '#FFF', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  statLabel: { fontSize: 14, color: '#888', marginBottom: 5 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  section: { backgroundColor: '#FFF', padding: 20, marginTop: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E0E0E0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  table: { borderWidth: 1, borderColor: '#EEE', borderRadius: 8, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8F9FA', padding: 10, borderBottomWidth: 1, borderColor: '#EEE' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#EEE' },
  cell: { flex: 1, textAlign: 'center', color: '#333' },
  headerText: { fontWeight: 'bold', color: '#666' }
});