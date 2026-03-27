import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";



export default function UploadVideoScreen() {
  const { id } = useLocalSearchParams();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir vídeo del partido {id}</Text>
      <Text style={styles.description}>Aquí podrás subir el vídeo del partido para que la IA lo analice y extraiga los eventos clave como goles y sanciones.</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, color: '#666', textAlign: 'center' },
  });