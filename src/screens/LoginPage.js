import { Pressable, View, Image, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { styles } from '../../styles';
import { useSelector, useDispatch } from 'react-redux';
import { login, autoLogin, googleSign, resetPassword } from '../redux/userSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebaseConfig';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


function NavSign({ navigation }) {
  navigation.navigate('SignUp');
}

function LoginPage({ navigation }) {
  const [google, setGoogle] = useState(null)
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userEmail, setuserEmail] = useState(null)
  const [userName, setuserName] = useState(null)
  const [verified, setVerified] = useState(false)
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
      const user = googleCredentials.user;
      const token = idToken;
      const userData = {
        token,
        user: user,
      }

      await AsyncStorage.setItem("userToken", token)
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


  //Reading data inside of userSlice
  // const { email, password } = useSelector((state) => state.user);
  //Using reducer or sending data inside userSlice
  const dispatch = useDispatch();

  //Checking for auto login
  useEffect(() => {
    dispatch(autoLogin())
  }, [])


  return (
    <SafeAreaView style={styles.container1}>
      <ScrollView style={styles.Login}>
        <View>
          <Text style={styles.Maintext}>Welcome to Vet App</Text>
          <Image source={require('../../assets/animals.png')} style={styles.Homeimage} />
          <Text style={styles.Logtext}>E-mail</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Enter your E-mail'
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={styles.Logtext2}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.textInput}
            placeholder='Enter your password'
            onChangeText={(password) => setPassword(password)}
            keyboardType='numeric'
          />
          <View>
            <Text style={{marginRight:0,}}>Forgot password?
              <Pressable
                onPress={() => {
                  dispatch(resetPassword(email))
                }}>
                <Text style={styles.Signtext}> Reset Password</Text>
              </Pressable>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.Logbutton}
            onPress={() => {
              // NavHome({ navigation })
              dispatch(login({ email, password }))
            }}
          >
            <Text style={styles.buttonText}>Enter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Logbutton}
            onPress={() => {
              NavSign({ navigation })
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Logbutton}
            onPress={() => {
              signIn()
            }}
          >
            <Image source={require('../../assets/search.png')} style={styles.Google} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LoginPage