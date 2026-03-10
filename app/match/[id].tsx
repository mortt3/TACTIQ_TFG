// Archivo: app/match/[id].tsx
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TimelineItem from '../../src/components/TimelineItem';

// MOCK DATA: Eventos simulados de la base de datos
const initialEvents = [
  { id: '1', minute: 12, type: 'gol', playerName: 'Joel Romero', playerNumber: 18 },
  { id: '2', minute: 24, type: 'amarilla', playerName: 'Carlos Pérez', playerNumber: 5 },
  { id: '3', minute: 35, type: '2min', playerName: 'Luis Gómez', playerNumber: 10 },
  { id: '4', minute: 48, type: 'gol', playerName: 'Joel Romero', playerNumber: 18 },
];

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams(); // Recibimos el ID del partido pulsado
  const [events, setEvents] = useState(initialEvents);

  // Simulación del botón de la IA
  const handleUploadVideo = () => {
    Alert.alert(
      "Procesando con IA", 
      "Aquí se subirá el vídeo a tu backend. La IA de Google (Gemini) podría analizar los frames y devolver un JSON con los minutos de los goles y sanciones."
    );
  };

  // Simulación de añadir evento manual (lápiz superior)
  const handleAddEvent = () => {
    Alert.alert("Añadir", "Aquí abriremos el modal para añadir Gol, Amarilla o Roja y asociarlo a un jugador.");
  };

  const handleEditEvent = (event) => {
    Alert.alert("Editar Evento", `Editando el ${event.type} de ${event.playerName} en el min ${event.minute}`);
  };

  return (
    <View style={styles.container}>
      {/* HEADER DEL PARTIDO */}
      <View style={styles.headerCard}>
        <Text style={styles.vsText}>Balonmano Zaragoza VS Rival</Text>
        <Text style={styles.scoreText}>34 - 23</Text>
        <Text style={styles.statusText}>Partido Finalizado</Text>
      </View>

      {/* BOTONERA DE ACCIONES */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.aiButton} onPress={handleUploadVideo}>
          <FontAwesome name="video-camera" size={20} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.aiButtonText}>Cargar vídeo (IA)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
          <FontAwesome name="pencil" size={20} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.addButtonText}>Añadir manual</Text>
        </TouchableOpacity>
      </View>

      {/* LÍNEA DE TIEMPO */}
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Línea de Tiempo</Text>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TimelineItem event={item} onEdit={handleEditEvent} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerCard: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  vsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#28a745',
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
    backgroundColor: '#6f42c1', // Morado para cosas de IA
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
    backgroundColor: '#007BFF', // Azul estándar
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
    color: '#333',
  }
});