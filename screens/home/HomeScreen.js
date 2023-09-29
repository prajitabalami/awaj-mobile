import React, { useContext, useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View, Image, Button, FlatList, VirtualizedList, Alert, Dimensions, TextInput, TouchableOpacity, Platform
} from 'react-native';

import GlobalContext from '../../GlobalContextProvider';

import { ThemeColor } from '../../ThemeColor'
import { BaseUrl } from '../../BaseUrl';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'

import { strings, changeLanguage } from '../../lng/LocalizedStrings';
import { setLng, getLng } from '../../lng/changeLng';
import RNRestart from 'react-native-restart';
import CustomModal from '../components/CustomModal';
import CustomModalButtons from '../components/CustomModalButtons';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


import LinearGradient from 'react-native-linear-gradient'
import DropDownPicker from 'react-native-dropdown-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Collapsible from 'react-native-collapsible';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';


const HomeScreen = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'English', value: 'English' },
        { label: 'नेपाली', value: 'नेपाली' }
    ]);
    const [selectedImage, setSelectedImages] = useState([])
    const [deviceImages, setdeviceImages] = useState([])
    const [isCollapsed, setisCollapsed] = useState(true)
    const [isCollapsed2, setisCollapsed2] = useState(true)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState(strings.public)
    const [loggedIn, setLoggedIn] = useState(false)
    const [token, settoken] = useState('')
    const [userId, setuserId] = useState('')
    const [username, setusername] = useState('')
    const [fileUpload, setFileUpload] = useState({})
    const [spinner, setspinner] = useState(false);
    const [totalDetails, setTotalDetails] = useState({})
    const [spinnerText, setSpinnerText] = useState('')

    const [areaList, setAreaList] = useState([])
    const [selectedArea, setSelectedArea] = useState(strings.choose)

    const [languageState, setLanguageState] = useState('en')
    const [lanLocal, setLanLocal] = useState('English')

    const { glist, updategList } = useContext(GlobalContext)
    const handleClick = (value) => {
        updategList(value)
    }
    const [modalVisible, setModalVisible] = useState(false);
    const [dynamicModalText, setDynamicModalText] = useState('')

    const [modalVisible2, setModalVisible2] = useState(false);
    const [dynamicModalText2, setDynamicModalText2] = useState('')

    const handleModal = () => {
        setModalVisible(!modalVisible)
    }
    const handleModal2 = () => {
        setModalVisible2(!modalVisible2)
    }

    const handleYes = () => {
        navigation.navigate('LoginStack')
        handleModal2()
    }

    useEffect(() => {
        (async () => {
            let language = await AsyncStorage.getItem('language');
            setLanLocal(language)
            console.log(language)

        })
        return () => { }
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getTotalStatus()
            checkToken()
        })

        selectedLng()

        return unsubscribe;

    }, [])

    useEffect(() => {
        getAreas()
    }, [])

    const selectedLng = async () => {
        const lngData = await getLng()
        console.log(lngData)
        if (!!lngData) {
            strings.setLanguage(lngData)
            setLanLocal(lngData)
        }
    }

    const getAreas = async () => {

        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',

            }
        }
        try {
            const data = await axios.get(BaseUrl.BaseUrl + 'getAreas');
            console.log("Areas", data.data)
            setAreaList(data.data)


        } catch (error) {
            console.log(error);
            // Alert.alert("Something went wrong. Please check your Internet Connection!")
            // setModalVisible(true)
            // setDynamicModalText("Something went wrong. Please check your Internet Connection!")
        }
    }


    const getTotalStatus = async () => {

        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',

            }
        }
        try {
            const data = await axios.get(BaseUrl.BaseUrl + 'findTotal');
            console.log("Requestssss", data.data)
            setTotalDetails(data.data)


        } catch (error) {
            console.log(error);
            // Alert.alert("Something went wrong. Please check your Internet Connection!")
            setModalVisible(true)
            setDynamicModalText("Something went wrong. Please check your Internet Connection!")
        }
    }

    const checkToken = async () => {
        let token = await AsyncStorage.getItem('token');
        let userId = await AsyncStorage.getItem('userId');
        let username = await AsyncStorage.getItem('username');
        settoken(token)
        setuserId(userId)
        setusername(username)
        console.log("Toookennn", token)
        if (token == null || token == '') {
            setLoggedIn(false)
            console.log("No token")
        }


        else
            setLoggedIn(true)

    }


    const handleSelectImage = async () => {
        try {
            const options = {
                mediaType: 'photo', // Specify the media type to select (photo, video, or both)
                quality: 0.5, // Set the image quality (0 to 1)
                selectionLimit: 4,

            };

            const result = await launchImageLibrary(options);
            console.log("Uploading from device", result)

            if (!result.didCancel && !result.error) {
                const urls = await Promise.all(
                    result.assets.slice(0, 4).map((asset) => {
                        const fileSize = asset.fileSize / (1024 * 1024);
                        console.log("Filesize", fileSize)
                        if (fileSize <= 3) {
                            const uri = asset.uri;
                            const type = asset.type;
                            const name = asset.fileName;
                            const source = {
                                uri,
                                type,
                                name,
                            };
                            console.log('Image ', source);
                            //  setdeviceImages((prevImages) => [...prevImages, ...urls]);
                            return cloudinaryUpload(source)
                        }

                    })

                );



                console.log("Urlssss", urls)
                setSelectedImages(urls)
                setspinner(false);
                console.log("State images", selectedImage)
            }
        } catch (error) {
            console.log('Error selecting image:', error);

        }
    };

    const cloudinaryUpload = async (photo) => {
        setspinner(true)
        setSpinnerText('Uploading photos')
        const data = new FormData()
        data.append('file', photo)
        data.append('upload_preset', 'kh7wgw2g')
        data.append("cloud_name", "dibqxmlpc")

        try {
            const response = await fetch(
                'https://api.cloudinary.com/v1_1/dibqxmlpc/image/upload',
                {
                    method: 'post',
                    body: data,
                }
            );
            const result = await response.json();
            console.log('Returning', result.secure_url);
            return result.secure_url
        } catch (error) {
            setspinner(false);
            // Alert.alert('An Error Occured While Uploading');
            setModalVisible(true)
            setDynamicModalText("An Error Occured While Uploading")
            throw error;
        }
    }

    const changeStatus = () => setisCollapsed(!isCollapsed)
    const changeStatus2 = () => setisCollapsed2(!isCollapsed2)

    const formValidation = () => {
        if (title == '' || description == '' || category == '' || selectedArea=== strings.choose) {
            return false
        }
        else {
            return true
        }
    }

    const sendDetails = async () => {
        // console.log("Sneding token", token)

        setspinner(true)
        setSpinnerText('')
        console.log("ButtonCicked", loggedIn)


        if (loggedIn) {
            if (formValidation()) {
                const formData = new FormData();
                console.log("REached here")
                formData.append('file', fileUpload);

                const article = {
                    title: title,
                    description: description,
                    category: category,
                    images: selectedImage.length > 0 ? selectedImage : [],
                    userId: userId,
                    username: username,
                    area: selectedArea,
                }

                console.log(article)


                let config = {
                    headers: {

                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'authorization': 'JWT ' + token

                    }
                }
                try {
                    const data = await axios.post(BaseUrl.BaseUrl + 'saveComplaints', article, config);
                    console.log("Response", data.data)
                    console.log("Status", data.status)

                    if (data.data === "Authentication failed") {
                        setspinner(false)
                        navigation.navigate('LoginStack')
                        // Alert.alert("Authorization failed")
                    }

                    else {
                        setspinner(false)
                        // Alert.alert("Your Complaints have been registered")
                        setModalVisible(true)
                        setDynamicModalText(strings.complainRegistered)
                        setTitle('')
                        setDescription('')
                        setSelectedImages([])

                        try {
                            const data = await axios.get(BaseUrl.BaseUrl + 'allPublicComplaints');
                            console.log("Requestssss dataaaaa", data.data)
                            //   setspinner(false)
                            //   setData(data.data)
                            //   setFilteredData(data.data)
                            handleClick(data.data)

                        } catch (error) {
                            console.log(error);
                            //   setspinner(false)
                            // Alert.alert("Something went wrong. Please check your Internet Connection!")
                            setModalVisible(true)
                            setDynamicModalText("Something went wrong. Please check your Internet Connection!")
                        }

                    }






                } catch (error) {
                    console.log("Error", error);
                    setspinner(false)
                    // Alert.alert("Something went wrong. Please check your Internet Connection!")
                    setModalVisible(true)
                    setDynamicModalText("Something went wrong. Please check your Internet Connection!")
                }
            }
            else {
                setspinner(false)
                // Alert.alert("Please provide all the feild.")
                setModalVisible(true)
                setDynamicModalText("Please Provide all the feilds.")

            }
        }

        else {
            setspinner(false)
            navigation.navigate('LoginStack')
        }





    }
    const checkLoggedin = () => {
        if (loggedIn) {
            navigation.navigate('Profile')
        }
        else {
            setModalVisible2(true)
            setDynamicModalText2(strings.wantLogin)
            console.log(modalVisible2)
            // Alert.alert(
            //     'Do you want to login?',
            //     '',
            //     [
            //         {
            //             text: 'Yes',
            //             onPress: () => navigation.navigate('LoginStack')
            //         },
            //         {
            //             text: 'No',
            //             onPress: () => console.log('No')
            //         }
            //     ],
            //     { cancelable: false }
            // );
        }
    }

    const handkeChange = async (val) => {
        if (val === "English") {
            await setLng('English'); // Update the language value in AsyncStorage
            await changeLanguage();
            RNRestart.Restart();
        }
        if (val === "नेपाली") {
            // strings.setLanguage('np')
            await setLng('नेपाली'); // Update the language value in AsyncStorage
            await changeLanguage();
            RNRestart.Restart();
        }
    }

    return (
        <ScrollView style={{ backgroundColor: '#fff', zIndex: 1 }} >
            <StatusBar backgroundColor='#fff' />

            <Spinner
                color={ThemeColor.box3}
                visible={spinner}
                textContent={spinnerText}
                textStyle={{ fontSize: 16, color: '#000' }}
            />
            <CustomModal visible={modalVisible} modalText={dynamicModalText} onClose={handleModal} />
            <CustomModalButtons visible={modalVisible2} modalText={dynamicModalText2} onClickedNo={handleModal2} onClickedYes={handleYes} />
            <View style={{
                paddingHorizontal: 20,
                 paddingBottom: 20,
                paddingTop: Platform.OS === 'ios' ? 40 : 20,
                flexDirection: 'row', alignItems: 'center',
                zIndex: 1, justifyContent: 'space-between',
                // backgroundColor:"#20c997", marginHorizontal:10,
                // borderRadius:10,marginVertical:20
            }}>
                {/* <Text style={{ fontSize: 20, color: '#000', fontWeight: '900', width: '50%' }}>CMS</Text> */}
                <View style={{ width: '50%', zIndex: 1 }}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={styles.lngDrop}
                        listMode="SCROLLVIEW"
                        dropDownContainerStyle={{
                            backgroundColor: "#fff",
                            borderColor: '#fff',
                            width: '60%',
                        }}
                        placeholder={lanLocal}

                        onChangeValue={(value) => handkeChange(value)}
                    />
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {
                            checkLoggedin()
                        }

                        }

                        style={{ borderRadius: 80, backgroundColor: '#010141', height: 35, width: 35, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name='user' color='#fff' size={17}

                        />

                    </TouchableOpacity>


                </View>


            </View>




            <View style={styles.statusContainer}>
                {/* <Text style={{...styles.boxText1, marginTop:0, marginBottom:30}}>Complaints Status</Text> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={styles.statusBox}>
                        <View>
                            <Octicons style={styles.boxIcon} name='note' size={25} color='#ee7e61' />
                        </View>

                        <View style={styles.marginVertical}>
                            <Text style={styles.boxText1}>{strings.totalComplaint}</Text>
                            <View>
                                <Text style={styles.boxText4}>{totalDetails.total}</Text>
                            </View>

                        </View>


                    </View>
                    <View style={styles.statusBox}>
                        <View>
                            <Octicons style={styles.boxIcon} name='stack' size={25} color='#c63a3a' />
                        </View>

                        <View style={styles.marginVertical}>
                            <Text style={styles.boxText1}>{strings.queue}</Text>
                            <View>
                                <Text style={styles.boxText4}>{totalDetails.Queue}</Text>
                            </View>

                        </View>


                    </View>
                    <View style={styles.statusBox}>
                        <View>
                            <FontAwesome5 style={styles.boxIcon} name='spinner' size={25} color='#5464f6'  />
                        </View>

                        <View style={styles.marginVertical}>
                            <Text style={styles.boxText1}>{strings.progress}</Text>
                            <View>
                                <Text style={styles.boxText4}>{totalDetails.Progress}</Text>
                            </View>

                        </View>


                    </View>
                    <View style={styles.statusBox}>
                        <View>
                            <FontAwesome5 style={styles.boxIcon} name='check' size={25} color='#1bad82'  />
                        </View>

                        <View style={styles.marginVertical}>
                            <Text style={styles.boxText1}>{strings.completed}</Text>
                            <View>
                                <Text style={styles.boxText4}>{totalDetails.Success}</Text>
                            </View>

                        </View>


                    </View>

                </View>


            </View>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>{strings.registerComplaint}</Text>

            </View>

            <View style={styles.formContainer}>


                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.formTitle}>{strings.complaintTitle}</Text>
                    <TextInput
                        style={styles.inputBox}
                        placeholder='Place your complain title'
                        onChangeText={(value) => setTitle(value)}
                        value={title}
                    />

                </View>

                <View style={styles.marginVertical}>
                    <Text style={styles.formTitle}>{strings.description}</Text>
                    <TextInput


                        numberOfLines={6}
                        multiline
                        style={styles.inputBox2}
                        placeholder='Complain in detail'
                        textAlignVertical='top'
                        onChangeText={(value) => setDescription(value)}
                        value={description}
                    />

                </View>

                <View style={styles.marginVertical}>
                    <Text style={styles.formTitle}>{strings.complaintCategory}</Text>

                    <TouchableOpacity
                        style={styles.collapseButton}
                        onPress={() => changeStatus()}>
                        <Text style={{ fontSize: 15 }}>{category}</Text>
                        <FontAwesome name={isCollapsed ? 'chevron-down' : 'chevron-up'} />
                    </TouchableOpacity>
                    <Collapsible collapsed={isCollapsed}>
                        <TouchableOpacity
                            onPress={() => {
                                changeStatus()
                                setCategory('public')
                            }}
                            style={styles.collapsibleText}>
                            <Text>{strings.public}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                changeStatus()
                                setCategory('private')
                            }}
                            style={styles.collapsibleText}>
                            <Text>{strings.private}</Text>
                        </TouchableOpacity>
                    </Collapsible>
                </View>
                <View style={styles.marginVertical}>
                    <Text style={styles.formTitle}>{strings.chooseArea}</Text>

                    <TouchableOpacity
                        style={styles.collapseButton}
                        onPress={() => changeStatus2()}>
                        <Text style={{ fontSize: 15 }}>{selectedArea}</Text>
                        <FontAwesome name={isCollapsed2 ? 'chevron-down' : 'chevron-up'} />
                    </TouchableOpacity>
                    <Collapsible collapsed={isCollapsed2}>
                        {/* <TouchableOpacity
                            onPress={() => {
                                changeStatus()
                                setCategory('public')
                            }}
                            style={styles.collapsibleText}>
                            <Text>Choose an option</Text>
                        </TouchableOpacity> */}

                        {areaList.length > 0 ?
                            areaList.map((item, key) => {
                                return (
                                    <TouchableOpacity
                                    key={key}
                                        onPress={() => {
                                            changeStatus2()
                                            setSelectedArea(item.type)
                                        }}
                                        style={styles.collapsibleText}>
                                        <Text>{item.type}</Text>
                                    </TouchableOpacity>

                                )
                            })
                            :
                            <TouchableOpacity
                                onPress={() => {
                                    changeStatus2()
                                    setSelectedArea('')
                                }}
                                style={styles.collapsibleText}>
                                <Text>{strings.private}</Text>
                            </TouchableOpacity>
                        }

                        {/* <TouchableOpacity
                            onPress={() => {
                                changeStatus()
                                setCategory('private')
                            }}
                            style={styles.collapsibleText}>
                            <Text>{strings.private}</Text>
                        </TouchableOpacity> */}
                    </Collapsible>
                </View>

                <Text style={{ ...styles.formTitle, marginTop: 10 }}>{strings.uploadImages}</Text>
                <View style={styles.marginVertical}>
                    <TouchableOpacity
                        onPress={() => handleSelectImage()}
                        style={styles.uploadContainer}
                    >
                        <View>
                            <FontAwesome5 name='cloud-upload-alt' size={25} />
                        </View>
                        <Text>Click to upload</Text>
                    </TouchableOpacity>
                </View>
                {selectedImage.length === 0 ?
                    <View>
                    </View>
                    :
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {selectedImage.map((item, key) => {
                            return (
                                <View key={key} style={{ marginRight: 10 }} >
                                    <TouchableOpacity
                                        onPress={() => {
                                            const updatedImages = [...selectedImage];
                                            updatedImages.splice(key, 1);
                                            setSelectedImages(updatedImages);
                                        }}
                                    >
                                        <Entypo
                                            style={{ alignSelf: 'flex-end' }}
                                            name='cross' size={16} />
                                    </TouchableOpacity>

                                    <Image
                                        source={{ uri: item }}
                                        style={{ height: 50, width: 50 }}
                                    />

                                </View>

                            )
                        })}

                    </View>


                }




                <View style={{ opacity: 0.75 }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => sendDetails()}
                    >
                        <Text style={styles.boxText2}>{strings.submit}</Text>
                    </TouchableOpacity>

                </View>





            </View>


        </ScrollView>

    )
}


