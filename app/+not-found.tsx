import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ffpinvestImg = require('../asset/images/crying_404.jpg');

const NotFound = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFD700" />
      </TouchableOpacity>
      <Text style={styles.text}>Page Not Found 404</Text>
      <Image source={ffpinvestImg} style={{ width: 600, height: 400, marginVertical: 20 }} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'HeaderFont',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
});

export default NotFound;
