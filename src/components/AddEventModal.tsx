// Archivo: src/components/AddEventModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';

// MOCK DATA: Tus jugadores según la tabla JUGADORES
const mockPlayers = [
  { id: '1', nombre: 'Joel Romero', dorsal: 18 },
  { id: '2', nombre: 'Carlos Pérez', dorsal: 5 },
  { id: '3', nombre: 'Luis Gómez', dorsal: 10 },
  { id: '4', nombre: 'Mario Silva', dorsal: 7 },
];

const actionTypes = [
  { id: 'gol', label: 'Gol', color: '#28a745' },
  { id: 'amarilla', label: 'Amarilla', color: '#ffc107' },
  { id: '2min', label: 'Exclusión', color: '#17a2b8' },
  { id: 'roja', label: 'Roja', color: '#dc3545' },
];

export default function AddEventModal({ visible, onClose, onSave, eventToEdit }) {
  import React, { useState, useEffect } from 'react';
  import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
  import db, { Player } from '../services/database';

  // Fallback local mientras no haya servidor
  const mockPlayers: Player[] = [
    { id: '1', nombre: 'Joel Romero', dorsal: 18 },
    { id: '2', nombre: 'Carlos Pérez', dorsal: 5 },
    { id: '3', nombre: 'Luis Gómez', dorsal: 10 },
    { id: '4', nombre: 'Mario Silva', dorsal: 7 },
  ];

  const actionTypes = [
    { id: 'gol', label: 'Gol', color: '#28a745' },
    { id: 'amarilla', label: 'Amarilla', color: '#ffc107' },
    { id: '2min', label: 'Exclusión', color: '#17a2b8' },
    { id: 'roja', label: 'Roja', color: '#dc3545' },
  ];

  type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: (e: any) => void;
    eventToEdit?: any;
    // Opcional: si se pasa, el modal intentará guardar el evento en el servidor
    matchId?: string;
  };

  export default function AddEventModal({ visible, onClose, onSave, eventToEdit, matchId }: Props) {
    const [minute, setMinute] = useState('');
    const [type, setType] = useState('gol');
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    useEffect(() => {
      if (eventToEdit) {
        setMinute(eventToEdit.minute?.toString() ?? '');
        setType(eventToEdit.type ?? 'gol');
        const p = players.find(p => p.nombre === eventToEdit.playerName) || mockPlayers.find(p => p.nombre === eventToEdit.playerName);
        if (p) setSelectedPlayerId(p.id);
      } else {
        setMinute('');
        setType('gol');
        setSelectedPlayerId('');
      }
    }, [eventToEdit, visible, players]);

    useEffect(() => {
      let mounted = true;
      async function load() {
        setLoadingPlayers(true);
        const remote = await db.getPlayers();
        if (!mounted) return;
        setPlayers(remote.length ? remote : mockPlayers);
        setLoadingPlayers(false);
      }
      load();
      return () => { mounted = false; };
    }, [visible]);

    const handleSave = async () => {
      if (!minute || !selectedPlayerId) {
        alert('Por favor, rellena el minuto y selecciona un jugador.');
        return;
      }
      const player = players.find(p => p.id === selectedPlayerId) || mockPlayers.find(p => p.id === selectedPlayerId);
      const payload = {
        id: eventToEdit ? eventToEdit.id : Math.random().toString(),
        minute: parseInt(minute, 10),
        type,
        playerName: player?.nombre ?? 'Desconocido',
        playerNumber: player?.dorsal,
      };

      // Guardamos localmente en la UI mediante onSave
      onSave(payload);

      // Si nos pasan matchId intentamos mandar al servidor también
      if (matchId) {
        const serverEvent = await db.addEvent(matchId, {
          minute: payload.minute,
          type: payload.type,
          playerName: payload.playerName,
          playerNumber: payload.playerNumber,
        });
        if (!serverEvent) {
          console.warn('No se pudo guardar el evento en el servidor.');
        }
      }

      onClose();
    };

    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{eventToEdit ? 'Editar Evento' : 'Añadir Evento'}</Text>

            <Text style={styles.label}>Minuto del partido:</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Ej: 15"
              value={minute}
              onChangeText={setMinute}
            />

            <Text style={styles.label}>Tipo de Acción:</Text>
            <View style={styles.actionRow}>
              {actionTypes.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionButton,
                    type === action.id && { backgroundColor: action.color, borderColor: action.color }
                  ]}
                  onPress={() => setType(action.id)}
                >
                  <Text style={[styles.actionText, type === action.id && { color: '#FFF' }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Jugador:</Text>
            {loadingPlayers ? (
              <ActivityIndicator />
            ) : (
              <ScrollView style={styles.playerList}>
                {players.map((player) => (
                  <TouchableOpacity
                    key={player.id}
                    style={[
                      styles.playerItem,
                      selectedPlayerId === player.id && styles.playerItemSelected
                    ]}
                    onPress={() => setSelectedPlayerId(player.id)}
                  >
                    <Text style={[styles.playerText, selectedPlayerId === player.id && { color: '#FFF', fontWeight: 'bold' }]}> 
                      {player.dorsal ?? '-'} - {player.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.footerButtons}>
              <TouchableOpacity style={[styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelButton]} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
    modalContent: { margin: 20, backgroundColor: '#fff', borderRadius: 8, padding: 16, maxHeight: '80%' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    label: { marginTop: 8, marginBottom: 4 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 },
    actionRow: { flexDirection: 'row', marginVertical: 8, flexWrap: 'wrap' },
    actionButton: { padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginRight: 8, marginBottom: 8 },
    actionText: { color: '#333' },
    playerList: { maxHeight: 150, marginTop: 8 },
    playerItem: { padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#eee', marginBottom: 6 },
    playerItemSelected: { backgroundColor: '#333' },
    playerText: { color: '#333' },
    footerButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    saveButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 6, flex: 1, marginRight: 8, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#ddd', padding: 10, borderRadius: 6, flex: 1, marginLeft: 8, alignItems: 'center' },
    cancelText: { color: '#333' },
  });