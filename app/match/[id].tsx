// Archivo: app/match/[id].tsx
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddEventModal, { TimelineEvent } from '../../src/components/AddEventModal';
import TimelineItem from '../../src/components/TimelineItem';
import { useTheme } from '../../src/context/ThemeContext'; // Importamos el contexto
import initialEvents from '../consts/events';
import mockMatches from '../consts/matches';

export default function MatchDetailScreen() {
  const { theme } = useTheme(); // Extraemos el tema actual

  const { id } = useLocalSearchParams();
  const [events, setEvents] = useState(initialEvents);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<TimelineEvent | null>(null);
  const match = mockMatches.find(m => m.id_partido === Number(id));
  const router = useRouter(); 
  
  const handleUploadVideo = () => {
    router.push(`/upload-video/${id}`);
  };

  const handleAddEvent = () => {
    setEventToEdit(null);
    setIsAddModalVisible(true);
  };

  const handleSaveNewEvent = (newEvent: TimelineEvent) => {
    setEvents((prevEvents) => {
      const eventExists = prevEvents.some((event) => event.id === newEvent.id);
      if (eventExists) {
        return prevEvents.map((event) => (event.id === newEvent.id ? newEvent : event));
      }
      return [newEvent, ...prevEvents];
    });
    setEventToEdit(null);
    setIsAddModalVisible(false);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEventToEdit(event);
    setIsAddModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER DEL PARTIDO */}
      <View style={[styles.headerCard, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Text style={[styles.vsText, { color: theme.textSecondary }]}>Balonmano Zaragoza VS Rival</Text>
        <Text style={[styles.scoreText, { color: theme.text }]}>{match?.score_local} - {match?.score_rival}</Text>
        <Text style={styles.statusText}>{match?.status}</Text>
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
  vsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
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