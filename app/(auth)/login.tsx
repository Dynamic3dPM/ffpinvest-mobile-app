import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Alert,
  Keyboard,
  SafeAreaView,
  View,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { fetchAuthSession, resendSignUpCode, signIn } from 'aws-amplify/auth';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await AsyncStorage.removeItem('userToken');
      }
    };
    checkToken();
  }, []);

  interface FormData {
    username: string;
    password: string;
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: data?.username, password: data?.password, options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });
      console.log('User signed in:', isSignedIn, nextStep);
      if (isSignedIn) {
        
        setLoading(false);
        router.replace('/(tabs)');
      } if (nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        await resendSignUpCode({
          username: data?.username,
        });
        router.replace({
          pathname: "/(auth)/VerifyUser",
          params: {
            username: data?.username
          }
        })
      }
    } catch (error) {
      setLoading(false);
      console.log('Error signing in:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Check your credentials.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://ffp-invest-mobile.s3.us-east-1.amazonaws.com/background_login.png' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {loading && (
              <View style={styles.activityOverflow}>
                <ActivityIndicator size="large" color="#FFD700" />
              </View>
            )}

            <Image
              style={styles.headerImg}
              source={{ uri: 'https://ffp-invest-mobile.s3.us-east-1.amazonaws.com/ffpinvest.png' }}
            />

            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Username</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      placeholder="Tommy Oliver"
                      placeholderTextColor="#808080"
                      style={styles.inputControl}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="username"
                  rules={{ required: { value: true, message: 'Username is required.' } }}
                />
                {errors.username && (
                  <Text style={styles.inputError}>{errors.username.message}</Text>
                )}
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        placeholder="********"
                        placeholderTextColor="#808080"
                        style={[styles.inputControl, { flex: 1 }]}
                        secureTextEntry={!passwordVisible}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name="password"
                    rules={{ required: { value: true, message: 'Password is required.' } }}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Ionicons
                      name={passwordVisible ? 'eye-off' : 'eye'}
                      size={24}
                      color="#FFD700" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.inputError}>{errors.password.message}</Text>
                )}
              </View>

              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Sign In</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.push("/(auth)/ForgotPassword")}>
                <Text style={styles.formLink}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {!keyboardVisible && (
              <TouchableOpacity onPress={() => router.push('/(auth)/SignUp')}>
                <Text style={styles.formFooter}>
                  Don't have an account?{' '}
                  <Text style={{ textDecorationLine: 'underline', color: '#FFD700' }}>Sign up</Text>
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 2, 0.8)',
  },
  activityOverflow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  headerImg: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 36,
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    resizeMode: 'contain',
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008000', // Green from your StyleSheet
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF', // White from your StyleSheet
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFD700', // Gold from your StyleSheet
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#1A1A1A', // Dark gray from your StyleSheet
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF', // White from your StyleSheet
    borderWidth: 1,
    borderColor: '#008000', // Green from your StyleSheet
    borderStyle: 'solid',
  },
  passwordContainer: {
    position: "relative",
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: 10,
    position: "absolute",
    top: 12,
    right: 10
  },
  inputError: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#FF4500', // Orange-red from your StyleSheet
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#008000', // Green from your StyleSheet
    borderColor: '#008000',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // White from your StyleSheet
  },
});