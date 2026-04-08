import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext'; // IMPORTAMOS EL HOOK

interface SettingRowProps {
  icon: keyof typeof FontAwesome.glyphMap;
  title: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

export default function SettingsScreen() {
  // EXTRAEMOS LOS DATOS DEL CONTEXTO GLOBAL
  const { isDarkMode, toggleTheme, theme } = useTheme(); 
  
  const [notifications, setNotifications] = useState(true);

  const SettingRow = ({ icon, title, rightElement, onPress }: SettingRowProps) => (
    <TouchableOpacity 
      style={[styles.row, { borderBottomColor: theme.border }]} 
      onPress={onPress} 
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        <FontAwesome name={icon} size={20} color={theme.textSecondary} style={styles.icon} />
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {rightElement || <FontAwesome name="angle-right" size={20} color={theme.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    // Aplicamos el color de fondo dinámico
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Cuenta</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <SettingRow icon="user" title="Editar Perfil" onPress={() => console.log('Perfil')} />
        <SettingRow icon="lock" title="Cambiar Contraseña" onPress={() => console.log('Password')} />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferencias</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <SettingRow 
          icon="moon-o" 
          title="Modo Oscuro" 
          rightElement={
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme} // USAMOS LA FUNCIÓN DEL CONTEXTO
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={isDarkMode ? '#FFF' : '#f4f3f4'}
            />
          } 
        />
        <SettingRow 
          icon="bell-o" 
          title="Notificaciones" 
          rightElement={
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ false: '#767577', true: theme.primary }}
            />
          } 
        />
        <SettingRow icon="language" title="Idioma" onPress={() => console.log('Idioma')} />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Información</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <SettingRow icon="info-circle" title="Acerca de TACTIQ" onPress={() => console.log('About')} />
        <SettingRow icon="sign-out" title="Cerrar Sesión" onPress={() => console.log('Logout')} />
      </View>

      <Text style={styles.versionText}>Versión 1.0.0</Text>
    </ScrollView>
  );
}

// Ya no hay colores fijos aquí, los gestionamos arriba
const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 20, marginTop: 25, marginBottom: 8, textTransform: 'uppercase' },
  section: { borderTopWidth: 1, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 25, textAlign: 'center', marginRight: 15 },
  rowTitle: { fontSize: 16 },
  versionText: { textAlign: 'center', color: '#AAA', marginTop: 30, marginBottom: 40 }
});