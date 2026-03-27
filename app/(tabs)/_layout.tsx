import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#0000FF', // El color azul de selección
        tabBarInactiveTintColor: '#888888',
        headerShown: true, // Muestra el título en la parte superior
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Partidos',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Añadir',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar-plus-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: 'Plantilla',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
        }}
      />
    </Tabs>
  );
}