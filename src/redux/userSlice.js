import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import app from '../../firebaseConfig';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';


export const login = createAsyncThunk('user/login', async ({ email, password }) => {
    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        const token = user.stsTokenManager.accessToken;
        const userData = {
            token,
            user: user,
        }

        await AsyncStorage.setItem("userToken", token)

        return userData
    } catch (error) {
        console.log("Login error!", error)
        throw error
    }
})

//Google Signin
export const googleSign = createAsyncThunk('user/googleSign', async () => {
    try {
        const auth = getAuth();
        await GoogleSignin.hasPlayServices();
        const { idToken } = await GoogleSignin.signIn();
        const googleCredentials = GoogleAuthProvider.credential(idToken)
        await signInWithCredential(auth, googleCredentials)

    } catch (error) {
        console.log("Google signin error!", error)
        throw error
    }
})

export const autoLogin = createAsyncThunk('user/autoLogin', async () => {
    try {
        const token = await AsyncStorage.getItem("userToken")
        if (token) {
            console.log("Auto logging...")
        }
        if (token) {
            return token
        }
        else {
            throw new Error("User not found!")
        }

    } catch (error) {
        throw error
    }
})

//User register operation
export const register = createAsyncThunk('user/register', async ({ email, password }) => {
    try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        const token = user.stsTokenManager.accessToken;

        await sendEmailVerification(user)

        await AsyncStorage.setItem("userToken", token)
        return token;

    } catch (error) {
        throw error
    }
})

//Reset password operation
export const resetPassword = createAsyncThunk('user/resetPassword', async (email) => {
    try {
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset request sent to email!")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Reset password error code: ", errorMessage, errorCode)
                // ..
            });

    } catch (error) {
        throw error
    }
})

//Google sign in
// GoogleSignin.configure({
//     webClientId: '152348275870-1sdgpmqcor8mf5lnfc0h30u6l92s9dql.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
// });

// export const signIn = createAsyncThunk('user/signIn', async () => {
//     const auth = getAuth()

//     try {
//         await GoogleSignin.hasPlayServices();
//         console.log("Here 1")
//         const { idtoken } = await GoogleSignin.signIn();
//         console.log("Here 2")
//         const googleCredentials = GoogleAuthProvider.credential(idtoken)
//         console.log("Here 3")
//         // const user = idtoken.user
//         // const token = user.stsTokenManager.accessToken;
//         await signInWithCredential(auth, googleCredentials)
//         // await AsyncStorage.setItem("userToken", token)
//         // return token;

//         // console.log("google token: ", token)

//     } catch (error) {
//         console.log("google signin error", error.message)
//         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//             // user cancelled the login flow
//             console.log("Sign in cancelled!")
//         } else if (error.code === statusCodes.IN_PROGRESS) {
//             // operation (e.g. sign in) is in progress already
//             console.log("Sign in progress already!")
//         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//             // play services not available or outdated
//             console.log("sign in cancelled!")
//         } else {
//             // some other error happened
//             console.log("Unkown error!")
//         }
//     }
// });

//User logout operation

export const logout = createAsyncThunk('user/logout', async () => {
    try {
        const auth = getAuth()
        await signOut(auth)
        await AsyncStorage.removeItem("userToken")
        return null

    } catch (error) {
        throw error
    }
})

const initialState = {
    email: null,
    password: null,
    isAuth: false,
    users: {
        userEmail: "",
        userPassword: ""
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setPassword: (state, action) => {
            state.password = action.payload
        },
        // setLogin: (state) =>{
        //     if((state.email == state.users.userEmail) && (state.password == state.users.userPassword)){
        //         console.log(true)
        //         state.isAuth = true
        //     }
        //     else{
        //         console.log(false)
        //     }
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isAuth = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuth = true;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isAuth = false;
                state.error = action.error.message;
            })
            .addCase(autoLogin.pending, (state) => {
                state.isAuth = false;
            })
            .addCase(autoLogin.fulfilled, (state, action) => {
                state.isAuth = true;
                state.token = action.payload;
            })
            .addCase(autoLogin.rejected, (state, action) => {
                state.isAuth = false;
                state.token = null;
            })
            .addCase(logout.pending, (state) => { })
            .addCase(logout.fulfilled, (state) => {
                state.isAuth = false;
                state.token = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.isAuth = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isAuth = true;
                state.token = action.payload;
            })
            .addCase(register.rejected, (state) => {
                state.error = "Invalid email or password";
                state.isAuth = false;
            })
            .addCase(googleSign.pending, (state) => {
                state.isAuth = false;
            })
            .addCase(googleSign.fulfilled, (state) => {
                state.isAuth = true;
            })
            .addCase(googleSign.rejected, (state) => {
                state.isAuth = false;
            })
    }
})

export const { setEmail, setPassword } = userSlice.actions
export default userSlice.reducer;