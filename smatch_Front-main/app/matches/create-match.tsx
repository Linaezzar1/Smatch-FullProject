import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import MatchService from '@/services/MatchService';
import { Match } from '@/models/Match';
import UserService from '@/services/UserService';
import axios from 'axios';


export default function CreateMatch() {
    const router = useRouter();
    const [matchData, setMatchData] = useState<Match>({
        isPublic: true,
        team1Name: '',
        team2Name: '',
        location: '',
        terrainType: 'indoor',
        maxSets: 3,
        date: '',
        time: '',
        creator: '',
        joinRequests: [],
        sets: [],
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (field: any, value: any) => {
        setMatchData({ ...matchData, [field]: value });
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            handleInputChange('date', formattedDate);
        }
    };

    // Récupère l'ID de l'utilisateur depuis le token
    useEffect(() => {
        const fetchCreatorId = async () => {
            const userId = await UserService.getUserIdFromToken(); // Assure-toi que cette fonction retourne une Promise<string>
            setMatchData((prevData) => ({
                ...prevData,
                creator: userId,
            }));
        };

        fetchCreatorId();
    }, []);

    const handleSubmit = () => {
        // Valide et prépare les données pour l'API backend
        if (!matchData.date) {
            alert('Please select a date.');
            return;
        }
        if (!matchData.time.match(/^\d{2}:\d{2}$/)) {
            alert('Please enter time in HH:MM format.');
            return;
        }
        // Combine date + time en ISO string si besoin pour envoi
        const [hours, minutes] = matchData.time.split(':').map(Number);
        const dateWithTime = new Date(matchData.date);
        dateWithTime.setHours(hours, minutes);

        const payload = {
            ...matchData,
            date: dateWithTime.toISOString(),
        };

        console.log('Submit payload:', payload);
        MatchService.createQuickMatch(payload)
            .then((response) => {
                console.log('Match created successfully:', response.data);
                Toast.show({
                    type: 'success',
                    text1: 'Match created successfully!',
                    text2: 'You can now view your match in the matches list.',
                });
                router.push('/');
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.error("Erreur backend :", error.response?.data);
                } else {
                    console.error("Erreur inattendue :", error);
                }

            });

    };


    return (
        <ScrollView className="flex-1 bg-darkBg">
            <View className="p-4 mt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white text-xl font-bold">Create a New Match</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View className="bg-darkCard rounded-lg p-4 mb-4">
                    <View className="mb-4 flex-row items-center">
                        <TouchableOpacity
                            onPress={() => handleInputChange('isPublic', !matchData.isPublic)}
                            className="w-6 h-6 mr-3 rounded border-2 justify-center items-center"
                            style={{
                                borderColor: '#FFA500', // accentOrange
                                backgroundColor: matchData.isPublic ? '#FFA500' : 'transparent',
                            }}
                        >
                            {matchData.isPublic && (
                                <Ionicons name="checkmark" size={14} color="#000" />
                            )}
                        </TouchableOpacity>

                        <Text className="text-white text-base font-medium">Match public</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-white text-sm font-bold mb-2">Team 1</Text>
                        <TextInput
                            className="bg-gray-800 text-white p-3 rounded-lg"
                            placeholder="Enter Team 1 Name"
                            placeholderTextColor="#888"
                            value={matchData.team1Name}
                            onChangeText={(text) => handleInputChange('team1Name', text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-white text-sm font-bold mb-2">Team 2</Text>
                        <TextInput
                            className="bg-gray-800 text-white p-3 rounded-lg"
                            placeholder="Enter Team 2 Name"
                            placeholderTextColor="#888"
                            value={matchData.team2Name}
                            onChangeText={(text) => handleInputChange('team2Name', text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-white text-sm font-bold mb-2">Location</Text>
                        <TextInput
                            className="bg-gray-800 text-white p-3 rounded-lg"
                            placeholder="Enter Location"
                            placeholderTextColor="#888"
                            value={matchData.location}
                            onChangeText={(text) => handleInputChange('location', text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-white text-sm font-bold mb-2">Terrain Type</Text>
                        <View className="flex-row space-x-6">
                            {['indoor', 'beach'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => handleInputChange('terrainType', type)}
                                    className="flex-row items-center p-3"
                                    accessibilityLabel={`Select ${type} terrain`}
                                    accessibilityRole="radio"
                                >
                                    <View className={`w-5 h-5 rounded-full mr-2 border-2 ${matchData.terrainType === type ? 'border-accentOrange bg-accentOrange' : 'border-white'}`} />

                                    <Text className="text-white text-base capitalize">{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-white text-sm font-bold mb-2">Max Sets</Text>
                        <View className="flex-row space-x-6">
                            {[3, 5].map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    onPress={() => handleInputChange('maxSets', num)}
                                    className="flex-row items-center p-3"
                                    accessibilityLabel={`Set max sets to ${num}`}
                                    accessibilityRole="radio"
                                >
                                    <View className={`w-5 h-5 rounded-full mr-2 border-2 ${matchData.maxSets === num ? 'border-accentOrange bg-accentOrange' : 'border-white'}`} />
                                    <Text className="text-white text-base">{num} sets</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-white text-sm font-bold mb-2">Date</Text>
                        <TouchableOpacity
                            className="bg-gray-800 text-white p-3 rounded-lg flex-row justify-between items-center"
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text className={matchData.date ? 'text-white' : 'text-gray-500'}>
                                {matchData.date || 'Select Date'}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={matchData.date ? new Date(matchData.date) : new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-white text-sm font-bold mb-2">Time</Text>
                        <TextInput
                            className="bg-gray-800 text-white p-3 rounded-lg"
                            placeholder="HH:MM"
                            placeholderTextColor="#888"
                            value={matchData.time}
                            onChangeText={(text) => handleInputChange('time', text)}
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className="bg-accentOrange rounded-lg py-3 px-4 flex-row items-center justify-center"
                    onPress={handleSubmit}
                >
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text className="text-white text-sm font-bold ml-2">Create Match</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Add any additional styles if needed that Tailwind can't handle
});