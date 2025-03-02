import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface BankModalPopupProps {
  visible: boolean;
  onClose: () => void;
}

const BankModalPopup: React.FC<BankModalPopupProps> = ({ visible, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('ACH');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSave = () => {
    if (paymentMethod === 'ACH') {
      console.log('ACH - Account Number:', accountNumber);
      console.log('ACH - Routing Number:', routingNumber);
    } else {
      console.log('Debit Card - Card Number:', cardNumber);
      console.log('Debit Card - Expiration Date:', expirationDate);
      console.log('Debit Card - CVV:', cvv);
    }
    onClose();
  };

  const resetFields = () => {
    setAccountNumber('');
    setRoutingNumber('');
    setCardNumber('');
    setExpirationDate('');
    setCvv('');
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    resetFields(); // Clear fields when switching methods
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Change Banking Info</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={handlePaymentMethodChange}
              style={styles.picker}
            >
              <Picker.Item label="ACH" value="ACH" />
              <Picker.Item label="Debit Card" value="Debit Card" />
            </Picker>
          </View>

          {paymentMethod === 'ACH' ? (
            <>
              <TextInput
                placeholder="Account Number"
                value={accountNumber || ''}
                onChangeText={setAccountNumber}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Routing Number"
                value={routingNumber || ''}
                onChangeText={setRoutingNumber}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </>
          ) : (
            <>
              <TextInput
                placeholder="Card Number"
                value={cardNumber || ''}
                onChangeText={setCardNumber}
                style={styles.input}
                keyboardType="numeric"
                maxLength={16}
                placeholderTextColor="#999"
              />
              <View style={styles.cardDetailsContainer}>
                <TextInput
                  placeholder="MM/YY"
                  value={expirationDate || ''}
                  onChangeText={setExpirationDate}
                  style={[styles.input, styles.cardInput]}
                  keyboardType="numeric"
                  maxLength={5}
                  placeholderTextColor="#999"
                />
                <TextInput
                  placeholder="CVV"
                  value={cvv || ''}
                  onChangeText={setCvv}
                  style={[styles.input, styles.cardInput]}
                  keyboardType="numeric"
                  maxLength={3}
                  placeholderTextColor="#999"
                />
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSave} color="#28A745" />
            <Button title="Cancel" onPress={onClose} color="#FFC107" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black overlay with opacity
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: '#000000', // Black background
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#28A745', // Green border
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107', // Yellow text
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#28A745', // Green border
    borderRadius: 4,
    backgroundColor: '#1A1A1A', // Dark gray for picker
  },
  picker: {
    width: '100%',
    height: 55,
    color: '#FFFFFF', // White text for picker
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#28A745', // Green border
    backgroundColor: '#1A1A1A', // Dark gray background
    color: '#FFFFFF', // White text
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  cardInput: {
    width: '48%', // Split width for expiration and CVV
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default BankModalPopup;