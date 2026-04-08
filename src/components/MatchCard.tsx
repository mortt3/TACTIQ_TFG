import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface MatchData {
  match: { 
    id_partido : number,
    local_nombre: string, // Nuevo campo
    rival_nombre: string, // Nuevo campo
    local_logo: string,
    rival_logo: string,
    status: string,
    fecha : Date,
    score_local?: number,
    score_rival?: number
  },
  onPress: () => void
}

export default function MatchCard({ match, onPress }: MatchData) {
  const { theme } = useTheme();

  // Formateador de fecha sencillo (DD/MM/YY)
  const dateString = match.fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const renderCenterContent = () => {
    if (match.status === 'played') {
      return (
        <View style={styles.centerWrapper}>
          <Text style={[styles.scoreText, { color: theme.text }]}>
            {match.score_local}  -  {match.score_rival}
          </Text>
          <Text style={[styles.dateTextSmall, { color: theme.textSecondary }]}>
            {dateString}
          </Text>
        </View>
      );
    } else if (match.status === 'next') {
      const timeString = match.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return (
        <View style={styles.centerWrapper}>
          <Text style={[styles.timeText, { color: theme.text }]}>{timeString}</Text>
          <Text style={[styles.dateTextSmall, { color: theme.textSecondary, marginTop: 4 }]}>
            {dateString}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.centerWrapper}>
          <Text style={[styles.futureText, { color: theme.textSecondary }]}>--</Text>
          <Text style={[styles.dateTextSmall, { color: theme.textSecondary, marginTop: 4 }]}>
            {dateString}
          </Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.cardContainer, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={onPress}
    >
      {/* Equipo Local */}
      <View style={styles.teamSide}>
        <Image source={{ uri: match.local_logo }} style={styles.logo} />
        <Text numberOfLines={1} style={[styles.teamName, { color: theme.text }]}>
            {match.local_nombre}
        </Text>
      </View>
      
      {/* Centro dinámico */}
      <View style={styles.centerContainer}>
        {renderCenterContent()}
      </View>

      {/* Equipo Rival */}
      <View style={styles.teamSide}>
        <Image source={{ uri: match.rival_logo }} style={styles.logo} />
        <Text numberOfLines={1} style={[styles.teamName, { color: theme.text }]}>
            {match.rival_nombre}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  teamName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1.2, // Un poco más de espacio al centro para que no choquen los nombres
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrapper: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  futureText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateTextSmall: {
    fontSize: 12,
    fontWeight: '400',
  },
});