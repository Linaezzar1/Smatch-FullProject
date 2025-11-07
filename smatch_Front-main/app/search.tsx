import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const categories = ['Matches','Tournois', 'Hashtags', 'Teams'];

const matches = [
  {
    teams: [
      { name: 'Barcelona', logo: require('../assets/images/smatch-logo.png') },
      { name: 'Real Madrid', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Monday, 12 Feb 2021',
    time: '08:30 am',
  },
  {
    teams: [
      { name: 'Arsenal', logo: require('../assets/images/smatch-logo.png') },
      { name: 'Aston Villa', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Tuesday, 13 Feb 2021',
    time: '08:00 am',
  },
  {
    teams: [
      { name: 'Chelsea', logo: require('../assets/images/smatch-logo.png') },
      { name: 'Liverpool', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Saturday, 14 Mar 2021',
    time: '01:00 am',
  },
  {
    teams: [
      { name: 'Dortmund', logo: require('../assets/images/smatch-logo.png') },
      { name: 'München', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Wednesday, 8 Apr 2021',
    time: '08:30 am',
  },
  {
    teams: [
      { name: 'Real Madrid', logo: require('../assets/images/smatch-logo.png') },
      { name: 'Arsenal', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Thursday, 11 Apr 2021',
    time: '00:45 am',
  },
  {
    teams: [
      { name: 'Tottenham', logo: require('../assets/images/smatch-logo.png') },
      { name: 'Watford', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Friday, 21 Apr 2021',
    time: '00:45 am',
  },
  {
    teams: [
      { name: 'Swansea City', logo: require('../assets/images/smatch-logo.png') },
      { name: 'Fulham', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Sunday, 23 May 2021',
    time: '08:45 am',
  },
  {
    teams: [
      { name: 'Wolfsburg', logo: require('../assets/images/smatch-logo.png') },
      { name: 'Liverpool', logo: require('../assets/images/smatch-logo.png') },
    ],
    date: 'Wednesday, 15 May 2021',
    time: '01:00 am',
  },
];

const News = [
  { title: 'Messi signs new contract', date: '01 Apr 2025' },
  { title: 'Champions League draw results', date: '02 Apr 2025' },
];

const Hashtags = ['#UCL', '#Barca', '#ElClasico', '#FootballNews'];

const Teams = [
  { name: 'Barcelona', logo: require('../assets/images/smatch-logo.png') },
  { name: 'Real Madrid', logo: require('../assets/images/smatch-logo.png') },
];


export default function Search() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Matches');

  return (

    <View className="flex-1 bg-darkBg">
      {/* Background Image */}
      <Image
        source={require('../assets/images/background-image.png')} // Replace with your background image
        style={styles.backgroundImage}
      />

      {/* Header with Back Button and Search Bar */}
      <View className="flex-row items-center p-4">
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color="#fff"
          onPress={() => router.back()}
          className="mr-2"
        />
        <View className="flex-1 bg-darkCard rounded-lg p-2">
          <TextInput
            placeholder="Recherchez un ..."
            placeholderTextColor="#888"
            className="text-white text-base"
          />
        </View>
      </View>




      {/* Content Based on Selected Category */}
      <ScrollView className="flex-1">

        {/* Category Selector */}
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <View
              className={`bg-accentOrange rounded-xl py-2 px-4 mr-2 flex-row items-center ${selectedCategory === item ? 'bg-accentOrange' : 'bg-darkCard'
                }`}
              onStartShouldSetResponder={() => {
                setSelectedCategory(item);
                return true;
              }}
            >
              {item === 'Matches' && <Ionicons name="flame-outline" size={20} color="#fff" className="mr-1" />}
              {item ==='Tournois' && <Ionicons name="newspaper-outline" size={20} color="#fff" className="mr-1" />}
              {item === 'Hashtags' && <Ionicons name="pricetag-outline" size={20} color="#fff" className="mr-1" />}
              {item === 'Teams' && <Ionicons name="people-outline" size={20} color="#fff" className="mr-1" />}
              <Text className="text-white text-sm font-bold">{item}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          className="mx-4 mb-4"
        />


        {/* search Section */}
        {selectedCategory === 'Matches' && (
          matches.length > 0 ? matches.map((match, index) => (
            <View key={index} className="flex-row justify-between items-center p-4 border-b border-darkCard">
              <View className="flex-row items-center">
                <Image source={match.teams[0].logo} className="w-8 h-8 mr-2" resizeMode="contain" />
                <Text className="text-white text-sm font-bold mr-1">{match.teams[0].name}</Text>
                <Text className="text-grayText text-sm">VS</Text>
                <Text className="text-white text-sm font-bold mx-1">{match.teams[1].name}</Text>
                <Image source={match.teams[1].logo} className="w-8 h-8" resizeMode="contain" />
              </View>
              <View className="items-end">
                <Text className="text-white text-xs">{match.date}</Text>
                <Text className="text-grayText text-xs">{match.time}</Text>
              </View>
            </View>
          )) : (
            <Text className="text-white text-center mt-4">No matches available.</Text>
          )
        )}

        {selectedCategory ==='Tournois' && (
          News.length > 0 ? News.map((news, index) => (
            <View key={index} className="p-4 border-b border-darkCard">
              <Text className="text-white font-bold">{news.title}</Text>
              <Text className="text-grayText text-sm">{news.date}</Text>
            </View>
          )) : (
            <Text className="text-white text-center mt-4">No news available.</Text>
          )
        )}

        {selectedCategory === 'Hashtags' && (
          Hashtags.length > 0 ? Hashtags.map((tag, index) => (
            <Text key={index} className="text-accentOrange font-bold px-4 py-2">#{tag}</Text>
          )) : (
            <Text className="text-white text-center mt-4">No hashtags available.</Text>
          )
        )}

        {selectedCategory === 'Teams' && (
          Teams.length > 0 ? Teams.map((team, index) => (
            <View key={index} className="flex-row items-center p-4 border-b border-darkCard">
              <Image source={team.logo} className="w-8 h-8 mr-2" resizeMode="contain" />
              <Text className="text-white font-bold">{team.name}</Text>
            </View>
          )) : (
            <Text className="text-white text-center mt-4">No teams available.</Text>
          )
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.1, // Dim the background for better contrast
  },
});