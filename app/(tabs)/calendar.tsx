import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddMatchScreen() {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const handleSave = () => {
    Alert.alert("Guardado", "Partido añadido al calendario con éxito.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.matchHeader}>
        <View style={styles.teamBox}>
          <Text style={styles.teamTitle}>Local</Text>
          <View style={styles.logoPlaceholder}><Text>CZ</Text></View>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.teamBox}>
          <Text style={styles.teamTitle}>Rival (Seleccionar)</Text>
          <View style={styles.logoPlaceholder}><Text>?</Text></View>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Fecha:</Text>
        <TextInput style={styles.input} placeholder="Ej: 25 / 02 / 2026" value={fecha} onChangeText={setFecha} />

        <Text style={styles.label}>Hora:</Text>
        <TextInput style={styles.input} placeholder="Ej: 18:00" value={hora} onChangeText={setHora} />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Guardar partido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    backgroundColor: '#F8F9FA', 
    padding: 20 
  },
  matchHeader: 
  { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 10, 
    marginBottom: 30 
  },
  teamBox: 
  { 
    alignItems: 'center' 
  },
  teamTitle: 
  { 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#555' 
  },
  logoPlaceholder: 
  { width: 60, 
    height: 60, 
    backgroundColor: '#EEE', 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  vsText: 
  { fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  formContainer: 
  { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 10 
  },
  label: 
  { fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8, 
    marginTop: 10 
  },
  input: 
  { 
    borderWidth: 1, 
    borderColor: '#CCC', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16, 
    marginBottom: 15 
  },
  saveBtn: 
  { 
    backgroundColor: '#007BFF', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 20 
  },
  saveBtnText: 
  { color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});