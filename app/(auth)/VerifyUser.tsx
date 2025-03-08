import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Alert,
  Keyboard,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import FeatherIcon from '@expo/vector-icons/Feather';
import { autoSignIn, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function VerifyUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { username: usernameParam } = useLocalSearchParams();
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const onSubmit = async (data: { code: string }) => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: username,
        confirmationCode: data.code,
      });
      console.log({isSignUpComplete, nextStep})
      if (isSignUpComplete) {
        await autoSignIn();
        Alert.alert('Success!', 'Your account has been verified.');
      }
    } catch (error) {
      console.log('Error verifying code:', error);
      Alert.alert('Error', error?.toString() || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return; 

    setResendLoading(true);
    setResendDisabled(true);
    setTimeLeft(120);

    try {
      await resendSignUpCode({
        username: username,
      });
      Alert.alert('Success!', 'A new verification code has been sent to your email.');
    } catch (error) {
      console.log('Error resending code:', error);
      Alert.alert('Error', error?.toString() || 'An error occurred while resending the code.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <View style={styles.activityOverflow}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundContainer}>
          <Image
            source={require('../../asset/images/bull_2.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={styles.headerAction}
            >
              <FeatherIcon color="#FFD700" name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Verify Account</Text>
          </View>

          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Image
              source={require('../../asset/images/ffpinvest.png')}
              style={styles.headerImg}
            />

            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      clearButtonMode="while-editing"
                      placeholder="Enter your code"
                      placeholderTextColor="#6b7280"
                      style={styles.inputControl}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="code"
                  rules={{
                    required: { value: true, message: 'Verification code is required.' },
                  }}
                />
                {errors.code && (
                  <Text style={styles.inputError}>{errors.code.message}</Text>
                )}
              </View>

              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Verify</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleResendCode} disabled={resendDisabled}>
                <Text style={styles.formLink}>
                  {resendDisabled
                    ? `Resend code in ${timeLeft}s`
                    : resendLoading
                      ? 'Resending code...'
                      : 'Resend code'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 22, 9, 0.8)',
  },
  activityOverflow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 28,
    zIndex: 1,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flexGrow: 1,
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
    borderRadius: 75,
  },
  form: {
    flexGrow: 1,
  },
  formAction: {
    marginVertical: 24,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008000',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#008000',
  },
  inputError: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#FF4500',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    backgroundColor: '#008000',
    borderColor: '#008000',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
