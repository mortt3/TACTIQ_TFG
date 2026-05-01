import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Simula una portería dividida en 9 zonas (3x3)
export default function GoalZoneMap() {
  // Simulamos que la zona inferior central tiene muchos goles (rojo)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zona portería (Mapa de calor)</Text>
      <View style={styles.goalFrame}>
        <View style={styles.row}>
          <View style={styles.zone}><Text>1</Text></View>
          <View style={styles.zone}><Text>2</Text></View>
          <View style={styles.zone}><Text>3</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.zone}><Text>4</Text></View>
          <View style={styles.zone}><Text>5</Text></View>
          <View style={styles.zone}><Text>6</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.zone}><Text>7</Text></View>
          <View style={[styles.zone, styles.hotZone]}><Text style={styles.hotText}>8</Text></View>
          <View style={styles.zone}><Text>9</Text></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  goalFrame: { width: 200, height: 150, borderWidth: 4, borderColor: '#333', borderBottomWidth: 0 },
  row: { flex: 1, flexDirection: 'row' },
  zone: { flex: 1, borderWidth: 1, borderColor: '#CCC', justifyContent: 'center', alignItems: 'center' },
  hotZone: { backgroundColor: 'rgba(255, 0, 0, 0.5)' }, // Zona caliente en rojo
  hotText: { color: '#FFF', fontWeight: 'bold' }
});