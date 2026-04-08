import { FontAwesome } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { mockTeams } from '../consts/teams';

export default function AddMatchScreen() {
  const { theme } = useTheme();
  
  // Estados del partido
  const [localTeam, setLocalTeam] = useState(mockTeams[0]); // Por defecto nosotros
  const [rivalTeam, setRivalTeam] = useState({ id: '0', nombre: 'Seleccionar Rival', logo: '' });
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'local' | 'rival'>('rival');
  const [searchQuery, setSearchQuery] = useState('');

  // Lógica de intercambio
  const swapTeams = () => {
    const temp = localTeam;
    setLocalTeam(rivalTeam);
    setRivalTeam(temp);
  };

  const openSelector = (side: 'local' | 'rival') => {
    setSelectingFor(side);
    setSearchQuery('');
    setModalVisible(true);
  };

  const selectTeam = (team: any) => {
    if (selectingFor === 'local') setLocalTeam(team);
    else setRivalTeam(team);
    setModalVisible(false);
  };

  // Filtrado de equipos para el modal
  const filteredTeams = useMemo(() => {
    return mockTeams.filter(t => t.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* SECTOR DE EQUIPOS */}
      <View style={[styles.matchHeader, { backgroundColor: theme.card }]}>
        <TouchableOpacity style={styles.teamBox} onPress={() => openSelector('local')}>
          <Text style={[styles.teamTitle, { color: theme.textSecondary }]}>Local</Text>
          <View style={[styles.logoCircle, { borderColor: theme.border }]}>
            {localTeam.logo ? <Image source={{ uri: localTeam.logo }} style={styles.logoImg} /> : <Text style={{color: theme.text}}>?</Text>}
          </View>
          <Text style={[styles.teamLabel, { color: theme.text }]} numberOfLines={1}>{localTeam.nombre}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={swapTeams} style={[styles.swapBtn, { backgroundColor: theme.background }]}>
          <FontAwesome name="exchange" size={20} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.teamBox} onPress={() => openSelector('rival')}>
          <Text style={[styles.teamTitle, { color: theme.textSecondary }]}>Visitante</Text>
          <View style={[styles.logoCircle, { borderColor: theme.border }]}>
            {rivalTeam.logo ? <Image source={{ uri: rivalTeam.logo }} style={styles.logoImg} /> : <Text style={{color: theme.text}}>?</Text>}
          </View>
          <Text style={[styles.teamLabel, { color: theme.text }]} numberOfLines={1}>{rivalTeam.nombre}</Text>
        </TouchableOpacity>
      </View>

      {/* FORMULARIO */}
      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Fecha:</Text>
        <TextInput 
          style={[styles.input, { borderColor: theme.border, color: theme.text }]} 
          placeholder="Ej: 25 / 02 / 2026" 
          placeholderTextColor={theme.textSecondary}
          value={fecha} 
          onChangeText={setFecha} 
        />
        <Text style={[styles.label, { color: theme.text }]}>Hora:</Text>
        <TextInput 
          style={[styles.input, { borderColor: theme.border, color: theme.text }]} 
          placeholder="Ej: 18:00" 
          placeholderTextColor={theme.textSecondary}
          value={hora} 
          onChangeText={setHora} 
        />
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={() => Alert.alert("Éxito", "Partido guardado")}>
          <Text style={styles.saveBtnText}>Guardar partido</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL SELECTOR DE EQUIPO */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar Equipo</Text>
            
            <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
              <FontAwesome name="search" size={16} color={theme.textSecondary} />
              <TextInput 
                placeholder="Buscar equipo..." 
                placeholderTextColor={theme.textSecondary}
                style={[styles.searchInput, { color: theme.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredTeams}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.gridItem} onPress={() => selectTeam(item)}>
                  <Image source={{ uri: item.logo }} style={styles.gridLogo} />
                  <Text style={[styles.gridText, { color: theme.text }]} numberOfLines={2}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 20, borderRadius: 15, marginBottom: 20 },
  teamBox: { alignItems: 'center', width: '40%' },
  teamTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  logoCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: '#f0f0f0' },
  logoImg: { width: '100%', height: '100%', resizeMode: 'contain' },
  teamLabel: { marginTop: 8, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  swapBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  formContainer: { padding: 20, borderRadius: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15 },
  saveBtn: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '70%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 10, marginBottom: 20 },
  searchInput: { flex: 1, padding: 10, marginLeft: 10 },
  gridItem: { flex: 1/3, alignItems: 'center', marginBottom: 20, padding: 5 },
  gridLogo: { width: 50, height: 50, resizeMode: 'contain', marginBottom: 5 },
  gridText: { fontSize: 11, textAlign: 'center' },
  closeBtn: { alignItems: 'center', padding: 15, marginTop: 10 }
});