import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type EventType = 'gol' | 'amarilla' | '2min' | 'roja';

export type TimelineEvent = {
  id: string;
  minute: number;
  type: EventType;
  playerName: string;
  playerNumber: number;
};

type AddEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (event: TimelineEvent) => void;
  eventToEdit?: TimelineEvent | null;
};

const mockPlayers = [
  { id: '1', nombre: 'Joel Romero', dorsal: 18 },
  { id: '2', nombre: 'Carlos Pérez', dorsal: 5 },
  { id: '3', nombre: 'Luis Gómez', dorsal: 10 },
  { id: '4', nombre: 'Mario Silva', dorsal: 7 },
];

const actionTypes: { id: EventType; label: string; color: string }[] = [
  { id: 'gol', label: 'Gol', color: '#28a745' },
  { id: 'amarilla', label: 'Amarilla', color: '#ffc107' },
  { id: '2min', label: 'Exclusión', color: '#17a2b8' },
  { id: 'roja', label: 'Roja', color: '#dc3545' },
];

export default function AddEventModal({ visible, onClose, onSave, eventToEdit = null }: AddEventModalProps) {
  const [minute, setMinute] = useState('');
  const [type, setType] = useState<EventType>('gol');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (eventToEdit) {
      setMinute(eventToEdit.minute.toString());
      setType(eventToEdit.type);
      const player = mockPlayers.find((item) => item.nombre === eventToEdit.playerName);
      setSelectedPlayerId(player?.id ?? '');
      return;
    }

    setMinute('');
    setType('gol');
    setSelectedPlayerId('');
  }, [visible, eventToEdit]);

  const handleSave = () => {
    if (!minute || !selectedPlayerId) {
      return;
    }

    const player = mockPlayers.find((item) => item.id === selectedPlayerId);
    if (!player) {
      return;
    }

    onSave({
      id: eventToEdit?.id ?? Date.now().toString(),
      minute: Number(minute),
      type,
      playerName: player.nombre,
      playerNumber: player.dorsal,
    });

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{eventToEdit ? 'Editar evento' : 'Añadir evento'}</Text>

          <Text style={styles.label}>Minuto del partido</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Ej: 12"
            value={minute}
            onChangeText={setMinute}
          />

          <Text style={styles.label}>Tipo de acción</Text>
          <View style={styles.actionRow}>
            {actionTypes.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionButton,
                  type === action.id && { backgroundColor: action.color, borderColor: action.color },
                ]}
                onPress={() => setType(action.id)}
              >
                <Text style={[styles.actionText, type === action.id && styles.actionTextSelected]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Jugador</Text>
          <ScrollView style={styles.playerList}>
            {mockPlayers.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerItem,
                  selectedPlayerId === player.id && styles.playerItemSelected,
                ]}
                onPress={() => setSelectedPlayerId(player.id)}
              >
                <Text style={[styles.playerText, selectedPlayerId === player.id && styles.playerTextSelected]}>
                  {player.dorsal} - {player.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
  },
  actionRow: {
    flexDirection: 'row',
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  actionText: {
    color: '#333',
  },
  actionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  playerList: {
    maxHeight: 150,
    marginTop: 8,
  },
  playerItem: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 6,
  },
  playerItemSelected: {
    backgroundColor: '#333',
  },
  playerText: {
    color: '#333',
  },
  playerTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
  },
});
