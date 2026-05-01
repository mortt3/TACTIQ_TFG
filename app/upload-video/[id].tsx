import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from "expo-router";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext'; // Importamos el contexto (Ajusta la ruta si es necesario)

export default function UploadVideoScreen() {
    const { theme } = useTheme(); // Extraemos el tema actual
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
        /* Unificamos todo en un solo contenedor principal para que el fondo cubra el 100% */
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text }]}>Subir vídeo del partido</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    Aquí podrás subir el vídeo del partido para que la IA lo analice y extraiga los eventos clave como goles y sanciones.
                </Text>
            </View>
            
            <View style={styles.actionContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} />
                ) : (
                    /* Cambiamos el Button por TouchableOpacity para que encaje con tu diseño */
                    <TouchableOpacity 
                        style={[styles.uploadButton, { backgroundColor: theme.primary }]} 
                        onPress={selectAndUploadVideo}
                    >
                        <Text style={styles.buttonText}>Seleccionar y Subir Video</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 10,
        textAlign: 'center'
    },
    description: { 
        fontSize: 16, 
        textAlign: 'center',
        lineHeight: 24,
    },
    actionContainer: {
        flex: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    uploadButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        // Sombras para darle un toque más pro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});