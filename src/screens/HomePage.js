import { Pressable, View, Image, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { styles } from '../../styles';
import { db } from '../../firebaseConfig';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const Stack = createNativeStackNavigator();

function NavAccount({ navigation }) {
  navigation.navigate('Account');
}

// function HomePage() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           title: 'Home',
//           headerStyle: {
//             backgroundColor: '#8df702',
//           },
//           headerTintColor: '#fff',
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//           headerRight: () => (
//             <Button
//               onPress={() => alert('Alarm!')}
//               title="Alert"
//               color="#8df702"
//             />
//           ),
//         }
//         }
//         initialParams={{ Account_id: 221, Account_name: "Emin" }}
//       />
//       </Stack.Navigator>
//       );
// }

function HomePage({ navigation }) {
  const [data, setData] = useState([])
  const [isSaved, setIsSaved] = useState(false)
  const [kind, setKind] = useState(null)
  const [race, setRace] = useState(null)
  var hour = Math.floor(Math.random() * 24)
  var min = Math.floor(Math.random() * 59)
  var Time = hour + ":" + min
  var day = Math.floor(Math.random() * 31)
  var mon = Math.floor(Math.random() * 12)
  const year = 2024
  var ADate = day + "-" + mon + "-" + year
  const dispatch = useDispatch()
  // console.log("data: ", data)
  console.log("is saved: ", isSaved)
  useEffect(() => {
    getData()
    setKind(null)
    setRace(null)
  }, [isSaved])

  //Randomly creating information
  // var index = Math.floor(Math.random() * 10)
  // var hour = Math.floor(Math.random() * 24)
  // var min = Math.floor(Math.random() * 59)
  // var Time = hour + ":" + min
  // var day = Math.floor(Math.random() * 31)
  // var mon = Math.floor(Math.random() * 12)
  // const year = 2024
  // var ADate = day + "-" + mon + "-" + year
  // var AnimalType = null
  // var AnimalRace = null
  // if (index % 2 == 0) {
  //   AnimalType = "Dog"
  //   switch (index) {
  //     case 0:
  //       AnimalRace = "Golden"
  //       break;

  //     case 2:
  //       AnimalRace = "Pitbull"
  //       break;
  //     case 4:
  //       AnimalRace = "Kangal"
  //       break;
  //     case 6:
  //       AnimalRace = "K9"
  //       break;
  //     case 8:
  //       AnimalRace = "German Wolf"
  //       break;
  //     case 10:
  //       AnimalRace = "Husky"
  //       break;

  //     default:
  //       console.log("Random creating error!")
  //       break;
  //   }
  // }
  // else {
  //   AnimalType = "Cat"
  //   switch (index) {
  //     case 1:
  //       AnimalRace = "Street"
  //       break;
  //       AnimalRace = "Siam"
  //     case 3:
  //       AnimalRace = "Iran"
  //       break;
  //     case 5:
  //       AnimalRace = "Yellow"
  //       break;
  //     case 7:
  //       AnimalRace = "White"
  //       break;
  //     case 9:
  //       AnimalRace = "Black"
  //       break;
  //     default:
  //       console.log("Random creating error!")
  //       break;
  //   }
  // }

  // Send data to firebase

  const checkValue = async () => {
    const list = ["Dog", "dog", "Cat", "cat", "Bird", "bird"]
    var i = 0
    if (kind == list[i]) {
      console.log("Animal found in list")
      sendData()
    }
    else {
      while (kind != list[i]) {
        i++;
        if (kind == list[i]) {
          console.log("Animal found in list")
          sendData()
          break;
        }
      }
      i = 0;
    }
  }

  const sendData = async () => {
    if (race !== null && kind !== null) {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          title: "Vet App",
          content: "Vet App for appointment",
          Animal: kind,
          Race: race,
          Date: Time + " " + ADate
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    else {
      alert("Invalid kind or race!")
    }
  }
  //Read data from firebase
  const getData = async () => {
    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //   // console.log(`${doc.id} => ${doc.data()}`);
    //   setData([...data, doc.data()])
    //   // setData(doc.data())
    // });
    const allData = []
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        // setData([...data ,doc.data()]) reading as array
        allData.push({ ...doc.data(), id: doc.id })
      });
      setData(allData)

    } catch (error) {
      console.log(error)
    }
  }

  //Delete data from firebase
  const delData = async (value) => {
    try {
      await deleteDoc(doc(db, "users", value));
    } catch (error) {
      console.log(error)
    }
  }
  //Logout function
  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <View style={styles.container1}>
      <Text style={styles.AppointmentText}>Appointments</Text>
      <ScrollView style={styles.Appointments}>
        {data.map((value, index) => {
          return (

            <Pressable style={{ justifyContent: 'flex-start' }}
              key={index}
              onPress={() => [delData(value.id), setIsSaved(isSaved === false ? true : false)]}
            >
              <Text style={styles.InsideCText}>{index + 1}. Appointment</Text>
              <Text style={styles.InsideText}>Reference: {value.id}</Text>
              <Text style={styles.InsideText}>Date: {value.Date}</Text>
              <Text style={styles.InsideText}>Animal: {value.Animal}</Text>
              <Text style={styles.InsideText}>Race: {value.Race}</Text>
              <Text></Text>
            </Pressable>

          )
        })}
      </ScrollView>
      <Text style={styles.AppointmentText2}>Kind</Text>
      <TextInput
        style={styles.HometextInput}
        placeholder='Enter your Animal Kind'
        onChangeText={(text) => setKind(text)}
      />
      <Text style={styles.AppointmentText2}>Race</Text>
      <TextInput
        style={styles.HometextInput}
        placeholder='Enter your Animal Race'
        onChangeText={(text) => setRace(text)}
      />
      <TouchableOpacity
        style={styles.Homebutton2}
        onPress={() => { checkValue(), setIsSaved(isSaved === false ? true : false) }}
      >
        <Text style={styles.buttonText}>Add Appointment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.Homebutton}
        onPress={() => {
          NavAccount({ navigation })
        }}
      >
        <Text style={styles.buttonText}>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.Homebutton}
        onPress={() => {
          handleLogout()
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomePage