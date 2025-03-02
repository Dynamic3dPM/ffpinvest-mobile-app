import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

interface AppButtonProps {
  title: string;
  onPress?: () => void; // For regular button
  modalContent?: React.ReactNode; // For modal button
  style?: object; // Optional custom styles for the button
}

const AppButton = ({ title, onPress, modalContent, style }: AppButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (modalContent) {
      setModalVisible(true); // Open modal if modalContent is provided
    } else if (onPress) {
      onPress(); // Call onPress if no modalContent
    }
    };

    return (
        <>
            <TouchableOpacity
            style={[styles.button, style]}
            onPress={handlePress}
            >
            <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
            {modalContent && (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    {modalContent}
                </View>
                </TouchableWithoutFeedback>
            </Modal>
            )}
        </>
        );
    }
    const styles = StyleSheet.create({
        button: {
            backgroundColor: '#006837',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    });
    

export default AppButton;