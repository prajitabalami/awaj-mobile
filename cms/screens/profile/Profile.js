import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View, Image, Button, FlatList, VirtualizedList, Alert, TouchableOpacity, Dimensions, Platform,RefreshControl
} from 'react-native';


import { ThemeColor } from '../../ThemeColor'
import { BaseUrl } from '../../BaseUrl';

import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { strings, changeLanguage } from '../../lng/LocalizedStrings';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


import LinearGradient from 'react-native-linear-gradient'
import DropDownPicker from 'react-native-dropdown-picker';
import Collapsible from 'react-native-collapsible';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomModalButtons from '../components/CustomModalButtons';
import CustomModal from '../components/CustomModal';

const Profile = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'All', value: 'All' },
        { label: 'Success', value: 'Success' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Queue', value: 'Queue' },
    ]);

    const [isCollapsed, setisCollapsed] = useState(true)
    const [complaintsList, setComplaintsList] = useState([])
    const [spinner, setspinner] = useState(false);
    const [profDetails, setProfDetails] = useState(null)

    const [modalVisible2, setModalVisible2] = useState(false);
    const [dynamicModalText2, setDynamicModalText2] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [dynamicModalText, setDynamicModalText] = useState('')
    const [refreshing, setRefreshing] = React.useState(false);
    const [userId, setUserId] = useState('')


    const handleModal = () => {
        setModalVisible(!modalVisible)
    }

    const handleModal2 = () => {
        setModalVisible2(!modalVisible2)
    }

    const handleYes = () => {
        logout()
        handleModal2()
    }

    const fetchData = async() => {

        let userId = await AsyncStorage.getItem('userId');
        setUserId(userId)
        await getAllComp(userId)
        await getProfDetails(userId)


    };

    useEffect(() => {
        // const unsubscribe = navigation.addListener('focus', async () =>
            
        // );
        // return unsubscribe;
        fetchData()
    }, [])

    const getProfDetails = async (id) => {
        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',

            }
        }
        try {
            const data = await axios.get(BaseUrl.BaseUrl + 'getProfile/' + id);
            console.log("Prooooo", data.data[0].fullname)
            setProfDetails(data.data[0])
        }
        catch (err) {
            console.log(err)
            // Alert.alert("Something went wrong. Please check your Internet Connection!")
            setModalVisible(true)
            setDynamicModalText("Something went wrong. Please check your Internet Connection!")
        }
    }

    const getAllComp = async (id) => {
        setRefreshing(true)
        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',

            }
        }
        try {
            const data = await axios.get(BaseUrl.BaseUrl + 'getOwnComplaints/' + id);
            console.log("Requestssss", data.data)
            setspinner(false)
            setComplaintsList(data.data)
            setRefreshing(false)

        } catch (error) {
            console.log(error);
            setspinner(false)
            // Alert.alert("Something went wrong. Please check your Internet Connection!")
            setModalVisible(true)
            setDynamicModalText("Something went wrong. Please check your Internet Connection!")
        }

    }

    const changeStatus = () => setisCollapsed(!isCollapsed)

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            navigation.navigate('HomeScreen')
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    const setColor = (status) => {
        switch (status) {
            case 'Success':
                return '#9bcfa8'
                break;
            case 'Progress':
                return '#ffd599'
                break;
            case 'Queue':
                return '#f29a99'
                break;

            default:
                return '#f29a99'
                break;
        }


    }
    const setTextColor = (status) => {
        switch (status) {
            case 'Success':
                return '#1e9758'
                break;
            case 'Progress':
                return '#fea42c'
                break;
            case 'Queue':
                return '#e02831'
                break;

            default:
                return '#e02831'
                break;
        }


    }


    return (
        <ScrollView style={{}}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={()=>getAllComp(userId)} />
          }
        >
            <View style={{ backgroundColor: '#f8f9fa', padding: 20 }} >
                <Spinner
                    visible={spinner}
                    color={ThemeColor.box3}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('HomeScreen')}
                    style={{
                        marginBottom: 30, flexDirection: 'row',
                        marginTop: Platform.OS === 'ios' ? 20 : null

                    }}>
                    <FontAwesome5 name='arrow-left' size={20} color='#000'
                        style={{ marginRight: 10 }}

                    />

                    <Text style={{ fontSize: 20, color: '#000', fontWeight: '900', alignSelf: 'center' }}>{strings.profile}</Text>
                </TouchableOpacity>


                <StatusBar backgroundColor={ThemeColor.backgroundLight} />
                <CustomModal visible={modalVisible} modalText={dynamicModalText} onClose={handleModal} />

                <CustomModalButtons visible={modalVisible2} modalText={dynamicModalText2} onClickedNo={handleModal2} onClickedYes={handleYes} />


                <View style={styles.profileContainer}>
                    {profDetails ?

                        <View>
                            <View style={styles.iconContainer}>
                                <View style={styles.profileCircle}>
                                    <FontAwesome name='user' size={25} />

                                </View>
                                <View>

                                    <Text style={styles.profileName}>{profDetails.fullname}</Text>
                                    <Text style={styles.detailsText}>{profDetails.address}</Text>
                                </View>
                            </View>

                            <View style={styles.profileDetails}>
                                <View style={{ ...styles.iconContainer, marginTop: 10 }}>
                                    <FontAwesome name='phone' size={20} color='grey' />
                                    <Text style={styles.detailsText}>{profDetails.phonenumber}</Text>
                                </View>

                                {/* <View style={{ ...styles.iconContainer, marginTop: 10 }}>
                                    <MaterialCommunityIcons name='map-marker-radius' size={20} color='grey' />
                                    <Text style={styles.detailsText}>{profDetails.address}</Text>
                                </View> */}

                                <View style={{ ...styles.iconContainer, marginTop: 10 }}>
                                    <Ionicons name='mail' size={20} color='grey' />
                                    <Text style={styles.detailsText}>{profDetails.email}</Text>
                                </View>


                            </View>

                        </View>

                        :
                        <View><Text>Loading...</Text></View>
                    }

                </View>


                <TouchableOpacity
                    onPress={() => {
                        setModalVisible2(true)
                        setDynamicModalText2(strings.wantLogout)
                        // Alert.alert(
                        //     'Do you want to logout?',
                        //     '',
                        //     [
                        //         {
                        //             text: 'Yes',
                        //             onPress: () => logout()
                        //         },
                        //         {
                        //             text: 'No',
                        //             onPress: () => console.log('No')
                        //         }
                        //     ],
                        //     { cancelable: false }
                        // );

                    }}
                    style={styles.logoutButton}
                >
                    <Text>{strings.logout}</Text>
                </TouchableOpacity>



            </View>


            <View style={styles.complaintsContainer}>

                <View style={styles.complaintTitle}>
                    <MaterialIcons name='event-note' size={22} color='grey' />
                    <Text style={{ fontSize: 17, marginLeft: 10, fontWeight: "600" }}>
                        {strings.yourComplaints}
                    </Text>


                </View>

                {complaintsList.length === 0 ?
                    <View><Text>No Comlaints at the moment.</Text></View>
                    :
                    complaintsList.map((item, key) => {
                        return (
                            <TouchableOpacity 
                            onPress={()=>navigation.navigate('ComplaintStack', 
                             {
                                items: item,
                                date: item.Date.slice(0, 15),
                              })}
                            key={key}
                                style={styles.viewStatus}  >
                                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                    <Text style={styles.formTitle}>{item.title}</Text>

                                    <View style={styles.statusButton}>
                                        <Text style={{
                                            backgroundColor: '#fff',
                                            padding: 5, borderRadius: 5,
                                            color: setTextColor(item.status),
                                            backgroundColor: setColor(item.status)
                                        }}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={{fontSize:13}}>{item.Date.slice(0, 15)}</Text>
                                <Text style={{fontSize:13}}>Category: {item.category}</Text>


                            </TouchableOpacity>
                        )
                    })
                }

            </View>
        </ScrollView>

    )
}


export default Profile;

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center'

    },
    profileName: {
        marginLeft: 20,
        fontSize: 22,
        fontWeight: '600'
    },
    profileCircle: {
        height: 60,
        width: 60,
        borderRadius: 60,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        opacity: 0.7


    },
    profileDetails: {
        marginTop: 20,
        marginLeft: 10
    },
    detailsText: {
        marginLeft: 20
    },
    profileContainer: {

    },
    complaintsContainer: {
        backgroundColor: '#f8f9fa',
        marginTop: 10,
        //  height: 500,
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    viewStatus: {

        borderRadius: 5,
        opacity: 0.7,

        padding: 10,
        marginVertical: 10,
        borderWidth: 0.2,
        backgroundColor: '#fff',
        borderColor: '#000'
    },
    statusButton: {





    },
    formTitle: {
        marginBottom: 10,
        fontWeight: '600',
        fontSize: 15,
        color: '#000',
        width: '75%'
    },
    logoutButton: {
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: 30,
        shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    },
    complaintTitle: {
        flexDirection: 'row',
        padding: 10,

    }
})