import { StyleSheet, Text, TextInput, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { styles } from '../../styles';
import { getAuth, updateProfile, updateEmail, onAuthStateChanged, updatePassword } from "firebase/auth";
import { collection } from 'firebase/firestore';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function handleButton({ navigation, name }) {
    navigation.navigate('Account');
    updateUser({ name })
}

const updateMail = async ({ email }) => {
    const auth = getAuth();
    updateEmail(auth.currentUser, email).then(() => {
        alert("E-mail updated!")
    }).catch((error) => {
        console.log("Error while updating e-mail")
    });

}


const generatePassword = async ({ password }) => {
    const auth = getAuth();

    const user = auth.currentUser;
    const newPassword = password;

    updatePassword(user, newPassword).then(() => {
        console.log("Your new password is: ", newPassword)
        alert("Password updated!", newPassword)
    }).catch((error) => {
        // An error ocurred
        // ...
    });
}

const updateUser = async ({ name }) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
        displayName: name
    }).then(() => {
        alert("User name will be updated!")
    }).catch((error) => {
        console.log("Error while updating user")
    })
}

const updatePhoto = async ({ source }) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
        photoURL: source
    }).then(() => {
        alert("User photo will be updated!")
    }).catch((error) => {
        console.log("Error while updating photo")
    })
}

const UpdateAccountPage = ({ navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [password, setPassword] = React.useState('');
    const [name, setName] = useState(null)
    const [source, setSource] = useState(null)
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    console.log("Email: ", email)
    console.log("Name: ", displayName)
    console.log("Verified: ", emailVerified)
    console.log("name: ", name)

    return (
        <View style={styles.container1}>
            <ScrollView style={styles.Update}>
                <Text style={styles.UpdateText}>Name</Text>
                <TextInput
                    style={styles.UpdatetextInput}
                    onChangeText={(text) => setName(text)}
                    placeholder='Enter new name'
                >
                </TextInput>
                <TouchableOpacity
                    style={styles.UpdateButton}
                    onPress={() => {
                        handleButton({ navigation, name })
                    }}
                >
                    <Text style={styles.buttonText}>Change Name</Text>
                </TouchableOpacity>
                <Text style={styles.UpdateText2}>Profile Photo</Text>
                <TextInput
                    style={styles.UpdatetextInput}
                    onChangeText={(text) => setSource(text)}
                    placeholder='Enter new photo url'
                >
                </TextInput>
                <TouchableOpacity
                    style={styles.UpdateButton}
                    onPress={() => {
                        updatePhoto({ source })
                    }}
                >
                    <Text style={styles.buttonText}>Change Photo Url</Text>
                </TouchableOpacity>
                <Text style={styles.UpdateText3}>Password</Text>
                <TextInput
                    secureTextEntry={true}
                    style={styles.UpdatetextInput}
                    placeholder='Create your password'
                    onChangeText={setPassword}
                    keyboardType='numeric'
                />
                <TouchableOpacity
                    style={styles.UpdateButton}
                    onPress={() => {
                        generatePassword({ password })
                    }}
                >
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default UpdateAccountPage