export default HomeScreen;

const styles = StyleSheet.create({
    statusContainer: {
        // paddingVertical:20,
        // backgroundColor:'red',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor:'#f8f9fa',
        marginHorizontal:10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius:10,
        // opacity:0.7


    },

    statusBox: {
        // backgroundColor: ThemeColor.box1,
        // flexDirection:'row',
        width: '25%',
        // height: Math.round(windowWidth * 0.4),
        // borderRadius: 10,

        // justifyContent: 'space-around'
        alignItems: 'center'



    },
    boxIcon: {
        // color:'#fff',
        opacity: 0.7,


    },
    boxText1: {
        fontSize: 14,
        color: '#000',
        opacity: 0.8
    },
    boxText2: {
        fontSize: 15,
        color: '#fff',
        opacity: 0.8,
        fontWeight: '900',
        textAlign: 'center',

    },
    boxText4: {
        fontSize: 17,
        color: '#000',
        opacity: 0.8,
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 10,

    },
    formContainer: {
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        margin: 10,
        backgroundColor: '#fff',
        // borderWidth:0.3,
        borderRadius:10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,



    },
    inputBox: {
        backgroundColor: '#fff',
        borderWidth: Platform.OS === 'android' ? 0.1 : 0.3,
        borderRadius: Platform.OS === 'android' ? 2 : 5,
        height: 50,
        fontSize: 15,
        paddingHorizontal: 10,


    },
    inputBox2: {
        backgroundColor: '#fff',
        borderWidth: Platform.OS === 'android' ? 0.1 : 0.3,
        borderRadius: Platform.OS === 'android' ? 2 : 5,
        fontSize: 15,
        paddingHorizontal: 10,
        height: Platform.OS === 'ios' ? 70 : null



    },
    headerText: {
        fontSize: 20,
        color: '#000',
        fontWeight: '500',
        alignSelf:'center',
        opacity:0.7


    },
    marginVertical: {
        marginVertical: 10
    },
    formTitle: {
        marginBottom: 10,
        fontWeight: '400',
        fontSize: 16,
        color: '#000'
    },
    uploadContainer: {
        height: Math.round(windowHeight * 0.1),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: Platform.OS === 'android' ? 0.1 : 0.3,
        borderRadius: Platform.OS === 'android' ? 2 : 5,
    },
    headerTextContainer: {
        backgroundColor: '#f8f9fa',
        // backgroundColor: '#010141',
        // backgroundColor: ThemeColor.box3,
        marginHorizontal: 10,
        paddingVertical:15,
        marginBottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // borderRadius:10,
        marginTop: 40,
        paddingHorizontal: 15,
        

    },
    button: {
        backgroundColor: '#010141',
        height: 50,
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',



    },
    collapseButton: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 10,
        borderWidth: Platform.OS === 'android' ? 0.1 : 0.3,
        borderRadius: Platform.OS === 'android' ? 2 : 5,


    },
    collapsibleText: {
        backgroundColor: ThemeColor.backgroundLight,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // width:'50%',
        marginTop: 10
    },
    lngDrop: {
        backgroundColor: '#fff',
        width: '60%',
        borderWidth: 0,
        fontSize:15
    }



})