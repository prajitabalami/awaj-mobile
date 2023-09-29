import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View, Image, Button, FlatList, VirtualizedList, Alert, Dimensions, TextInput,
    TouchableOpacity, Platform
} from 'react-native';


import { ThemeColor } from '../../ThemeColor'
import { BaseUrl } from '../../BaseUrl';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomModal from '../components/CustomModal';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


import LinearGradient from 'react-native-linear-gradient'
import DropDownPicker from 'react-native-dropdown-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { strings } from '../../lng/LocalizedStrings';


const SignUp = ({ navigation }) => {
    const [eyeStatus, setEyeStatus] = useState(true)
    const [eyeStatusConfirm, setEyeStatusConfirm] = useState(true)

    const [fullname, setfullname] = useState('')
    const [phonenumber, setphonenumber] = useState('')
    const [email, setemail] = useState('')
    const [address, setaddress] = useState('')
    const [password, setpassword] = useState('')
    const [cpassword, setcpassword] = useState('')
    const [spinner, setspinner] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [dynamicModalText, setDynamicModalText] = useState('')

    const handleModal = () => {
        setModalVisible(!modalVisible)
    }


    useEffect(() => {

    }, [])

    const formValidation = () => {
        if (fullname == '' || phonenumber == '' || address == '' || email == '' || password == '' || cpassword == '') return false
        else return true
    }

    const checkConfirmPassword = () => {
        if (password === cpassword) return true
        else return false
    }

    const checkEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    const signup_details = async () => {
        const article = {
            fullname: fullname,
            address: address,
            phonenumber: phonenumber,
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

        console.log("Check valida", formValidation())

        if (formValidation()) {

            if (checkEmail()) {
                if (checkConfirmPassword()) {
                    try {
                        const data = await axios.post(BaseUrl.BaseUrl + 'signup', article, config);
                        console.log(data.data);

                        if (data.status === 200) {
                            console.log("created");
                            setspinner(false)
                            navigation.navigate('Login')
                        }
                        if (data.status === 201) {
                            setspinner(false)
                            console.log(data.data)
                            // Alert.alert("User already exists")
                            setModalVisible(true)
                            setDynamicModalText("User already exists")
                        }




                    } catch (error) {
                        console.log("Error", error);
                        setspinner(false)
                    }


                }
                else {
                    setspinner(false)
                    // Alert.alert("The passwords do not match.")
                    setModalVisible(true)
                    setDynamicModalText("The passwords do not match.")
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
    return (
        <ScrollView style={{ backgroundColor: '#efeff0', }} >
            <StatusBar backgroundColor='#efeff0' />
            <Spinner
                visible={spinner}
            />
            <CustomModal visible={modalVisible} modalText={dynamicModalText} onClose={handleModal} />

            <TouchableOpacity style={{
                marginBottom: 30,
                marginTop: Platform.OS === 'ios' ? 50 : 10,
                flexDirection: 'row', padding: 10, alignItems: 'center'

            }}
                onPress={() => navigation.navigate('Login')}
            >

                <FontAwesome5 name='arrow-left' size={20} color='#000'
                    style={{ marginRight: 10 }}

                />
                <Text style={{ fontSize: 20, color: '#000', fontWeight: '900', }}>Login</Text>




            </TouchableOpacity>


            <View style={styles.mainContainer}>

                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Welcome!</Text>
                    <Text style={styles.headerText2}>{strings.singintext}</Text>

                </View>


                <View style={styles.formContainer}>


                    <View style={{ marginBottom: 25 }}>
                        {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder={strings.fullname}
                            onChangeText={(value) => setfullname(value)}
                        />

                    </View>
                    <View style={{ marginBottom: 25 }}>
                        {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                        <TextInput
                            style={styles.inputBox}
                            keyboardType='number-pad'
                            placeholder={strings.number}
                            maxLength={10}
                            onChangeText={(value) => setphonenumber(value)}
                        />

                    </View>
                    <View style={{ marginBottom: 25 }}>
                        {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder={strings.address}
                            onChangeText={(value) => setaddress(value)}
                        />

                    </View>
                    <View style={{ marginBottom: 25 }}>
                        {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                        <TextInput
                            style={styles.inputBox}
                            keyboardType='email-address'
                            placeholder={strings.email}
                            autoCapitalize="none"
                            onChangeText={(value) => setemail(value)}
                        />

                    </View>
                    <View style={styles.passwordInputBox}>
                        {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                        <TextInput
                            style={{ fontSize: 17, width: '85%' }}
                            placeholder={strings.password}
                            secureTextEntry={eyeStatus}
                            onChangeText={(value) => setpassword(value)}
                        />
                        <TouchableOpacity style={{ justifyContent: "center" }}>
                            <FontAwesome
                                style={{ padding: 20 }}
                                onPress={() => setEyeStatus(!eyeStatus)}
                                size={20}
                                name={eyeStatus ? 'eye-slash' : 'eye'} />

                        </TouchableOpacity>


                    </View>
                    <View style={styles.passwordInputBox}>
                        {/* <Text style={styles.formTitle}>Complaint Title</Text> */}
                        <TextInput
                            style={{ fontSize: 17, width: '85%' }}
                            placeholder={strings.cpassword}
                            secureTextEntry={eyeStatusConfirm}
                            onChangeText={(value) => setcpassword(value)}
                        />
                        <TouchableOpacity style={{ justifyContent: "center" }}>
                            <FontAwesome
                                style={{ padding: 20 }}
                                onPress={() => setEyeStatusConfirm(!eyeStatusConfirm)}
                                size={20}
                                name={eyeStatusConfirm ? 'eye-slash' : 'eye'} />

                        </TouchableOpacity>


                    </View>







                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => signup_details()}
                    >
                        <Text style={styles.boxText2}>{strings.signup}</Text>
                    </TouchableOpacity>



                </View>

            </View>





        </ScrollView>

    )
}


export default SignUp;

const styles = StyleSheet.create({


    mainContainer: {
        // padding: 30
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
        marginHorizontal: 20,
        marginBottom: 20




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
        marginBottom: 30,
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
        fontSize: 16
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: 'center'
    },
    boxText2: {
        fontSize: 17,
        color: '#fff',
        opacity: 0.8,
        fontWeight: '900'
    },



})