// Archivo: src/components/TimelineItem.tsx
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TimelineEvent } from './AddEventModal';

type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>['name'];

interface TimeLineData {
  event: TimelineEvent,
  onEdit: (event: TimelineEvent) => void
}
  

export default function TimelineItem({ event, onEdit }: TimeLineData) {
  // Función para devolver el icono y color según el tipo de evento
  const getEventStyle = (): { icon: FontAwesomeIconName; color: string; label: string } => {
    switch (event.type) {
      case 'gol':
        return { icon: "soccer-ball-o", color: '#28a745', label: 'Gol' };
      case 'amarilla':
        return { icon: "square", color: '#ffc107', label: 'T. Amarilla' };
      case 'roja':
        return { icon: "square", color: '#dc3545', label: 'T. Roja' };
      case '2min':
        return { icon: "clock-o", color: '#17a2b8', label: 'Exclusión 2m' };
      default:
        return { icon: "circle", color: '#6c757d', label: 'Evento' };
    }
  };

  const styleDef = getEventStyle();

  return (
    <View style={styles.container}>
      {/* Minuto */}
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{event.minute}'</Text>
      </View>

      {/* Línea conectora */}
      <View style={styles.line} />

      {/* Contenido del evento */}
      <View style={styles.contentBox}>
        <View style={styles.eventHeader}>
          <FontAwesome name={styleDef.icon} size={16} color={styleDef.color} style={{ marginRight: 8 }} />
          <Text style={[styles.eventLabel, { color: styleDef.color }]}>{styleDef.label}</Text>
        </View>
        <Text style={styles.playerName}>{event.playerName} (Dorsal {event.playerNumber})</Text>
      </View>

      {/* Botón de editar (el lápiz) */}
      <TouchableOpacity onPress={() => onEdit(event)} style={styles.editButton}>
        <FontAwesome name="pencil" size={20} color="#007BFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  timeBox: {
    width: 45,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  line: {
    width: 2,
    height: '150%',
    backgroundColor: '#dee2e6',
    marginHorizontal: 10,
  },
  contentBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerName: {
    fontSize: 16,
    color: '#495057',
  },
  editButton: {
    padding: 10,
    marginLeft: 5,
  }
});