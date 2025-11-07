// toastConfig.js
import { BaseToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        height: 80,
        padding: 10,
        backgroundColor: '#e6ffed',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
      }}
      text2Style={{
        fontSize: 16,
        color: '#1b5e20',
      }}
    />
  ),

  // Garde aussi l'erreur si tu l'avais déjà défini
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'red',
        height: 80,
        padding: 10,
        backgroundColor: '#ffe6e6',
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
      }}
      text2Style={{
        fontSize: 16,
        color: '#a00',
      }}
    />
  ),
};
