import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // Importamos el contexto global
import db from '../services/database'; // Importar el servicio de base de datos

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

type Player = {
  id: string;
  nombre: string;
  dorsal?: number;
};

const mockPlayers: Player[] = [
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
  const { theme } = useTheme(); // Extraemos el tema actual
  
  const [minute, setMinute] = useState('');
  const [type, setType] = useState<EventType>('gol');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    // Cargar jugadores cuando el modal se abre
    let mounted = true;
    async function loadPlayers() {
      setLoadingPlayers(true);
      try {
        const remote = await db.getPlayers();
        if (mounted) {
          setPlayers(remote.length > 0 ? remote : mockPlayers);
        }
      } catch (error) {
        console.warn('Error loading players, using mock data:', error);
        if (mounted) setPlayers(mockPlayers);
      } finally {
        if (mounted) setLoadingPlayers(false);
      }
    }

    loadPlayers();

    if (eventToEdit) {
      setMinute(eventToEdit.minute.toString());
      setType(eventToEdit.type);
      const player = players.find((item) => item.nombre === eventToEdit.playerName);
      setSelectedPlayerId(player?.id ?? '');
      return;
    }

    setMinute('');
    setType('gol');
    setSelectedPlayerId('');

    return () => { mounted = false; };
  }, [visible, eventToEdit]);

  const handleSave = () => {
    if (!minute || !selectedPlayerId) {
      return;
    }

    const player = players.find((item) => item.id === selectedPlayerId);
    if (!player) {
      return;
    }

    onSave({
      id: eventToEdit?.id ?? Date.now().toString(),
      minute: Number(minute),
      type,
      playerName: player.nombre,
      playerNumber: player.dorsal ?? 0,
    });

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {eventToEdit ? 'Editar evento' : 'Añadir evento'}
          </Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Minuto del partido</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
            keyboardType="number-pad"
            placeholder="Ej: 12"
            placeholderTextColor={theme.textSecondary}
            value={minute}
            onChangeText={setMinute}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Tipo de acción</Text>
          <View style={styles.actionRow}>
            {actionTypes.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.actionButton,
                  { borderColor: theme.border }, // Borde dinámico
                  type === action.id && { backgroundColor: action.color, borderColor: action.color },
                ]}
                onPress={() => setType(action.id)}
              >
                <Text style={[
                  styles.actionText, 
                  { color: theme.text }, // Texto dinámico
                  type === action.id && styles.actionTextSelected
                ]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Jugador</Text>
          {loadingPlayers ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Cargando jugadores...</Text>
            </View>
          ) : (
            <ScrollView style={styles.playerList}>
              {players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={[
                    styles.playerItem,
                    { borderColor: theme.border }, // Borde dinámico
                    selectedPlayerId === player.id && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setSelectedPlayerId(player.id)}
                >
                  <Text style={[
                    styles.playerText, 
                    { color: theme.text }, // Texto dinámico
                    selectedPlayerId === player.id && styles.playerTextSelected
                  ]}>
                    {player.dorsal} - {player.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.background }]} onPress={onClose}>
              <Text style={[styles.cancelText, { color: theme.text }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ESTILOS: Se han limpiado los colores estáticos vinculados a fondos, bordes y textos (excepto el verde de guardar y los seleccionados)
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Un poco más oscuro para que contraste mejor
    justifyContent: 'center',
  },
  modalContent: {
    margin: 20,
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
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
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
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  actionText: {
    fontWeight: '500',
  },
  actionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  playerList: {
    maxHeight: 150,
    marginTop: 8,
  },
  playerItem: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 6,
  },
  playerText: {
    fontSize: 15,
  },
  playerTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});