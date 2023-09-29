import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View, Image, Button, FlatList, VirtualizedList, Alert, Dimensions, TextInput, TouchableOpacity, ImageBackground,
} from 'react-native';
import { strings } from '../../lng/LocalizedStrings';

import { ThemeColor } from '../../ThemeColor'
import { BaseUrl } from '../../BaseUrl';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


import LinearGradient from 'react-native-linear-gradient'
import DropDownPicker from 'react-native-dropdown-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomModal from '../components/CustomModal';




const Login = ({ navigation }) => {
    const [eyeStatus, setEyeStatus] = useState(true)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [spinner, setspinner] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [dynamicModalText, setDynamicModalText] = useState('')

    const handleModal = () => {
        setModalVisible(!modalVisible)
    }

    useEffect(() => {



    }, [])

    const formValidation = () => {
        if (email == '' || password == '') return false
        else return true
    }

    const checkEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    const login_details = async () => {
        setspinner(true)
        console.log("Button Pressed")
        const article = {
            email: email,
            password: password,



        }
        console.log(article)


        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        if (formValidation()) {

            if (checkEmail()) {
                try {
                    const data = await axios.post(BaseUrl.BaseUrl + 'login', article, config);
                    console.log(data.data)
                    if (data.data.status === 201) {
                        setspinner(false)
                        // Alert.alert("Credentials is incorrect")
                        setModalVisible(true)
                        setDynamicModalText("Incorrect Credentials.")
                    }
                    else if (data.data.status === 202) {
                        setspinner(false)
                        // Alert.alert("No User found")
                        setModalVisible(true)
                        setDynamicModalText("No User found")

                    }

                    else if (data.data.status === 200) {
                        AsyncStorage.setItem('token', (data.data.token));
                        AsyncStorage.setItem('userId', (data.data.userId));
                        AsyncStorage.setItem('username', (data.data.username));
                        AsyncStorage.setItem('email', (data.data.email));
                        console.log("loggged in");
                        setspinner(false)
                        navigation.navigate('TabStack')

                    }
                    else {
                        setspinner(false)
                        setModalVisible(true)
                        setDynamicModalText("Something went wrong. Please check your Internet Connection!")

                    }


                } catch (error) {
                    console.log("Error", error);
                    setspinner(false)
                    setModalVisible(true)
                    setDynamicModalText("Something went wrong. Please check your Internet Connection!")
                }


            }
            else {
                setspinner(false)
                // Alert.alert("Please provide valid email.")
                setModalVisible(true)
                setDynamicModalText("Please provide valid email.")
            }

        }
        else {
            setspinner(false)
            // Alert.alert("Please provide all the feilds.")
            setModalVisible(true)
            setDynamicModalText("Please provide all the feilds.")
        }



    }

    const changePass = async () => {
        if (!email) {
            // Alert.alert("Please enter your email to reset your password")
            setModalVisible(true)
            setDynamicModalText("Please enter your email to reset your password.")
        }
        else {
            setspinner(true)
            const article = {
                email: email,
            }
            console.log(article)


            let config = {
                headers: {

                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }

            try {
                const data = await axios.post(BaseUrl.BaseUrl + 'forgot-password', article, config);
                console.log(data.data)
                if (data.data.status === 200) {
                    setspinner(false)
                    // Alert.alert(data.data.message)
                    setModalVisible(true)
                    setDynamicModalText(data.data.message)
                }

                else if (data.data.status === 202) {
                    setspinner(false)
                    // Alert.alert(data.data.message)
                    setModalVisible(true)
                    setDynamicModalText(data.data.message)
                }


                else {
                    setspinner(false)


                }

            }
            catch (err) {
                setspinner(false)
                console.log(err)
                // Alert.alert(err)
                setModalVisible(true)
                setDynamicModalText("Something went wrong. Please check your Internet Connection!")

            }
        }
    }

    return (
        <ScrollView  >
            {/* <StatusBar translucent backgroundColor='transparent' /> */}
            <Spinner
                visible={spinner}
                color={ThemeColor.box3}
            />
            <ImageBackground
                // source={{ uri: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?cs=srgb&dl=pexels-eberhard-grossgasteiger-1287145.jpg&fm=jpg' }}

                source={require('./assets/back.jpg')}
                style={{ resizeMode: 'cover', height: Math.round(windowHeight * 1.5) }}
            >
                <CustomModal visible={modalVisible} modalText={dynamicModalText} onClose={handleModal} />

                <TouchableOpacity
                    onPress={() => navigation.navigate('TabStack')}
                    style={{
                        marginBottom: 30,
                        marginTop: Platform.OS === 'ios' ? 50 : 10,
                        flexDirection: 'row', padding: 10, alignItems: 'center'
                    }}>
                    <FontAwesome5 name='arrow-left' size={20} color='#000'
                        style={{ marginRight: 10 }}

                    />
                    <Text style={{ fontSize: 20, color: '#000', fontWeight: '900', }}>Home</Text>


                </TouchableOpacity>
                <View style={styles.mainContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Welcome!</Text>
                        <Text style={styles.headerText2}>{strings.loginText}</Text>

                    </View>


                    <View style={styles.formContainer}>


                        <View style={{ marginBottom: 25 }}>
                            {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                            <TextInput
                                style={styles.inputBox}
                                placeholder={strings.provideEmail}
                                keyboardType='email-address'
                                autoCapitalize="none"
                                onChangeText={(value) => setEmail(value)}
                            />

                        </View>


                        <View style={styles.passwordInputBox}>
                            {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                            <TextInput
                                style={{ fontSize: 17, width: '85%' }}
                                placeholder={strings.providePassword}
                                secureTextEntry={eyeStatus}
                                onChangeText={(value) => setPassword(value)}
                            />
                            <TouchableOpacity style={{ justifyContent: "center" }}>
                                <FontAwesome
                                    style={{ padding: 20 }}
                                    onPress={() => setEyeStatus(!eyeStatus)}
                                    size={20}
                                    name={eyeStatus ? 'eye-slash' : 'eye'} />

                            </TouchableOpacity>


                        </View>

                        <TouchableOpacity
                            onPress={() => changePass()}
                            style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>{strings.forgot}</Text>

                        </TouchableOpacity>










                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => login_details()}
                        >
                            <Text style={styles.boxText2}>{strings.login}</Text>
                        </TouchableOpacity>



                    </View>

                    <View style={styles.bottomText}>
                        <Text style={styles.text1}>{strings.noAccount} </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} >
                            <Text style={styles.text2}>{strings.signup}</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </ImageBackground>








        </ScrollView>

    )
}


export default Login;

const styles = StyleSheet.create({


    mainContainer: {
        padding: 20
    },
    formContainer: {
        borderRadius: 30,
        paddingVertical: 40,
        paddingHorizontal: 25,

        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.3,
        shadowRadius: 2.5,
        elevation: 5,




    },
    inputBox: {
        backgroundColor: '#fff',
        borderWidth: Platform.OS === 'android' ? 0.1 : 0.3,
        borderRadius: Platform.OS === 'android' ? 4 : 8,
        height: 60,
        fontSize: 17,
        paddingHorizontal: 10,


    },
    passwordInputBox: {
        backgroundColor: '#fff',
        borderWidth: Platform.OS === 'android' ? 0.1 : 0.3,
        borderRadius: Platform.OS === 'android' ? 4 : 8,
        height: 60,

        paddingHorizontal: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'

    },

    formTitle: {
        marginBottom: 10,
        fontWeight: '600',
        fontSize: 16,
        color: '#000'
    },
    button: {
        backgroundColor: ThemeColor.green,
        height: 50,
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'


    },
    headerText: {
        fontSize: 30,
        color: '#000',
        fontWeight: '600'
    },
    headerText2: {
        marginVertical: 10,
        fontSize: 16,
        color: '#000'
    },
    headerContainer: {
        marginVertical: 30,
        alignItems: 'center'
    },
    boxText2: {
        fontSize: 17,
        color: '#fff',
        opacity: 0.8,
        fontWeight: '900'
    },
    forgotContainer: {

    },
    forgotText: {
        color: '#3472d1',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'right'
    },
    bottomText: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
        alignItems: 'center'
    },
    text1: {
        color: '#000',
        fontSize: 16
    },
    text2: {
        color: 'blue',
        fontSize: 18,

        fontWeight: '600',
    },




})