import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { Link, router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '@/services/UserService';
import { User } from '@/models/User';

// Mock data for sections (replace with API calls)
const matches = [
  { id: 1, opponent: 'Team Ace', date: '2025-05-15', score: '3-1', status: 'Upcoming' },
  { id: 2, opponent: 'Smashers', date: '2025-05-10', score: '2-3', status: 'Played' },
];

const rankings = [
  { rank: 1, team: 'SMATCH Elite', points: 120 },
  { rank: 2, team: 'Team Ace', points: 110 },
  { rank: 3, team: 'Smashers', points: 95 },
];

const team = [
  { id: 1, name: 'Ahmed Khalil', role: 'Captain', position: 'Setter' },
  { id: 2, name: 'Sara Ben Ali', role: 'Player', position: 'Libero' },
  { id: 3, name: 'Omar Trabelsi', role: 'Player', position: 'Outside Hitter' },
];
const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const sections = ['Mon Profil', 'Mes Matchs', 'Classement', 'Mon Équipe'];
  const [selectedSection, setSelectedSection] = useState('Mon Profil');


  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  // get user login data;
  const getUserData = async () => {
    const token = await AsyncStorage.getItem('token');
    const idUser = await UserService.getUserIdFromToken();
    try {
      const userData = await UserService.getUserById(idUser, token!);
      setUserData(userData.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Check if the user is logged in
  const checkLogin = async () => {
    const result = await UserService.isLoggedIn();
    if (!result) {
      router.replace('/auth/login');
    } else {
      await getUserData()
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // À chaque fois que l'écran revient au focus, on recharge les données
      setIsLoading(true);
      checkLogin();
    }, [])
  );
  // Loading state 
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-darkBg">
        <Image
          source={require('../../assets/images/smatch-logo.png')}
          style={{ width: 120, height: 120, marginBottom: 20 }}
          resizeMode="contain"
        />
      </View>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: '#1e1e32' }}>

      <ScrollView style={{ flex: 1 }}>
        <View className="flex-1 bg-darkBg">

          {/* Profile Header and logout button */}
          <View className="flex-1 bg-darkBg">
            <View className="items-center py-5">
              <View className="flex-row items-center justify-center">
                <Image
                  source={
                    userData?.profilePicture
                      ? { uri: userData.profilePicture }
                      : require('../../assets/images/user.png')
                  }
                  className="w-24 h-24 rounded-full mb-2"
                />

                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    backgroundColor: '#ff6f61',
                    borderRadius: 12,
                    padding: 6,
                  }}
                  onPress={() => router.push('../profileUser/editProfile')}
                >
                  <Ionicons name="pencil-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {userData && (
                <>
                  <Text className="text-white text-xl font-bold mb-1">{userData.name}</Text>
                  <Text className="text-white text-sm">#best_player {userData.role} 🔥</Text>
                </>
              )}
            </View>

            {/* Logout Button */}
            <View className="px-5">
              <TouchableOpacity
                className="py-2 px-4 rounded-full border mb-5"
                onPress={handleLogout} // Assumes handleLogout is defined in your component
                style={{ alignSelf: 'center', backgroundColor: 'transparent', borderColor: '#ff6f61', }} // Keeps it subtle
              >
                <Text className="text-accentOrange text-sm font-bold">Déconnexion</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Selector */}
          <FlatList
            horizontal
            data={sections}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: selectedSection === item ? '#ff6f61' : '#2a2a40',
                  borderRadius: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginRight: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => setSelectedSection(item)}
              >
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: 16, marginBottom: 16 }}
          />

          {/* Section Content */}
          {selectedSection === 'Mon Profil' && (
            <View className="">
              {userData && (
                <>
                  <View className="flex-row justify-between items-center py-4 px-5 border-b border-darkCard">
                    <View className="flex-row items-center">
                      <Ionicons name="person-outline" size={20} color="#888" className="mr-4" />
                      <View>
                        <Text className="text-grayText text-sm">Name</Text>
                        <Text className="text-white text-base font-bold">{userData.name}</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center py-4 px-5 border-b border-darkCard">
                    <View className="flex-row items-center">
                      <Ionicons name="mail-outline" size={20} color="#888" className="mr-4" />
                      <View>
                        <Text className="text-grayText text-sm">Email</Text>
                        <Text className="text-white text-base font-bold">{userData.email}</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center py-4 px-5 border-b border-darkCard">
                    <View className="flex-row items-center">
                      <Ionicons name="call-outline" size={20} color="#888" className="mr-4" />
                      <View>
                        <Text className="text-grayText text-sm">Phone</Text>
                        <Text className="text-white text-base font-bold">{userData.phone || "not found"}</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center py-4 px-5 border-b border-darkCard">
                    <View className="flex-row items-center">
                      <Ionicons name="location-outline" size={20} color="#888" className="mr-4" />
                      <View>
                        <Text className="text-grayText text-sm">Address</Text>
                        <Text className="text-white text-base font-bold">{userData.address || "not found"}</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}

          {selectedSection === 'Mes Matchs' && (
            <View className="py-4 px-5">
              {matches.map((match) => (
                <View key={match.id} className="bg-darkCard rounded-lg p-4 mb-4">
                  <Text className="text-white text-lg font-bold">{match.opponent}</Text>
                  <Text className="text-grayText text-sm">{match.date}</Text>
                  <Text className="text-accentOrange text-sm">{match.status}</Text>
                  {match.status === 'Played' && (
                    <Text className="text-white text-sm">Score: {match.score}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {selectedSection === 'Classement' && (
            <View className="py-4 px-5">
              {rankings.map((ranking) => (
                <View key={ranking.rank} className="bg-darkCard rounded-lg p-4 mb-4">
                  <Text className="text-white text-lg font-bold">Rank: {ranking.rank}</Text>
                  <Text className="text-white text-lg font-bold">{ranking.team}</Text>
                  <Text className="text-accentOrange text-sm">Points: {ranking.points}</Text>
                </View>
              ))}
            </View>
          )}

          {selectedSection === 'Mon Équipe' && (
            <View className="py-4 px-5">
              {team.map((member) => (
                <View key={member.id} className="bg-darkCard rounded-lg p-4 mb-4">
                  <Text className="text-white text-lg font-bold">{member.name}</Text>
                  <Text className="text-grayText text-sm">{member.role}</Text>
                  <Text className="text-accentOrange text-sm">{member.position}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

    </View>
  );
};

export default Profile;