import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const notifications = [
  {
    icon: 'flame-outline',
    message: 'New match scheduled: Barcelona vs Real Madrid',
    time: '10 min ago',
  },
  {
    icon: 'newspaper-outline',
    message: 'News update: Liverpool wins UEFA Champion League',
    time: '1 hour ago',
  },
  {
    icon: 'people-outline',
    message: 'Team update: Arsenal signed a new player',
    time: '2 hours ago',
  },
  {
    icon: 'pricetag-outline',
    message: 'Trending hashtag: #FootballFever',
    time: 'Yesterday, 08:30 PM',
  },
  {
    icon: 'flame-outline',
    message: 'Match reminder: Chelsea vs Liverpool tomorrow',
    time: 'Yesterday, 06:00 PM',
  },
];

export default function Notifications() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-darkBg">
      {/* Background Image */}
      <Image
        source={require('../assets/images/background-image.png')} // Replace with your background image
        style={styles.backgroundImage}
      />

      {/* Header with Back Button and Title */}
      <View className="flex-row items-center p-4">
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color="#fff"
          onPress={() => router.back()}
          className="mr-2"
        />
        <Text className="text-white text-xl font-bold">Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1">
        {notifications.map((notification, index) => (
          <View
            key={index}
            className="flex-row items-center p-4 border-b border-darkCard"
          >
            <Ionicons
              name={notification.icon}
              size={20}
              color="#ff6f61"
              className="mr-3"
            />
            <View className="flex-1">
              <Text className="text-white text-sm font-bold">
                {notification.message}
              </Text>
              <Text className="text-grayText text-xs mt-1">
                {notification.time}
              </Text>
            </View>
          </View>
        ))}
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