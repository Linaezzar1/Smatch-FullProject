import React from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { useRouter } from 'expo-router'; // Import useRouter for navigation

// Sample data
const news = [
  {
    id: '1',
    sport: 'Volleyball',
    title: 'SMATCH Team Wins Regional Championship',
    image: require('../../assets/images/haikyuu-image.png'),
    timestamp: 'Today, 10:00 AM',
  },
  {
    id: '2',
    sport: 'Volleyball',
    title: 'New Volleyball League Announced',
    image: require('../../assets/images/haikyuu-image.png'),
    timestamp: 'Yesterday, 03:15 PM',
  },
];

const matches = [
  {
    league: 'Volleyball Super League',
    country: 'Brazil',
    flag: '🇧🇷',
    teams: [
      { name: 'Sao Paulo Spikers', logo: require('../../assets/images/smatch-logo.png') },
      { name: 'Rio Aces', logo: require('../../assets/images/smatch-logo.png') },
    ],
    score: '3 - 1',
    status: 'FT',
  },
];

const tournaments = [
  {
    id: '1',
    name: 'SMATCH World Cup 2025',
    logo: require('../../assets/images/smatch-logo.png'),
    date: 'June 15, 2025',
  },
];

export default function Index() {
  const router = useRouter();
  const hasUnreadNotifications = true; // Simulate unread notifications (replace with real logic)

  return (
    <View className="flex-1 bg-darkBg">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-darkBg">
        <Image
          source={require('../../assets/images/smatch-logo.png')}
          className="w-32 h-10"
          resizeMode="contain"
        />
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Ionicons name="search-outline" size={24} color="#fff" className="mx-2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={{ position: 'relative' }}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {hasUnreadNotifications && (
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  backgroundColor: 'red',
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#fff',
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Featured News Section */}
        <View className="m-4 rounded-lg overflow-hidden bg-darkCard">
          <Image
            source={require('../../assets/images/haikyuu-image.png')}
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="p-3">
            <View className="flex-row items-center bg-accentBlue px-2 py-1 rounded-xl self-start">
              <Ionicons name="basketball-outline" size={16} color="#fff" />
              <Text className="text-white text-xs ml-1">Volleyball</Text>
            </View>
            <Text className="text-white text-base font-bold my-1">
              Liverpool UEFA Champion League Celebration
            </Text>
            <Text className="text-grayText text-xs">Yesterday, 06:30 PM</Text>
          </View>
        </View>

        {/* News Section */}
        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-lg font-bold">Latest News</Text>
            <TouchableOpacity onPress={() => router.push('/news')}>
              <Text className="text-accentOrange text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={news}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-darkCard rounded-lg overflow-hidden mr-3 w-64"
                onPress={() => router.push(`/news/${item.id}`)}
              >
                <Image
                  source={item.image}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <View className="flex-row items-center bg-accentBlue px-2 py-1 rounded-xl self-start">
                    <Ionicons name="basketball-outline" size={14} color="#fff" />
                    <Text className="text-white text-xs ml-1">{item.sport}</Text>
                  </View>
                  <Text className="text-white text-sm font-bold my-1">{item.title}</Text>
                  <Text className="text-grayText text-xs">{item.timestamp}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Matches Section */}
        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-lg font-bold">Matches</Text>
            <TouchableOpacity onPress={() => router.push('/listMatches')}>
              <Text className="text-accentOrange text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          {matches.slice(0, 1).map((match, index) => (
            <TouchableOpacity
              key={index}
              className="bg-darkCard rounded-lg p-4 flex-row justify-between items-center"
              onPress={() => router.push(`/matches/${1}`)}
            >
              <View className="flex-row items-center flex-1">
                <Image source={match.teams[0].logo} className="w-8 h-8 mr-2" resizeMode="contain" />
                <Text className="text-white text-sm font-bold">{match.teams[0].name}</Text>
              </View>
              <View className="items-center mx-2">
                <Text className="text-white text-base font-bold">{match.score}</Text>
                <Text className="text-accentOrange text-xs mt-1">{match.status}</Text>
              </View>
              <View className="flex-row items-center flex-1">
                <Image source={match.teams[1].logo} className="w-8 h-8 mr-2" resizeMode="contain" />
                <Text className="text-white text-sm font-bold">{match.teams[1].name}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {/* Create Match Button */}
          <TouchableOpacity
            className="bg-accentOrange rounded-lg py-2 px-4 mt-3 flex-row items-center justify-center"
            onPress={() => router.push('../matches/create-match')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text className="text-white text-sm font-bold ml-2">Create Match</Text>
          </TouchableOpacity>
        </View>

        {/* Tournaments Section */}
        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-lg font-bold">Tournaments</Text>
            <TouchableOpacity onPress={() => router.push('/listTournoi')}>
              <Text className="text-accentOrange text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          {tournaments.slice(0, 1).map((tournament) => (
            <TouchableOpacity
              key={tournament.id}
              className="bg-darkCard rounded-lg p-4 flex-row items-center"
              onPress={() => router.push(`/tournois/${1}`)}
            >
              <Image source={tournament.logo} className="w-12 h-12 mr-3" resizeMode="contain" />
              <View>
                <Text className="text-white text-base font-bold">{tournament.name}</Text>
                <Text className="text-grayText text-xs mt-1">{tournament.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}