// Archivo: app/match/[id].tsx
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddEventModal, { TimelineEvent } from '../../src/components/AddEventModal';
import TimelineItem from '../../src/components/TimelineItem';
import { useTheme } from '../../src/context/ThemeContext'; // Importamos el contexto
import initialEvents from '../consts/events';
import mockMatches from '../consts/matches';
import db from '../../src/services/database';

export default function MatchDetailScreen() {
  const { theme } = useTheme(); // Extraemos el tema actual

  const { id } = useLocalSearchParams();
  const [events, setEvents] = useState(initialEvents);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<TimelineEvent | null>(null);
  const [match, setMatch] = useState<any | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(true);
  const fallbackMatch = mockMatches.find(m => m.id_partido === Number(id));
  const router = useRouter(); 

  // Generate timeline events from player statistics (injuries, cards, etc.)
  const generateEventsFromStats = (stats: any[]) => {
    const generatedEvents: TimelineEvent[] = [];
    
    stats.forEach((stat: any, idx: number) => {
      if (stat.sanciones) {
        if (stat.sanciones.amarillas && stat.sanciones.amarillas > 0) {
          generatedEvents.push({
            id: `${idx}-amarilla`,
            minute: 0, // We don't have exact minute from stats
            type: 'amarilla',
            playerName: stat.nombreJugador,
            playerNumber: stat.dorsal,
          });
        }
        if (stat.sanciones.roja) {
          generatedEvents.push({
            id: `${idx}-roja`,
            minute: 0,
            type: 'roja',
            playerName: stat.nombreJugador,
            playerNumber: stat.dorsal,
          });
        }
        if ((stat.sanciones.dos_minutos_1 || stat.sanciones.dos_minutos_2) && stat.sanciones.dos_minutos_1) {
          generatedEvents.push({
            id: `${idx}-2min`,
            minute: 0,
            type: '2min',
            playerName: stat.nombreJugador,
            playerNumber: stat.dorsal,
          });
        }
      }
    });
    
    return generatedEvents.length > 0 ? generatedEvents : initialEvents;
  };
  
  const handleUploadVideo = () => {
    router.push(`/upload-video/${id}`);
  };

  const handleAddEvent = () => {
    setEventToEdit(null);
    setIsAddModalVisible(true);
  };

  const handleSaveNewEvent = async (newEvent: TimelineEvent) => {
    try {
      if (!id) {
        Alert.alert('Error', 'No se encontró el partido para guardar el evento.');
        return;
      }

      const saved = await db.addEvent(id as string, {
        minute: newEvent.minute,
        type: newEvent.type,
        playerId: newEvent.playerId,
        playerName: newEvent.playerName,
        playerNumber: newEvent.playerNumber,
      });

      if (!saved) {
        Alert.alert('Error', 'No se pudo guardar el evento en la API.');
        return;
      }

      const eventFromApi: TimelineEvent = {
        id: saved.id?.toString() || newEvent.id,
        minute: saved.minute ?? newEvent.minute,
        type: (saved.type ?? newEvent.type) as TimelineEvent['type'],
        playerId: saved.playerId ?? newEvent.playerId,
        playerName: saved.playerName ?? newEvent.playerName,
        playerNumber: saved.playerNumber ?? newEvent.playerNumber ?? 0,
      };

      setEvents((prevEvents) => [eventFromApi, ...prevEvents]);
      setEventToEdit(null);
      setIsAddModalVisible(false);
    } catch (error) {
      console.warn('Error saving event', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el evento.');
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEventToEdit(event);
    setIsAddModalVisible(true);
  };

  useEffect(() => {
    let mounted = true;
    async function loadMatch() {
      setLoadingMatch(true);
      try {
        if (!id) return;
        const m = await db.getMatch(id as string);
        if (mounted) {
          setMatch(m || fallbackMatch || null);
          // Generate events from player statistics
          if (m?.estadisticasJugadores) {
            const generatedEvents = generateEventsFromStats(m.estadisticasJugadores);
            setEvents(generatedEvents);
          }
        }
      } catch (err) {
        console.warn('Failed to load match', err);
        if (mounted) setMatch(fallbackMatch || null);
      } finally {
        if (mounted) setLoadingMatch(false);
      }
    }
    loadMatch();
    return () => { mounted = false; };
  }, [id]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER DEL PARTIDO */}
      <View style={[styles.headerCard, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        {loadingMatch ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <>
            {/* Teams with logos */}
            <View style={styles.teamsContainer}>
              <View style={styles.teamColumn}>
                {match?.equipoLocal?.imagenLogo && (
                  <Image 
                    source={{ uri: match.equipoLocal.imagenLogo }} 
                    style={styles.teamLogo}
                  />
                )}
                <Text style={[styles.teamName, { color: theme.text }]}>{match?.equipoLocal?.nombre || 'Local'}</Text>
              </View>
              
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: theme.text }]}>{match?.equipoLocal?.goles ?? match?.score_local ?? '-'}</Text>
                <Text style={[styles.separator, { color: theme.textSecondary }]}>-</Text>
                <Text style={[styles.scoreText, { color: theme.text }]}>{match?.equipoVisitante?.goles ?? match?.score_rival ?? '-'}</Text>
              </View>
              
              <View style={styles.teamColumn}>
                {match?.equipoVisitante?.imagenLogo && (
                  <Image 
                    source={{ uri: match.equipoVisitante.imagenLogo }} 
                    style={styles.teamLogo}
                  />
                )}
                <Text style={[styles.teamName, { color: theme.text }]}>{match?.equipoVisitante?.nombre || 'Rival'}</Text>
              </View>
            </View>
            
            <Text style={styles.statusText}>{match?.condicion || match?.status || ''}</Text>
          </>
        )}
      </View>

      {/* BOTONERA DE ACCIONES */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.aiButton} onPress={handleUploadVideo}>
          <FontAwesome name="video-camera" size={20} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.aiButtonText}>Cargar vídeo (IA)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={handleAddEvent}>
          <FontAwesome name="pencil" size={20} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.addButtonText}>Añadir manual</Text>
        </TouchableOpacity>
      </View>

      {/* LÍNEA DE TIEMPO */}
      <View style={styles.timelineContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Línea de Tiempo</Text>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TimelineItem event={item} onEdit={handleEditEvent} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <AddEventModal
        visible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          setEventToEdit(null);
        }}
        onSave={handleSaveNewEvent}
        eventToEdit={eventToEdit}
      />
    </View>
  );
}

// ESTILOS: Se han limpiado los colores estáticos de fondos y textos adaptables
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  teamColumn: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 28,
    marginHorizontal: 10,
    fontWeight: '300',
  },
  statusText: {
    fontSize: 14,
    color: '#28a745', // Verde semántico mantenido
    fontWeight: '600',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  aiButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6f42c1', // Morado semántico de IA mantenido
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  aiButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timelineContainer: {
    flex: 1,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
  }
});