import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import MatchService from '@/services/MatchService';
import { Match } from '@/models/Match';

export default function ListMatches() {
  const router = useRouter();
  const [listMatches, setListMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await MatchService.getQuickMatches();
        setListMatches(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };
    fetchMatches();
  }, []);

  // Filter matches based on search query
  const filteredMatches = listMatches.filter((match) => {
    const query = searchQuery.toLowerCase();
    return (
      match.team1.teamName.toLowerCase().includes(query) ||
      match.team2.teamName.toLowerCase().includes(query) ||
      match.kind.toLowerCase().includes(query) ||
      (match.location && match.location.toLowerCase().includes(query))
    );
  });

  return (
    <View className="flex-1 bg-darkBg">
      {/* Search Bar */}
      <View className="flex-row items-center p-4">
        <View className="flex-1 bg-darkCard rounded-lg p-2">
          <TextInput
            placeholder="Recherchez un match..."
            placeholderTextColor="#888"
            className="text-white text-base"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Matches List */}
      {filteredMatches.length > 0 ? (
        <ScrollView className="flex-1 px-4">
          {filteredMatches.map((match: any, index: number) => {
            const matchDate = new Date(match.date);
            const now = new Date();

            let status = "Upcoming";
            if (matchDate < now) {
              status = "Finished";
            } else if (Math.abs(matchDate.getTime() - now.getTime()) < 2 * 60 * 60 * 1000) {
              status = "Live";
            }

            return (
              <View
                key={index}
                className="bg-darkCard rounded-xl p-4 mb-4 shadow-md"
              >
                {/* kind and Status */}
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <Text className="text-white text-xs font-bold mr-2">{match.kind}</Text>
                    <View className="flex-row items-center">
                      <View
                        className={`w-2 h-2 rounded-full mr-1 ${status === 'Live' ? 'bg-red-500' : status === 'Finished' ? 'bg-gray-500' : 'bg-green-500'}`}
                      />
                      <Text className="text-grayText text-xs">{status}</Text>
                    </View>
                  </View>
                </View>

                {/* Date and Time */}
                <View className="flex-row justify-between mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={16} color="#888" className="mr-2" />
                    <Text className="text-white text-xs">
                      {matchDate.toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#888" className="mr-1" />
                    <Text className="text-grayText text-xs">
                      {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>

                {/* Public Status and Location */}
                <View className="flex-row justify-between mb-3">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={match.isPublic ? "earth-outline" : "lock-closed-outline"}
                      size={16}
                      color="#888"
                      className="mr-2"
                    />
                    <Text className="text-white text-xs">
                      {match.isPublic ? 'Public' : 'Private'}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={16} color="#888" className="mr-1" />
                    <Text className="text-grayText text-xs">
                      {match.location || 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Match */}
                <View className="flex-row items-center justify-between">
                  {/* Team 1 */}
                  <View className="items-center flex-1">
                    <Image
                      source={
                        require('../../assets/images/smatch-logo.png') || {
                          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT47BCujnxwb0EPqIn5adOSSy7tIqEX02XUvw&s',
                        }
                      }
                      className="w-16 h-16 mb-1"
                      resizeMode="contain"
                    />
                    <Text className="text-white text-sm font-bold text-center">
                      {match.team1.teamName}
                    </Text>
                  </View>

                  {/* VS */}
                  <View className="items-center w-12">
                    <Text className="text-white font-bold">VS</Text>
                  </View>

                  {/* Team 2 */}
                  <View className="items-center flex-1">
                    <Image
                      source={
                        require('../../assets/images/smatch-logo.png') || {
                          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT47BCujnxwb0EPqIn5adOSSy7tIqEX02XUvw&s',
                        }
                      }
                      className="w-16 h-16 mb-1"
                      resizeMode="contain"
                    />
                    <Text className="text-white text-sm font-bold text-center">
                      {match.team2.teamName}
                    </Text>
                  </View>
                </View>

                {/* Additional Info */}
                <View className="flex-row justify-end items-center mt-3">
                  <Link href={{ pathname: "/matches/[id]", params: { id: match._id } }} asChild>
                    <Text className="text-accentBlue text-x font-bold">View Details</Text>
                  </Link>
                  <Ionicons name="chevron-forward-outline" size={16} color="#3B82F6" className="ml-1" />
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center bg-darkBg">
          <Image
            source={require('../../assets/images/smatch-logo.png')}
            style={{ width: 120, height: 120, marginBottom: 20 }}
            resizeMode="contain"
          />
          {searchQuery ? (
            <Text className="text-grayText text-base">Aucun match trouvé</Text>
          ) : (
            <Text className="text-grayText text-base">Aucun match disponible</Text>
          )}
        </View>
      )}

      {/* Create Match Button */}
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-accentOrange rounded-full p-4 shadow-lg"
        onPress={() => router.push('../matches/create-match')}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}