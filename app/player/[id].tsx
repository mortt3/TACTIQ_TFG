import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext'; // Importamos el contexto
import db from '../../src/services/database';

type PlayerAPI = {
  id?: string;
  nombre?: string;
  dorsal?: number;
  posicion?: string;
  foto_url?: string;
  stats?: any;
  zonas?: Array<{ zona: string; lanz: number; gol: number; ef: string }>;
}

export default function PlayerDetailScreen() {
  const { theme } = useTheme(); // Extraemos el tema actual
  const { id } = useLocalSearchParams();

  const [player, setPlayer] = useState<PlayerAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (!id) {
          if (mounted) setPlayer(null);
          return;
        }
        const p = await db.getPlayer(id as string);
        if (mounted) {
          setPlayer(p || null);
        }
      } catch (err) {
        console.warn('Failed to load player', err);
        if (mounted) setPlayer(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
      {/* CABECERA */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}> 
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <>
            <Image source={{ uri: player?.foto_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} style={styles.photo} />
            <Text style={[styles.name, { color: theme.text }]}>{player?.nombre || '—'}</Text>
            <View style={styles.badgeRow}>
              <Text style={[styles.badge, { backgroundColor: theme.background, color: theme.textSecondary }]}>
                Dorsal {player?.dorsal ?? '—'}
              </Text>
              <Text style={[styles.badge, { backgroundColor: theme.background, color: theme.textSecondary }]}>
                {player?.posicion || '—'}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* BLOQUE DE 4 ESTADÍSTICAS */}
      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Lanzados</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player?.stats?.lanzados ?? '—'}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Goles</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player?.stats?.goles ?? '—'}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Sanciones</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{player?.stats?.sanciones ?? '—'}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Valoración</Text>
          <Text style={[styles.statValue, { color: '#28a745' }]}>{player?.stats?.valoracion ?? '—'}</Text>
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
          
          {(player?.zonas || []).map((z, index) => (
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