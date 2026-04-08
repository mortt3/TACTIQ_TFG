import React, { createContext, useContext, useState } from 'react';

// Definimos nuestros colores para ambos temas
export const lightColors = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#888888',
  border: '#E0E0E0',
  primary: '#007BFF',
};

export const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  primary: '#3DA9FC',
};

// Creamos el contexto
const ThemeContext = createContext<any>(null);

// Proveedor que envolverá nuestra aplicación
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Dependiendo del estado, usamos una paleta u otra
  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema fácilmente en cualquier pantalla
export const useTheme = () => useContext(ThemeContext);