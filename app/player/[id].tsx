import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

// Interface 
interface PlayerDetail {
  id_jugador: number;
  nombre_jugador: string;
  dorsal: number;
  posicion: string;
  imagen_jugador?: string;

  total_lanzamientos?: number;
  total_goles?: number;
  exclusiones_2min?: number;
  valoracion_total?: number;

  zonas?: Array<{ zona: string, lanz: number, gol: number, ef: string }>;

}

export default function PlayerDetailScreen() {
  const { theme } = useTheme(); 
  const { id } = useLocalSearchParams();

  const [player, setPlayer] = useState<PlayerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axios.get(`http://192.168.1.137:5268/api/jugadores/${id}`);
        setPlayer(response.data);
      } catch (error) {
        console.error("Error al cargar el detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>Jugador no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>

      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Image source={{ uri: player.imagen_jugador || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} style={styles.photo} />
        <Text style={[styles.name, { color: theme.text }]}>{player.nombre_jugador}</Text>
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, { backgroundColor: theme.background, color: theme.textSecondary }]}>
            Dorsal {player.dorsal}
          </Text>
          <Text style={[styles.badge, { backgroundColor: theme.background, color: theme.textSecondary }]}>
            {player.posicion}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Lanzados</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player.total_lanzamientos ?? 0}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Goles</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player.total_goles ?? 0}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sanciones</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player.exclusiones_2min ?? 0}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Valoración</Text>
          <Text style={[styles.statValue, { color: '#28a745' }]}>{player.valoracion_total || 'N/A'}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderTopColor: theme.border, borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Desglose por zona</Text>
        
        <View style={[styles.table, { borderColor: theme.border }]}>
          <View style={[styles.tableHeader, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Zona</Text>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Lanz</Text>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Gol</Text>
            <Text style={[styles.cell, styles.headerText, { color: theme.textSecondary }]}>Eficacia</Text>
          </View>
          
          {(player.zonas || []).map((z, index) => (
            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.cell, { color: theme.text }]}>{z.zona}</Text>
              <Text style={[styles.cell, { color: theme.text }]}>{z.lanz}</Text>
              <Text style={[styles.cell, { color: theme.text }]}>{z.gol}</Text>
              <Text style={[styles.cell, { color: theme.text, fontWeight: 'bold' }]}>{z.ef}</Text>
            </View>
          ))}
          {(!player.zonas || player.zonas.length === 0) && (
            <Text style={{ textAlign: 'center', padding: 10, color: theme.textSecondary }}>Sin datos de zonas</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos

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