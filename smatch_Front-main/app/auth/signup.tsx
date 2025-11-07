import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { User } from '@/models/User';
import UserService from '@/services/UserService';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '', terms: '' });

  const validateInputs = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '', terms: '' };

    if (!name.trim()) {
      newErrors.name = 'Le nom complet est requis';
      valid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Veuillez entrer un e-mail valide';
      valid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      valid = false;
    }
    if (!termsAccepted) {
      newErrors.terms = 'Vous devez accepter les termes et conditions';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle signup button press
  const handleSignup = async () => {
  if (validateInputs()) {
    try {
      const response = await UserService.signup({ name, email, password });
      console.log('Utilisateur créé:', response.data);
      router.push('./login');
    } catch (error: any) {
      console.error('Erreur lors de la création du compte:', error.response?.data || error.message);
    }
  }
};


  const handleGoogleSignup = () => {
    console.log('Google signup attempted');
  };

  const handleLogin = () => {
    // Navigate to login screen
    router.push('./login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image
        source={require('../../assets/images/auth-bg.png')} // Replace with your image
        style={styles.backgroundImage}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Title */}
          <Text style={styles.title}>Créer un compte</Text>

          {/* Input Fields */}
          <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
            <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              accessibilityLabel="Nom complet"
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Adresse e-mail"
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              accessibilityLabel="Mot de passe"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={termsAccepted ? '#f4f3f4' : '#f4f3f4'}
              onValueChange={setTermsAccepted}
              value={termsAccepted}
              accessibilityLabel="Accepter les termes et conditions"
            />
            <Text style={styles.termsText}>J’accepte les termes et conditions</Text>
          </View>
          {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

          {/* Signup Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.buttonText}>S’inscrire</Text>
          </TouchableOpacity>

          {/* Google Signup Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup}>
            <Ionicons name="logo-google" size={20} color="#fff" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>S’inscrire avec Google</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Vous avez déjà un compte ? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Connectez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e32', // Dark background
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.15, // Slightly increased opacity for subtle effect
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingVertical: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a40',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 10,
  },
  signupButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA031',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: '#181829',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#aaa',
    fontSize: 14,
  },
  loginLink: {
    color: '#1e90ff',
    fontSize: 14,
    fontWeight: '600',
  },
});

