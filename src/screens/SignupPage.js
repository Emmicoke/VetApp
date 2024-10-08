import { Image, TextInput, Text, View, TouchableOpacity, SafeAreaView, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { styles } from '../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { register, googleSign } from '../redux/userSlice';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// function handlePress({ navigation, email, password }) {
//   navigation.navigate('Login');
//   alert(email, " ", password);
// }

const SignupPage = ({ navigation }) => {
  const [google, setGoogle] = useState(null)
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userEmail, setuserEmail] = useState(null)
  const [userName, setuserName] = useState(null)
  const [verified, setVerified] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const newEmail = user.email
          const newName = user.displayName
          const verification = user.emailVerified
          setVerified(verification);
          setuserEmail(newEmail);
          setuserName(newName);
          console.log("Is verified", verification)
          console.log("New email", newEmail)
          console.log("New name", newName)
        }
        else {
          console.log("No user found");
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchUserInfo();
  }, [google]);

  //Google sign in
  GoogleSignin.configure({
    webClientId: '152348275870-1sdgpmqcor8mf5lnfc0h30u6l92s9dql.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
  });

  const signIn = async () => {
    const auth = getAuth()

    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredentials = GoogleAuthProvider.credential(idToken)
      setGoogle(googleCredentials)
      await signInWithCredential(auth, googleCredentials)
      if (googleCredentials) {
        console.log("Token accessed")
      }
      dispatch(googleSign())

    } catch (error) {
      console.log("google signin error", error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };


  //const {} = useSelector(state=>state.user)

  //Register function
  const handleRegister = () => {
    dispatch(register({ email, password }))
  }

  return (
    <SafeAreaView style={styles.container1}>
      <ScrollView style={styles.Login}>
        <Image source={require('../../assets/animals.png')} style={styles.Homeimage} />
        <Text style={styles.Logtext}>E-mail</Text>
        <TextInput
          style={styles.textInput}
          placeholder='Enter your E-mail'
          onChangeText={setEmail}
        />
        <Text style={styles.Logtext2}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder='Create your password'
          onChangeText={setPassword}
          keyboardType='numeric'
        />
        <TouchableOpacity
          style={styles.Logbutton}
          onPress={() => {
            handleRegister();
          }}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Logbutton}
          onPress={() => {
            signIn();
          }}
        >
          <Image source={require('../../assets/search.png')} style={styles.Google} />
        </TouchableOpacity>
        <View>
          <Text>Already have account?
            <Pressable
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.Signtext}> Login in</Text>
            </Pressable>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignupPage