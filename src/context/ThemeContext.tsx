import AsyncStorage from '@react-native-async-storage/async-storage'; // Importamos la memoria
import React, { createContext, useContext, useEffect, useState } from 'react';

export const lightColors = {
  background: '#F3F4F6', // Un gris extremadamente claro, mejor para la vista que el blanco puro
  card: '#FFFFFF',
  text: '#111827', // Un gris casi negro. El negro puro cansa la vista.
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#2563EB', // Azul profesional y profundo con contraste perfecto sobre blanco
  error: '#DC2626', // Rojo oscuro y serio para alertas
};

export const darkColors = {
  background: '#121212', // Gris muy oscuro, el estándar de accesibilidad para modo noche
  card: '#1F2937', // Un tono más claro que el fondo para crear profundidad (efecto carta)
  text: '#F9FAFB', // Blanco roto. Evita el "efecto halo" del blanco puro (#FFF)
  textSecondary: '#9CA3AF', 
  border: '#374151',
  primary: '#3B82F6', // Azul desaturado y suave. No "vibra" en la oscuridad, relaja el ojo.
  error: '#EF4444', // Un rojo más pastel y suave para que no sea agresivo en modo oscuro
};

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Estado para evitar el "parpadeo" blanco

  // 1. CARGAR: Se ejecuta una sola vez cuando se abre la app
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@dark_mode');
        if (savedTheme !== null) {
          // Si existía un valor guardado ("true" o "false"), lo aplicamos
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Error cargando el tema:", error);
      } finally {
        // Indicamos que ya hemos terminado de leer la memoria
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // 2. GUARDAR: Función para cambiar el tema y persistirlo
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      // Guardamos el nuevo valor convertido a texto (string)
      await AsyncStorage.setItem('@dark_mode', JSON.stringify(newMode));
    } catch (error) {
      console.error("Error guardando el tema:", error);
    }
  };

  const theme = isDarkMode ? darkColors : lightColors;

  // Si aún no hemos leído la memoria, no renderizamos nada (o un Spinner)
  // para evitar que la pantalla salga blanca y de repente se ponga negra.
  if (!isLoaded) return null; 

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);