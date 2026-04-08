import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext'; // SOLO IMPORTAMOS EL HOOK

export default function TabLayout() {
  // Ahora leemos el tema que nos inyecta el RootLayout padre
  const { theme } = useTheme();

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: theme.primary, 
        tabBarInactiveTintColor: theme.textSecondary,
        // Cambiamos el color de fondo de la barra y de la cabecera según el tema
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Partidos', tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} /> }} />
      <Tabs.Screen name="calendar" options={{ title: 'Añadir', tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar-plus-o" color={color} /> }} />
      <Tabs.Screen name="players" options={{ title: 'Plantilla', tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} /> }} />
    </Tabs>
  );
}