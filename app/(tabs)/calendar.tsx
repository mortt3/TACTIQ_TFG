import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import db from '../../src/services/database';

type Team = {
  id: string;
  nombre: string;
  logo?: string;
};

export default function AddMatchScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Estados del partido
  const [teams, setTeams] = useState<Team[]>([]);
  const [localTeam, setLocalTeam] = useState<Team>({ id: '13', nombre: 'Balonmano Zaragoza', logo: '' });
  const [rivalTeam, setRivalTeam] = useState<Team>({ id: '0', nombre: 'Seleccionar Rival', logo: '' });
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  // Estado para controlar errores visuales. Ahora fecha y hora guardan un texto de error.
  const [errors, setErrors] = useState({ rival: false, fecha: '', hora: '', sameTeam: false });

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'local' | 'rival'>('rival');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadTeams() {
      const remote = await db.getTeams();
      if (!mounted) return;

      if (remote.length > 0) {
        setTeams(remote);

        const zaragoza = remote.find((team) => (team.nombre || '').toLowerCase().includes('zaragoza')) || remote[0];
        if (zaragoza) {
          setLocalTeam(zaragoza);
        }
      }
    }

    loadTeams();

    return () => {
      mounted = false;
    };
  }, []);

  // Lógica de intercambio
  const swapTeams = () => {
    const temp = localTeam;
    setLocalTeam(rivalTeam);
    setRivalTeam(temp);
    setErrors({ ...errors, rival: false, sameTeam: false });
  };

  const openSelector = (side: 'local' | 'rival') => {
    setSelectingFor(side);
    setSearchQuery('');
    setModalVisible(true);
  };

  const selectTeam = (team: any) => {
    if (selectingFor === 'local') {
      setLocalTeam(team);
    } else {
      setRivalTeam(team);
      setErrors({ ...errors, rival: false, sameTeam: false });
    }
    setModalVisible(false);
  };

  // Filtrado de equipos para el modal
  const filteredTeams = useMemo(() => {
    return teams.filter(t => t.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, teams]);

  const parseTeamId = (teamId: string) => {
    const parsed = Number(teamId);
    return Number.isNaN(parsed) ? null : parsed;
  };

  // Lógica de Validación Estricta
  const handleSave = async () => {
    let hasError = false;
    const newErrors = { rival: false, fecha: '', hora: '', sameTeam: false };

    // 1. Validar Rival
    if (rivalTeam.id === '0') {
      newErrors.rival = true;
      hasError = true;
    }

    // 2. Validar Mismo Equipo
    if (localTeam.id === rivalTeam.id && rivalTeam.id !== '0') {
      newErrors.sameTeam = true;
      hasError = true;
    }

    // 3. Validar Fecha (DD/MM/AAAA)
    const fechaTrim = fecha.trim();
    if (!fechaTrim) {
      newErrors.fecha = 'Rellena este campo';
      hasError = true;
    } else {
      // Regex para validar formato exacto DD/MM/AAAA (días 01-31, meses 01-12)
      const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
      if (!fechaRegex.test(fechaTrim)) {
        newErrors.fecha = 'Formato inválido (Ej: 25/02/2026)';
        hasError = true;
      }
    }

    // 4. Validar Hora (HH:MM de 00:00 a 23:59)
    const horaTrim = hora.trim();
    if (!horaTrim) {
      newErrors.hora = 'Rellena este campo';
      hasError = true;
    } else {
      // Regex para validar formato HH:MM
      const horaRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horaRegex.test(horaTrim)) {
        newErrors.hora = 'Formato inválido (Ej: 18:00)';
        hasError = true;
      }
    }

    // Lanzar alerta y parar ejecución si hay errores
    if (hasError) {
      setErrors(newErrors);

      if (newErrors.sameTeam) {
        Alert.alert('Error de equipos', 'El equipo local y el visitante no pueden ser el mismo.');
      } else {
        Alert.alert('Formulario incompleto', 'Por favor, corrige los campos marcados en rojo.');
      }
      return;
    }

    const idEquipoLocal = parseTeamId(localTeam.id);
    const idEquipoVisitante = parseTeamId(rivalTeam.id);

    if (!idEquipoLocal || !idEquipoVisitante) {
      Alert.alert('Error', 'No se pudo convertir el ID de los equipos para guardar el partido.');
      return;
    }

    if (idEquipoLocal === idEquipoVisitante) {
      Alert.alert('Error', 'El equipo local y el visitante no pueden ser el mismo.');
      return;
    }

    const created = await db.addMatch({
      idEquipoLocal,
      idEquipoVisitante,
      fecha: fecha.trim(),
      hora: hora.trim(),
      condicion: idEquipoLocal === 13 ? 'local' : 'visitante',
    });

    if (!created) {
      Alert.alert('Error', 'No se pudo guardar el partido en la API.');
      return;
    }

    Alert.alert('¡Éxito!', 'Partido programado correctamente.');
    setFecha('');
    setHora('');
    setRivalTeam({ id: '0', nombre: 'Seleccionar Rival', logo: '' });
    setErrors({ rival: false, fecha: '', hora: '', sameTeam: false });
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* SECTOR DE EQUIPOS */}
      <View style={[styles.matchHeader, { backgroundColor: theme.card }]}>
        <TouchableOpacity style={styles.teamBox} onPress={() => openSelector('local')}>
          <Text style={[styles.teamTitle, { color: theme.textSecondary }]}>Local</Text>
          <View style={[styles.logoCircle, { borderColor: errors.sameTeam ? '#ff4d4d' : theme.border }]}>
            {localTeam.logo ? <Image source={{ uri: localTeam.logo }} style={styles.logoImg} /> : <Text style={{ color: theme.text }}>?</Text>}
          </View>
          <Text style={[styles.teamLabel, { color: theme.text }]} numberOfLines={1}>{localTeam.nombre}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={swapTeams} style={[styles.swapBtn, { backgroundColor: theme.background }]}>
          <FontAwesome name="exchange" size={20} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.teamBox} onPress={() => openSelector('rival')}>
          <Text style={[styles.teamTitle, { color: theme.textSecondary }]}>Visitante</Text>
          <View style={[styles.logoCircle, { borderColor: errors.rival || errors.sameTeam ? '#ff4d4d' : theme.border, borderWidth: errors.rival || errors.sameTeam ? 3 : 2 }]}>
            {rivalTeam.logo ? <Image source={{ uri: rivalTeam.logo }} style={styles.logoImg} /> : <Text style={{ color: errors.rival ? '#ff4d4d' : theme.text }}>?</Text>}
          </View>
          <Text style={[styles.teamLabel, { color: errors.rival ? '#ff4d4d' : theme.text }]} numberOfLines={1}>{rivalTeam.nombre}</Text>
        </TouchableOpacity>
      </View>

      {/* FORMULARIO */}
      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>

        {/* Label Fecha + Mensaje Error */}
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.text }]}>Fecha:

          </Text>{errors.fecha !== '' && <Text style={{ color: theme.error, fontSize: 12, fontWeight: '600' }}>{errors.fecha}</Text>}
        </View>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: errors.fecha !== '' ? theme.error : theme.border,
              color: theme.text,
              borderWidth: errors.fecha !== '' ? 2 : 1
            }
          ]}
          placeholder="Ej: 25/02/2026"
          placeholderTextColor={theme.textSecondary}
          value={fecha}
          keyboardType="numbers-and-punctuation" // Ayuda en móviles a mostrar el teclado numérico/símbolos
          onChangeText={(text) => {
            setFecha(text);
            if (errors.fecha !== '') setErrors({ ...errors, fecha: '' });
          }}
        />

        {/* Label Hora + Mensaje Error */}
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.text }]}>Hora:</Text>
          {errors.hora !== '' && <Text style={styles.errorText}>{errors.hora}</Text>}
        </View>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: errors.hora !== '' ? '#ff4d4d' : theme.border,
              color: theme.text,
              borderWidth: errors.hora !== '' ? 2 : 1
            }
          ]}
          placeholder="Ej: 18:00"
          placeholderTextColor={theme.textSecondary}
          value={hora}
          keyboardType="numbers-and-punctuation"
          onChangeText={(text) => {
            setHora(text);
            if (errors.hora !== '') setErrors({ ...errors, hora: '' });
          }}
        />

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSave}>
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
                  {item.logo ? (
                    <Image source={{ uri: item.logo }} style={styles.gridLogo} />
                  ) : (
                    <View style={[styles.placeholderLogo, { backgroundColor: theme.background, borderColor: theme.border }]}>
                      <Text style={{ color: theme.text }}>{item.nombre ? item.nombre.charAt(0) : '?'}</Text>
                    </View>
                  )}
                  <Text style={[styles.gridText, { color: theme.text }]} numberOfLines={2}>{item.nombre || 'Sin nombre'}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: theme.textSecondary, marginBottom: 10 }}>No hay equipos disponibles.</Text>
                  <TouchableOpacity onPress={() => {
                    // reintentar carga
                    (async () => {
                      const remote = await db.getTeams();
                      setTeams(remote);
                      const zaragoza = remote.find((team) => (team.nombre || '').toLowerCase().includes('zaragoza')) || remote[0];
                      if (zaragoza) setLocalTeam(zaragoza);
                    })();
                  }}>
                    <Text style={{ color: theme.primary, fontWeight: '600' }}>Reintentar</Text>
                  </TouchableOpacity>
                </View>
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
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  label: { fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ff4d4d', fontSize: 12, fontWeight: 'bold' },
  input: {
    // ACCESIBILIDAD: Mínimo 48px de altura para un área de toque cómoda
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 15, // Más espacio a los lados para respirar
    fontSize: 16, // NUNCA menos de 16px en campos de texto, o iOS hará zoom automático molestando al usuario
    marginBottom: 15,
  }, saveBtn: { 
    // ACCESIBILIDAD: El botón principal debe ser grande y fácil de tocar sin mirar
    minHeight: 50, 
    borderRadius: 10, // Bordes un poco más redondeados son más amigables
    alignItems: 'center', 
    justifyContent: 'center', // Centra el texto vertical y horizontalmente
    marginTop: 15, 
  },
  
  saveBtnText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    // ACCESIBILIDAD: Cambiamos 'bold' por '600' para que no sangre la letra en pantallas AMOLED
    fontWeight: '600', 
    letterSpacing: 0.5, // Un pelín de espacio entre letras mejora la lectura
  },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: '70%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 10, marginBottom: 20 },
  searchInput: { flex: 1, padding: 10, marginLeft: 10 },
  gridItem: { flex: 1 / 3, alignItems: 'center', marginBottom: 20, padding: 5 },
  gridLogo: { width: 50, height: 50, resizeMode: 'contain', marginBottom: 5 },
  gridText: { fontSize: 11, textAlign: 'center' },
  closeBtn: { alignItems: 'center', padding: 15, marginTop: 10 }
});