import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '@/services/UserService';
import { User } from '@/models/User';
import { Picker } from '@react-native-picker/picker';

const volleyballPositions = [
  'Setter',               // Poste 1 : Zone de service (souvent le passeur commence ici)
  'Opposite',             // Poste 2 : Avant-droit (attaquant opposé au passeur)
  'Outside Hitter',       // Poste 3 : Avant-centre (souvent un central ou réceptionneur-attaquant)
  'Middle Blocker',       // Poste 4 : Avant-gauche (central ou réceptionneur)
  'Outside Hitter',       // Poste 5 : Arrière-gauche (réceptionneur-attaquant)
  'Libero'                // Poste 6 : Arrière-centre (le libéro remplace souvent ici en défense)
];


export default function EditProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: keyof User, value: string) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };


  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange('birthDate', formattedDate);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!profileData) {
      Toast.show({
        type: 'error',
        text1: 'Oops!',
        text2: 'profileData are required 😊',
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const idUser = await UserService.getUserIdFromToken();
      if (!token || !idUser) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Authentication required',
        });
        return;
      }

      // Update user profile via UserService
      await UserService.updateUser(idUser, profileData, token);
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your profile has been updated 🎉',
      });

      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile 😔',
      });
    }
  };


  useEffect(() => {
    getUserData();
  }, []);

  // Fetch user data when the component mounts
  const getUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const idUser = await UserService.getUserIdFromToken();
      if (!token || !idUser) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Authentication required',
        });
        return;
      }

      const userData = await UserService.getUserById(idUser, token);
      setProfileData({
        id: userData.data.id,
        role: userData.data.role,
        name: userData.data.name,
        email: userData.data.email,
        phone: userData.data.phone,
        address: userData.data.address,
        birthDate: userData.data.birthDate,
        position: userData.data.position,
      });
      console.log('User Data:', userData.data);
      console.log('Token:', token);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load profile data 😔',
      });
    }
  };

  // Render the component
  // Check if profileData is null or undefined
  if (!profileData) {
    return (
      <View className="flex-1 items-center justify-center bg-darkBg">
        <Text className="text-white">Loading profile...</Text>
      </View>
    );
  }

  // Render the profile edit form
  return (
    <ScrollView className="flex-1 bg-darkBg">
      <View className="p-4 mt-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-col">
            <Text className="text-white text-xl font-bold">Edit Profile</Text>
            {profileData.role && (
              <Text className="text-white text-base font-medium capitalize">
                You are {profileData.role}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="bg-darkCard rounded-lg p-4 mb-4">
          <View className="mb-4">
            <Text className="text-white text-sm font-bold mb-2">Name</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholder="Enter your name"
              placeholderTextColor="#888"
              value={profileData!.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>
          <View className="mb-4">
            <Text className="text-white text-sm font-bold mb-2">Email</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={profileData!.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
          </View>
          <View className="mb-4">
            <Text className="text-white text-sm font-bold mb-2">Phone</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholder="Enter your phone number"
              placeholderTextColor="#888"
              value={profileData!.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>
          <View className="mb-4">
            <Text className="text-white text-sm font-bold mb-2">Address</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg"
              placeholder="Enter your address"
              placeholderTextColor="#888"
              value={profileData!.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>
          <View className="mb-4">
            <Text className="text-white text-sm font-bold mb-2">Birth Date</Text>
            <TouchableOpacity
              className="bg-gray-800 text-white p-3 rounded-lg flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className={profileData!.birthDate ? 'text-white' : 'text-gray-500'}>
                {profileData!.birthDate || 'Select Birth Date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={profileData!.birthDate ? new Date(profileData!.birthDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
          <View className="mb-4">
            <Text className="text-white text-sm font-bold mb-2">Position</Text>
            <View className="bg-gray-800 rounded-lg">
              <Picker
                selectedValue={profileData!.position}
                onValueChange={(itemValue) => handleInputChange('position', itemValue)}
                dropdownIconColor="#fff"
                style={{ color: 'white' }}
              >
                <Picker.Item label="Select position" value="" />
                {volleyballPositions.map((pos) => (
                  <Picker.Item key={pos} label={pos} value={pos} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-accentOrange rounded-lg py-3 px-4 flex-row items-center justify-center"
          onPress={handleSubmit}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text className="text-white text-sm font-bold ml-2">Save Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}