import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TermsOfService() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Terms of Service</Text>
            <Text style={styles.content}>
                {/* Terms of Service content goes here */}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
});
