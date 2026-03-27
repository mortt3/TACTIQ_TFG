import { useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import { View, Button, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 


export default function UploadVideoScreen() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    const selectAndUploadVideo = async () => {
        try {
            // 1. Seleccionar el video
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["videos"],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });

            if (result.canceled) return;

            if (result.assets && result.assets.length > 0) {
                const video = result.assets[0];
                await uploadVideo(video);
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo seleccionar el video');
        }
    };

    const uploadVideo = async (video: any) => {
        setLoading(true);

        // 2. Crear FormData
        const formData = new FormData();
        formData.append('video', {
            uri: video.uri,
            name: video.name || 'video.mp4',
            type: video.type || 'video/mp4',
        } as any);

        try {
            // 3. Enviar al backend
            const response = await fetch('https://tu-backend.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const resultData = await response.json();
            if (response.ok) {
                Alert.alert('Éxito', 'Video subido correctamente');
            } else {
                Alert.alert('Error', resultData.message || 'Error al subir');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo conectar con el servidor');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Subir vídeo del partido</Text>
                <Text style={styles.description}>Aquí podrás subir el vídeo del partido para que la IA lo analice y extraiga los eventos clave como goles y sanciones.</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Seleccionar y Subir Video" onPress={selectAndUploadVideo} />
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, color: '#666', textAlign: 'center' },
});