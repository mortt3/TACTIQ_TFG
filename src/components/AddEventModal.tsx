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
  const [minute, setMinute] = useState('');
  const [type, setType] = useState('gol');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  // Si abrimos el modal para EDITAR, cargamos los datos previos
  useEffect(() => {
    if (eventToEdit) {
      setMinute(eventToEdit.minute.toString());
      setType(eventToEdit.type);
      // Buscamos el ID del jugador por su nombre o dorsal (simulado)
      const p = mockPlayers.find(p => p.nombre === eventToEdit.playerName);
      if (p) setSelectedPlayerId(p.id);
    } else {
      // Limpiar formulario si es NUEVO
      setMinute('');
      setType('gol');
      setSelectedPlayerId('');
    }
  }, [eventToEdit, visible]);

  const handleSave = () => {
    if (!minute || !selectedPlayerId) {
      alert("Por favor, rellena el minuto y selecciona un jugador.");
      return;
    }

    const player = mockPlayers.find(p => p.id === selectedPlayerId);
    
    // Devolvemos el objeto a la pantalla principal
    onSave({
      id: eventToEdit ? eventToEdit.id : Math.random().toString(), // Generar ID aleatorio si es nuevo
      minute: parseInt(minute),
      type: type,
      playerName: player.nombre,
      playerNumber: player.dorsal,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{eventToEdit ? 'Editar Evento' : 'Añadir Evento'}</Text>

          {/* CAMPO MINUTO */}
          <Text style={styles.label}>Minuto del partido:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Ej: 15"
            value={minute}
            onChangeText={setMinute}
          />

          {/* TIPO DE ACCIÓN */}
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

          {/* SELECCIÓN DE JUGADOR */}
          <Text style={styles.label}>Jugador (Desplegable simulado):</Text>
          <ScrollView style={styles.playerList}>
            {mockPlayers.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerItem,
                  selectedPlayerId === player.id && styles.playerItemSelected
                ]}
                onPress={() => setSelectedPlayerId(player.id)}
              >
                <Text style={[styles.playerText, selectedPlayerId === player.id && { color: '#FFF', fontWeight: 'bold' }]}>
                  {player.dorsal} - {player.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* BOTONES GUARDAR/CANCELAR */}
          <View style={styles.footerButtons}>
            <TouchableOpacity