import { ScrollView, Text, View, Image } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const tournaments = [
  {
    name: 'UEFA Champions League 2021',
    dateRange: 'Feb 2021 - May 2021',
    location: 'Europe',
    status: 'Finished',
    image: 'https://m.media-amazon.com/images/S/pv-target-images/f96fddd4eb3700e10249fbe45ba93f3340d6867a49a99500671d734a44be3f46.jpg',
    overview: 'The UEFA Champions League 2021 featured top European clubs competing for the prestigious title, culminating in a thrilling final between Manchester City and Chelsea.',
    matches: [
      { id: 1, teams: ['Manchester City', 'Chelsea'], date: 'May 29, 2021', score: '1 - 0' },
      { id: 2, teams: ['Real Madrid', 'Liverpool'], date: 'April 6, 2021', score: '3 - 1' },
    ],
    teams: ['Manchester City', 'Chelsea', 'Real Madrid', 'Liverpool', 'Paris Saint-Germain', 'Bayern Munich'],
  },
  {
    name: 'La Liga Tournament 2021',
    dateRange: 'Aug 2021 - May 2022',
    location: 'Spain',
    status: 'Ongoing',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoZRsjUp94Yj9OHrl1WmwGpbRA_qnb8kjpKA&s',
    overview: 'La Liga 2021 showcases Spain\'s finest football clubs, with intense rivalries and exciting matches throughout the season.',
    matches: [
      { id: 1, teams: ['Barcelona', 'Real Madrid'], date: 'Oct 24, 2021', score: '2 - 1' },
      { id: 2, teams: ['Atletico Madrid', 'Sevilla'], date: 'Nov 7, 2021', score: '1 - 1' },
    ],
    teams: ['Barcelona', 'Real Madrid', 'Atletico Madrid', 'Sevilla', 'Real Sociedad', 'Villarreal'],
  },
];

const TournoisDetails = () => {
  const { name } = useLocalSearchParams();
  const tournament = tournaments.find((t) => t.name === name) || tournaments[0];

  return (
    <ScrollView className="flex-1 bg-darkBg p-4">
      {/* btn retour */}
      <View className="flex-row items-center">
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color="#fff"
          onPress={() => router.back()}
          className="mr-2"
        />
        <Text className="text-white text-xl font-bold">{tournament.name}</Text>
      </View>

      {/* Header */}
      <View className="items-center mt-5 mb-4">
        <Image
          source={{ uri: tournament.image }}
          className="w-full h-48 rounded-lg shadow-md"
          resizeMode="cover"
        />
        <Text className="text-white text-2xl font-bold mt-2">{tournament.name}</Text>
        <View className="flex-row items-center mt-1">
          <View
            className={`w-2 h-2 rounded-full mr-1 ${tournament.status === 'Ongoing'
                ? 'bg-green-500'
                : tournament.status === 'Finished'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}
          />
          <Text className="text-grayText text-sm">{tournament.status}</Text>
        </View>
      </View>

      {/* Overview */}
      <View className="mb-4">
        <Text className="text-white text-lg font-bold mb-2">Overview</Text>
        <Text className="text-grayText text-sm">{tournament.overview}</Text>
      </View>

      {/* Date and Location */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#888" className="mr-2" />
          <Text className="text-white text-sm">{tournament.dateRange}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#888" className="mr-1" />
          <Text className="text-grayText text-sm">{tournament.location}</Text>
        </View>
      </View>

      {/* Participating Teams */}
      <View className="mb-4">
        <Text className="text-white text-lg font-bold mb-2">Participating Teams</Text>
        <View className="flex-row flex-wrap">
          {tournament.teams.map((team, index) => (
            <Text key={index} className="text-white text-sm mr-2 mb-1 bg-darkCard p-1 rounded">
              {team}
            </Text>
          ))}
        </View>
      </View>

      {/* Match Schedule */}
      <View className="mb-4">
        <Text className="text-white text-lg font-bold mb-2">Match Schedule</Text>
        {tournament.matches.map((match, index) => (
          <View key={index} className="flex-row justify-between items-center mb-2 bg-darkCard p-2 rounded">
            <Text className="text-white text-sm">{match.teams.join(' vs ')}</Text>
            <Text className="text-grayText text-sm">{match.date}</Text>
            <Text className="text-white text-sm">{match.score || 'TBD'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TournoisDetails;