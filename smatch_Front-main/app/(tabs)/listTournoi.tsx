import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import TournamentService from '@/services/tournamentService';
import { Tournament } from '@/models/Tournament';

export default function ListTournoi() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // Fix getFileUrl function
  const getFileUrl = (path: string | undefined) => {
    const baseURL = 'http://192.168.1.20:3000';
    if (!path) return `${baseURL}/default.jpg`;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${baseURL}/${normalizedPath}`;
  };

  // Function to determine tournament status based on dates
  const getTournamentStatus = (startDate: string, endDate?: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 24 * 60 * 60 * 1000); // Default: 1 day after start if no endDate

    if (now < start) {
      return 'Upcoming';
    } else if (now >= start && now <= end) {
      return 'Ongoing';
    } else {
      return 'Finished';
    }
  };

  useEffect(() => {
    // Fetch tournaments data
    TournamentService.getAllTournaments()
      .then((response) => {
        setTournaments(response.data);
      })
      .catch((error) => {
        console.error('Erreur de récupération des tournois:', error);
      });
  }, []);

  return (
    <View className="flex-1 bg-darkBg">
      {/* Search Bar */}
      <View className="flex-row items-center p-4">
        <View className="flex-1 bg-darkCard rounded-lg p-2">
          <TextInput
            placeholder="Recherchez un ..."
            placeholderTextColor="#888"
            className="text-white text-base"
          />
        </View>
      </View>

      {/* Tournaments List or Empty State */}
      {tournaments.length > 0 ? (
        <ScrollView className="flex-1 px-4">
          {tournaments.map((tournament, index) => {
            const status = getTournamentStatus(tournament.startDate, tournament.endDate);
            return (
              <View
                key={index}
                className="bg-darkCard rounded-xl mb-4 shadow-md"
              >
                {/* Tournament Image */}
                <View className="items-center mb-3">
                  <Image
                    source={{ uri: getFileUrl(tournament.photo) }}
                    className="w-full h-40 rounded-lg shadow-md"
                    resizeMode="cover"
                  />
                </View>

                {/* Tournament Name and Status */}
                <View className="flex-row justify-between items-center mb-2 p-2">
                  <View className="flex-row items-center">
                    <Text className="text-white text-xl font-bold mr-2">{tournament.name}</Text>
                    <View className="flex-row items-center">
                      <View
                        className={`w-2 h-2 rounded-full mr-1 ${
                          status === 'Ongoing'
                            ? 'bg-green-500'
                            : status === 'Finished'
                            ? 'bg-red-500'
                            : 'bg-accentOrange'
                        }`}
                      />
                      <Text className="text-grayText text-xs">{status}</Text>
                    </View>
                  </View>
                </View>

                {/* Date Range and Location */}
                <View className="flex-row justify-between mb-3 p-2">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={16} color="#888" className="mr-2" />
                    <Text className="text-white text-xs">
                      {new Date(tournament.startDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {tournament.endDate &&
                        ` - ${new Date(tournament.endDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}`}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={16} color="#888" className="mr-1" />
                    <Text className="text-grayText text-xs">{tournament.location}</Text>
                  </View>
                </View>

                {/* Additional Info */}
                <View className="flex-row justify-end items-center p-2">
                  <Link href={{ pathname: '/tournois/[id]', params: { id: tournament._id } }} asChild>
                    <Text className="text-accentBlue text-x font-bold">View Details</Text>
                  </Link>
                  <Ionicons name="chevron-forward-outline" size={16} color="#3B82F6" className="ml-1" />
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-white text-lg font-semibold text-center">Aucun tournoi trouvé</Text>
          <Text className="text-grayText text-sm text-center mt-2">
            Il semble qu'il n'y ait aucun tournoi disponible pour le moment. Revenez plus tard ou créez-en un !
          </Text>
        </View>
      )}
    </View>
  );
}