import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Alert,
//   Keyboard,
//   View,
//   ActivityIndicator,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   Image,
//   ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useForm, Controller } from 'react-hook-form';
// import FeatherIcon from '@expo/vector-icons/Feather';

// const signUpMutation = `
//   mutation SignUp($input: SignUpInput!) {
//     signUp(input: $input) {
//       userId
//       email
//     }
//   }
// `;

// export default function Example() {
//   const [loading, setLoading] = useState(false);
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//   } = useForm({
//     mode: 'onBlur',
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const onSubmit = async (data) => {
//     setLoading(true);
//     Keyboard.dismiss();

//     if (data.password !== data.confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Simulate API call (replace with your GraphQL mutation logic)
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       console.log('Signup successful:', data);

//       reset();
//       Alert.alert(
//         'Success!',
//         'New account created! (Debug Message)',
//       );
//     } catch (err) {
//       Alert.alert('Error', err.message || 'An error occurred during signup');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {loading && (
//         <View style={styles.activityOverflow}>
//           <ActivityIndicator size="large" color="#fff" />
//         </View>
//       )}

//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.backgroundContainer}>
//           <Image
//             source={require('../assets/images/bull_2.png')} // Adjust path as needed
//             style={styles.backgroundImage}
//             resizeMode="cover"
//           />
//           <View style={styles.overlay} />

//           <View style={styles.header}>
//             <TouchableOpacity
//               onPress={() => {
//                 // Handle back navigation if needed
//               }}
//               style={styles.headerAction}
//             >
//               <FeatherIcon color="#FFD700" name="arrow-left" size={24} />
//             </TouchableOpacity>
//             <Text style={styles.title}>Create Account</Text>
//           </View>

//           <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//             <Image
//               source={require('../assets/images/ffpinvest.png')} // Adjust path as needed
//               style={styles.headerImg}
//             />

//             <View style={styles.form}>
//               <View style={styles.input}>
//                 <Text style={styles.inputLabel}>First Name</Text>
//                 <Controller
//                   control={control}
//                   render={({ field: { onChange, onBlur, value } }) => (
//                     <TextInput
//                       clearButtonMode="while-editing"
//                       placeholder="e.g. John"
//                       placeholderTextColor="#6b7280"
//                       style={styles.inputControl}
//                       onBlur={onBlur}
//                       onChangeText={onChange}
//                       value={value}
//                     />
//                   )}
//                   name="firstName"
//                   rules={{
//                     required: { value: true, message: 'First name is required.' },
//                   }}
//                 />
//                 {errors.firstName && (
//                   <Text style={styles.inputError}>{errors.firstName.message}</Text>
//                 )}
//               </View>

//               <View style={styles.input}>
//                 <Text style={styles.inputLabel}>Last Name</Text>
//                 <Controller
//                   control={control}
//                   render={({ field: { onChange, onBlur, value } }) => (
//                     <TextInput
//                       clearButtonMode="while-editing"
//                       placeholder="e.g. Doe"
//                       placeholderTextColor="#6b7280"
//                       style={styles.inputControl}
//                       onBlur={onBlur}
//                       onChangeText={onChange}
//                       value={value}
//                     />
//                   )}
//                   name="lastName"
//                   rules={{
//                     required: { value: true, message: 'Last name is required.' },
//                   }}
//                 />
//                 {errors.lastName && (
//                   <Text style={styles.inputError}>{errors.lastName.message}</Text>
//                 )}
//               </View>

//               <View style={styles.input}>
//                 <Text style={styles.inputLabel}>Email address</Text>
//                 <Controller
//                   control={control}
//                   render={({ field: { onChange, onBlur, value } }) => (
//                     <TextInput
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       clearButtonMode="while-editing"
//                       keyboardType="email-address"
//                       placeholder="e.g. john@example.com"
//                       placeholderTextColor="#6b7280"
//                       style={styles.inputControl}
//                       onBlur={onBlur}
//                       onChangeText={onChange}
//                       value={value}
//                     />
//                   )}
//                   name="email"
//                   rules={{
//                     required: { value: true, message: 'Email address is required.' },
//                     pattern: {
//                       value: /\S+@\S+\.\S+/,
//                       message: 'Please enter a valid email address.',
//                     },
//                   }}
//                 />
//                 {errors.email && (
//                   <Text style={styles.inputError}>{errors.email.message}</Text>
//                 )}
//               </View>

//               <View style={styles.input}>
//                 <Text style={styles.inputLabel}>Password</Text>
//                 <Controller
//                   control={control}
//                   render={({ field: { onChange, onBlur, value } }) => (
//                     <TextInput
//                       autoCorrect={false}
//                       clearButtonMode="while-editing"
//                       placeholder="********"
//                       placeholderTextColor="#6b7280"
//                       style={styles.inputControl}
//                       secureTextEntry={true}
//                       onBlur={onBlur}
//                       onChangeText={onChange}
//                       value={value}
//                     />
//                   )}
//                   name="password"
//                   rules={{
//                     required: { value: true, message: 'Password is required.' },
//                     minLength: {
//                       value: 6,
//                       message: 'Password must be at least 6 characters.',
//                     },
//                   }}
//                 />
//                 {errors.password && (
//                   <Text style={styles.inputError}>{errors.password.message}</Text>
//                 )}
//               </View>

//               <View style={styles.input}>
//                 <Text style={styles.inputLabel}>Confirm Password</Text>
//                 <Controller
//                   control={control}
//                   render={({ field: { onChange, onBlur, value } }) => (
//                     <TextInput
//                       autoCorrect={false}
//                       clearButtonMode="while-editing"
//                       placeholder="********"
//                       placeholderTextColor="#6b7280"
//                       style={styles.inputControl}
//                       secureTextEntry={true}
//                       onBlur={onBlur}
//                       onChangeText={onChange}
//                       value={value}
//                     />
//                   )}
//                   name="confirmPassword"
//                   rules={{
//                     required: { value: true, message: 'Please confirm your password.' },
//                   }}
//                 />
//                 {errors.confirmPassword && (
//                   <Text style={styles.inputError}>{errors.confirmPassword.message}</Text>
//                 )}
//               </View>

//               <View style={styles.formAction}>
//                 <TouchableOpacity onPress={handleSubmit(onSubmit)}>
//                   <View style={styles.btn}>
//                     <Text style={styles.btnText}>Sign up</Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>

//               <Text style={styles.formFooter}>
//                 By clicking "Sign up", you agree to our
//                 <Text style={{ color: '#FFD700', fontWeight: '600' }}>
//                   {' '}
//                   Terms & Conditions{' '}
//                 </Text>
//                 and
//                 <Text style={{ color: '#FFD700', fontWeight: '600' }}>
//                   {' '}
//                   Privacy Policy
//                 </Text>
//                 .
//               </Text>
//             </View>
//           </ScrollView>
//         </View>
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   backgroundContainer: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   backgroundImage: {
//     ...StyleSheet.absoluteFillObject,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(1, 22, 9, 0.8)', // Semi-transparent overlay
//   },
//   activityOverflow: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     right: 0,
//     left: 0,
//     zIndex: 9999,
//     backgroundColor: 'rgba(0, 0, 0, 0.35)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 60,
//   },
//   header: {
//     paddingHorizontal: 24,
//     marginBottom: 28,
//     zIndex: 1, // Ensure header stays above background
//   },
//   headerAction: {
//     width: 40,
//     height: 40,
//     borderRadius: 9999,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1A1A1A',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: 'bold',
//     color: '#FFD700',
//     marginBottom: 12,
//   },
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//   },
//   contentContainer: {
//     flexGrow: 1,
//   },
//   headerImg: {
//     width: 150,
//     height: 150,
//     alignSelf: 'center',
//     marginTop: 36,
//     marginBottom: 36,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     resizeMode: 'contain',
//     borderRadius: 75,
//   },
//   form: {
//     flexGrow: 1,
//   },
//   formAction: {
//     marginVertical: 24,
//   },
//   formFooter: {
//     marginTop: 'auto',
//     marginBottom: 24,
//     fontSize: 15,
//     lineHeight: 20,
//     fontWeight: '400',
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   input: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#FFD700',
//     marginBottom: 6,
//   },
//   inputControl: {
//     height: 44,
//     backgroundColor: '#1A1A1A',
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#008000',
//   },
//   inputError: {
//     marginTop: 4,
//     fontSize: 14,
//     lineHeight: 20,
//     fontWeight: '500',
//     color: '#FF4500',
//   },
//   btn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderWidth: 1,
//     backgroundColor: '#008000',
//     borderColor: '#008000',
//   },
//   btnText: {
//     fontSize: 17,
//     lineHeight: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
// });


export default function SignUp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign Up Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});