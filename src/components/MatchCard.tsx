// Archivo: src/components/MatchCard.tsx
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MatchData {
  match: { 
    id_partido : number,
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
  // Función para decidir qué renderizar en el centro
  const renderCenterContent = () => {
    if (match.status === 'played') {
      return (
        <Text style={styles.scoreText}>
          {match.score_local}  -  {match.score_rival}
        </Text>
      );
    } else if (match.status === 'next') {
      // Formateamos la hora para que salga "HH:MM"
      const timeString = match.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return <Text style={styles.timeText}>{timeString}</Text>;
    } else {
      return <Text style={styles.futureText}>--</Text>;
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {/* Logo Local */}
      <Image source={{ uri: match.local_logo }} style={styles.logo} />
      
      {/* Contenido Central (Resultado / Hora / Guiones) */}
      <View style={styles.centerContainer}>
        {renderCenterContent()}
      </View>

      {/* Logo Rival */}
      <Image source={{ uri: match.rival_logo }} style={styles.logo} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 3,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  futureText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
});