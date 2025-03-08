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
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [email, setEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    let timer: any;

    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const onSubmitEmail = async (data: { email: string }) => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      await resetPassword({ username: data.email });
      Alert.alert('Success!', 'A password reset code has been sent to your email.');
      setIsCodeSent(true);
      setEmail(data.email);
      setResendDisabled(true);
      setTimeLeft(120);
    } catch (error) {
      console.log('Error sending reset code:', error);
      Alert.alert('Error', error?.toString() || 'An error occurred while requesting the password reset.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitResetPassword = async (data: { code: string; newPassword: string; confirmPassword: string }) => {
    setLoading(true);
    Keyboard.dismiss();

    if (data.newPassword !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });
      Alert.alert('Success!', 'Your password has been successfully reset.');
      router.replace('/login');
    } catch (error) {
      console.log('Error resetting password:', error);
      Alert.alert('Error', error?.toString() || 'An error occurred while resetting the password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;

    setResendLoading(true);
    setResendDisabled(true);
    setTimeLeft(120); // 2-minute cooldown for resend

    try {
      await resetPassword({ username: email }); // Use the stored email address
      Alert.alert('Success!', 'A new password reset code has been sent to your email.');
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
            <Text style={styles.title}>Forgot Password</Text>
          </View>

          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Image
              source={require('../../asset/images/ffpinvest.png')}
              style={styles.headerImg}
            />

            <View style={styles.form}>
              {!isCodeSent ? (
                <>
                  <View style={styles.input}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          clearButtonMode="while-editing"
                          placeholder="Enter your email"
                          placeholderTextColor="#6b7280"
                          style={styles.inputControl}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                      name="email"
                      rules={{
                        required: { value: true, message: 'Email is required.' },
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Please enter a valid email address.',
                        },
                      }}
                    />
                    {errors.email && (
                      <Text style={styles.inputError}>{errors.email.message}</Text>
                    )}
                  </View>

                  <View style={styles.formAction}>
                    <TouchableOpacity onPress={handleSubmit(onSubmitEmail)}>
                      <View style={styles.btn}>
                        <Text style={styles.btnText}>Submit</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.emailText}>Code sent to: {email}</Text>

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

                  <View style={styles.input}>
                    <Text style={styles.inputLabel}>New Password</Text>
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
                        name="newPassword"
                        rules={{ required: { value: true, message: 'New password is required.' } }}
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

                    {errors.newPassword && (
                      <Text style={styles.inputError}>{errors.newPassword.message}</Text>
                    )}
                  </View>

                  <View style={styles.input}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
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
                            secureTextEntry={!confirmPasswordVisible}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                          />
                        )}
                        name="confirmPassword"
                        rules={{
                          required: { value: true, message: 'Please confirm your new password.' },
                        }}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      >
                        <Ionicons
                          name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                          size={24}
                          color="#FFD700"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                      <Text style={styles.inputError}>{errors.confirmPassword.message}</Text>
                    )}
                  </View>

                  <View style={styles.formAction}>
                    <TouchableOpacity onPress={handleSubmit(onSubmitResetPassword)}>
                      <View style={styles.btn}>
                        <Text style={styles.btnText}>Reset Password</Text>
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
                </>
              )}
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
  emailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 16,
  },
});