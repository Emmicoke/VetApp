import { Text, View, TouchableOpacity, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { styles } from '../../styles';
import { useDispatch } from 'react-redux';
import { getAuth, updateProfile, updateEmail, onAuthStateChanged, deleteUser, reauthenticateWithCredential } from "firebase/auth";
import { collection } from 'firebase/firestore';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { logout, autoLogin } from '../redux/userSlice';

function NavUpdate({ navigation }) {
  navigation.navigate('Update Account');
}


const AccountPage = ({ navigation }) => {

  useEffect(() => {
    getData()
  }, [isFocused])

  const isFocused = useIsFocused();
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [source, setSource] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  var isName = false
  var isSource = false

  const dispatch = useDispatch()

  const handleDelAccount = () => {
    delUser()
    dispatch(logout())
  }

  const delUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    deleteUser(user).then(() => {
      console.log("User deleted")
      alert("Account deleted!")
    }).catch((error) => {
      console.log("Error while deleting user")
    });
  }


  const getData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    setName(displayName)
    setEmail(email)
    setIsVerified(emailVerified)
    setSource(photoURL)
    console.log("Email: ", email)
    console.log("Name: ", displayName)
    console.log("Verified: ", emailVerified)
    const uid = user.uid;
  }

  const reAuth = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // TODO(you): prompt the user to re-provide their sign-in credentials
    const credential = dispatch(autoLogin());

    reauthenticateWithCredential(user, credential).then(() => {
      console.log("Reauthentication")
    }).catch((error) => {
      console.log("Error!")
    }); // <Image source={{uri: source}} style={styles.Accountimage}/>
  }


  if (name !== null) isName = true
  if (source !== null) isSource = true
  console.log(isName)
  console.log(isSource)

  return (
    <View style={styles.container2}>
      {
        isSource ? <Image source={{ uri: source }} style={styles.Accountimage} /> : <Image source={require('../../assets/user.png')} style={styles.Accountimage} />
      }
       {
          isName ? <Text style={styles.AccountTitleText}> {name}</Text>
            : <Text style={styles.AccountTitleText}> Unkown</Text>
        }
      <View style={styles.container4}>
        {
          isName ? <Text style={styles.AccountText}> Name: <Text style={{ color: 'black' }}>{name}</Text></Text>
            : <Text style={styles.AccountText}> Name: <Text style={{ color: 'black' }}>Unkown</Text></Text>
        }
        <Text style={styles.AccountText}> E-mail adress: <Text style={{ color: 'black', fontSize:16 }}>{email}</Text></Text>
        {
          isVerified ? <Text style={styles.AccountText}> E-mail is
            <Text style={[{ color: 'green' }]}> Verified</Text></Text>
            : <Text style={styles.AccountText}> E-mail is <Text style={[{ color: 'red' }]}>Not Verified</Text></Text>
        }
      </View>
      <View style={styles.container1}>
        <TouchableOpacity
          style={styles.Accountbutton}
          onPress={() => {
            NavUpdate({ navigation })
          }}
        >
          <Text style={styles.buttonText}>Change Information</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Accountbutton}
          onPress={() => {
            dispatch(logout())
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Accountbutton}
          onPress={() => {
            handleDelAccount()
          }}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AccountPage