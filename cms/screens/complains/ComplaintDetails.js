import React, { useEffect, useState, useContext } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View, Image, Button, FlatList, TextInput, Alert, TouchableOpacity, Dimensions
} from 'react-native';



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
import Swiper from 'react-native-swiper'
import ProgressBar from 'react-native-progress/Bar';
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CommentItem = ({ comment, currUserId, complaintId, updateList }) => {
    const [replyText, setReplyText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);

    const handleReplyPress = () => {
        setShowReplyInput(!showReplyInput);
    };

    const handleReplySubmit = async (parentId) => {
        const article = {
            message: replyText,
            userId: currUserId,
            complaintId: complaintId,
            parentId: parentId,

        }

        console.log(article)


        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                // 'authorization': 'JWT ' + token

            }
        }
        try {
            const data = await axios.post(BaseUrl.BaseUrl + 'saveComments', article, config);
            console.log("Response", data.data)
            setReplyText('')
            handleReplyPress()
            try {
                const data = await axios.get(BaseUrl.BaseUrl + 'getComplaints/' + complaintId);
                console.log("Commentssss in order", data.data.comments_in_order)
                updateList(data.data)



            } catch (error) {
                console.log(error);
            }



        } catch (error) {
            console.log("Error", error);
        }


    }

    return (
        <View style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{
                    borderWidth: 0.5, width: 30, height: 30,
                    justifyContent: 'center', alignItems: 'center',
                    borderRadius: 30, marginRight: 10
                }}>
                    <FontAwesome
                        style={{ opacity: 0.7, }}
                        name='user' size={25} />
                </View>

                <View>
                    {comment.userId != null ?
                        <Text style={{ color: 'grey' }}>{comment.userId.fullname}   {comment.Date?.slice(0, 15)}</Text>
                        :
                        <Text>Dummy</Text>
                    }
                    <Text>{comment.message}</Text>

                    <View style={{ flexDirection: 'row' }}>


                        <TouchableOpacity
                            onPress={() => handleReplyPress()}
                        >
                            <Text style={{ color: 'grey', fontSize: 13, marginTop: 5 }}>Reply</Text>
                        </TouchableOpacity>
                        {comment.userId != null ?
                            currUserId === comment.userId._id ?
                                <TouchableOpacity>
                                    <Text style={{ color: 'grey', fontSize: 13, marginTop: 5, marginLeft: 10 }}>Delete</Text>
                                </TouchableOpacity>
                                :
                                console.log("Check del", currUserId, comment.userId._id)

                            :
                            console.log("Nothing")
                        }

                    </View>
                </View>


            </View>
            {showReplyInput && (
                <View>
                    <TextInput
                        style={{ marginTop: 10, marginBottom: 5, }}
                        placeholder="Write a reply"
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                    />
                    <Button title="Submit" onPress={() => handleReplySubmit(comment._id, currUserId, complaintId)} />
                </View>
            )}


            {comment.children && comment.children.length > 0 && (
                <View style={{ marginLeft: 10 }}>
                    {comment.children.map(reply => (
                        <CommentItem key={reply._id}
                            comment={reply}
                            currUserId={currUserId}
                            complaintId={complaintId}
                            updateList={updateList}

                        />
                    ))}
                </View>

            )}
        </View>
    )
}



const ComplaintDetails = ({ navigation, route }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'All', value: 'All' },
        { label: 'Success', value: 'Success' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Queue', value: 'Queue' },
    ]);

    const [progressAmount, setProgressAmount] = useState(0)

    const [details, setDetails] = useState(null)
    const [date, setDate] = useState('')
    const [image, setimage] = useState(['https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?s=612x612&w=0&k=20&c=St-gpRn58eIa8EDAHpn_yO4CZZAnGD6wKpln9l3Z3Ok='])

    const [commentsList, setCommentsList] = useState([])
    const [rootComments, setRootComments] = useState([])
    const [currUserId, setCurrUserId] = useState('')
    const [complaintId, setComplaintId] = useState('')
    const [commentText, setCommentText] = useState('')
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [curruserName, setCurrUserName] = useState('')
    const [selectedRepIndex, setSelectedRepIndex] = useState(null)
    const [currEmail, setCurrEmail] = useState('')



    useEffect(() => {
        let isMounted =true;
        const list = route.params.items;
        setDetails(list);
        if(isMounted){
            getDetails(callApi);
            getCurrId();
        }
       

         return () => {
            isMounted = false
         };
    }, []);

    const getCurrId = async () => {
        try {
            let curruserId = await AsyncStorage.getItem('userId');
            let currusername = await AsyncStorage.getItem('username');
            let curruseremail = await AsyncStorage.getItem('email');
            console.log("Get user id", curruserId)
            setCurrUserId(curruserId)
            setCurrUserName(currusername)
            setCurrEmail(curruseremail)
        }
        catch (err) {
            console.log(err)
        }
    }
    const getDetails = (callBack) => {
        console.log("Settingggggggggggggggggggggggggg")
        const list = route.params.items
        setDetails(list)
        switch (list.status) {
            case 'Queue':
                setProgressAmount(0)
                break
            case 'Progress':
                setProgressAmount(0.5)
                break
            case 'Success':
                setProgressAmount(1)
                break
            default:
                break
        }
        const _date = route.params.date
        console.log("From Navigation", list)

        callBack(list._id, list, _date, list.images)




    }

    const updateList = (value) => {
        setCommentsList(value)
    }

    const callApi = async (id, list, date, img) => {
        setDetails(list)
        setDate(date)
        setComplaintId(id)
        if (img.length !== 0) {
            setimage(img)

        }
        console.log("Commmplainntt Iddddd", id)
        console.log("Nav details", list)

        try {
            const data = await axios.get(BaseUrl.BaseUrl + 'getComments/' + id);
            console.log("Commentssss", data.data)
            updateList(data.data)

            // let root = data.data.filter(item => item.parentId === null)
            // setRootComments(root)


        } catch (error) {
            console.log(error);
        }





    }

    const getReplies = (commentId) => {

        let replies = commentsList.filter(item => {
            console.log("Check", commentId, item.parentId);
            return item.parentId === commentId;
        });

        // console.log("REeeee", replies)
        return replies
    }

    const saveComment = async () => {
        const article = {
            message: commentText,
            userId: currUserId,
            complaintId: complaintId


        }

        console.log(article)


        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                // 'authorization': 'JWT ' + token

            }
        }
        try {
            const data = await axios.post(BaseUrl.BaseUrl + '/saveComments', article, config);
            console.log("Response", data.data)
            setCommentText('')
            try {
                const data = await axios.get(BaseUrl.BaseUrl + 'getComments/' + complaintId);
                console.log("Commentssss in order", data.data)
                updateList(data.data)



            } catch (error) {
                console.log(error);
            }


        } catch (error) {
            console.log("Error", error);
        }

    }

    const handleReplyPress = () => {
        setShowReplyInput(!showReplyInput);
    };
    const handleReplySubmit = async (id) => {
        console.log("Reply to comment id", id)
        const article = {
            message: replyText,
            userId: currUserId,
            username: curruserName,

        }

        console.log(article)


        let config = {
            headers: {

                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                // 'authorization': 'JWT ' + token

            }
        }
        try {
            const data = await axios.post(BaseUrl.BaseUrl + 'saveReplies/' + id, article, config);
            console.log("Response", data.data)
            setReplyText('')
            handleReplyPress()
            try {
                const data = await axios.get(BaseUrl.BaseUrl + 'getComments/' + complaintId);
                console.log("Commentssss in order", data.data)
                updateList(data.data)



            } catch (error) {
                console.log(error);
            }



        } catch (error) {
            console.log("Error", error);
        }


    }


    return (
        <View style={{ backgroundColor: ThemeColor.backgroundLight, paddingVertical: 20 }} >
            <ScrollView>
                <TouchableOpacity
                    onPress={() => navigation.navigate('LatestComplaints')}
                    style={{
                        marginBottom: 30,
                        marginTop: Platform.OS === 'ios' ? 20 : null,
                        flexDirection: 'row', padding: 10, alignItems: 'center'
                    }}>
                    <FontAwesome5 name='arrow-left' size={20} color='#000'
                        style={{ marginRight: 10 }}

                    />
                    <Text style={{ fontSize: 20, color: '#000', fontWeight: '900', }}>Complaint Details</Text>


                </TouchableOpacity>

                <StatusBar backgroundColor={ThemeColor.backgroundLight} />
                <View >


                    {/* <Text style={styles.inageText}>Images:</Text> */}
                    <Swiper
                        style={styles.swiperBox}
                        // showsButtons={true}

                        horizontal={true}
                        // dotStyle={{ display: 'none' }}
                        activeDotStyle={{ marginBottom: -10 }}
                        dotStyle={{ marginBottom: -10 }}
                        activeDotColor='#fff'
                        dotColor='grey'


                    >
                        {image.map((item, key) => {
                            return (
                                <View key={key} >


                                    <Image source={{ uri: item }}
                                        style={styles.swiperImg}
                                    />


                                </View>
                            )
                        })}





                    </Swiper >
                    {
                        details ?

                            <View >

                                <View style={styles.middleContainer}>

                                    <Text style={styles.titleText}>{details.title}</Text>

                                    <View style={{ marginVertical: 20 }}>
                                        <View style={styles.userContainer}>
                                            <FontAwesome
                                                style={styles.userIcon}
                                                name='user'
                                                size={20}
                                                color='grey'
                                            />
                                            <Text style={styles.postDetails}>{details.username}</Text>

                                        </View>
                                        {/* <Text style={styles.postDetails}>{details.userId.address}</Text>
                                        <Text style={styles.postDetails}>{details.userId.phonenumber}</Text>
                                        <Text style={styles.postDetails}>{details.userId.email}</Text> */}

                                    </View>



                                    <View style={styles.userContainer}>
                                        <FontAwesome
                                            style={styles.userIcon}
                                            name='calendar'
                                            size={20}
                                            color='grey'
                                        />
                                        <Text >{date}</Text>
                                    </View>
                                    <View style={styles.progressBarContainer}>
                                        <View>
                                            <Text style={{ marginVertical: 5 }}>Status:</Text>
                                            <ProgressBar
                                                progress={details.statusbar / 100}
                                                width={200}
                                                height={15}
                                                color='green'
                                            />

                                        </View>
                                        <Text>{details.statusbar}%</Text>
                                        {/* <Text>{date}</Text> */}
                                    </View>


                                </View>


                                <View style={styles.bottomContainer}>
                                    <Text style={styles.description}>Description:</Text>

                                    <View style={styles.descriptionText}

                                    >
                                        <Text
                                            lineHeight={6}
                                            style={styles.description2}>{details.description}</Text>
                                    </View>

                                </View>



                            </View>
                            :
                            <View><Text>Loading...</Text></View>

                    }



                </View>

                <View style={{ margin: 10 }}>
                    <Text style={{ fontWeight: '600' }}>Comments</Text>
                </View>

                <View style={{ marginHorizontal: 10, borderRadius: 5, padding: 20, elevation: 1, shadowColor: '#fff', backgroundColor: "#fff" }}>
                    {details ?
                        ((details.userId._id === currUserId) || currEmail === "sachiwalayap@gmail.com") &&
                        <View>
                            <TextInput
                                placeholder="Write a comment."
                                style={styles.commentBox}
                                multiline
                                value={commentText}
                                onChangeText={(value) => setCommentText(value)}
                            />
                            <TouchableOpacity
                                style={styles.postButton}
                                onPress={() => saveComment()}

                            >
                                <Text style={{ color: '#fff' }}>Post</Text>
                            </TouchableOpacity>
                        </View>

                        :
                        <View><Text>Loading</Text></View>

                    }


                    <View style={{}}>



                        {
                            commentsList.length === 0 ?
                                <View><Text>No comments</Text></View>
                                :
                                commentsList.map((item, key) => {
                                    return (
                                        <View style={{ marginVertical: 15, flexDirection: 'row' }} key={key}>
                                            <FontAwesome name='user-circle' size={25}
                                                style={{ marginRight: 10 }}
                                            />
                                            <View>


                                                {item && (
                                                    <View style={{ flexDirection: 'row' }}>

                                                        <Text style={{ fontSize: 16, fontWeight: '500', width: '65%' }} >{item.userid ? item.userid.fullname : "Admin"}</Text>
                                                        <Text style={{ fontSize: 13 }}>{item.Date.slice(0, 15)}</Text>
                                                    </View>

                                                )}

                                                <Text style={{ opacity: 0.9, marginTop: 5 }}>{item.message}</Text>
                                                {((item.userid && item.userid._id === currUserId) || currEmail === "sachiwalayap@gmail.com") && (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            handleReplyPress()
                                                            setSelectedRepIndex(key)
                                                        }}
                                                    >
                                                        <Text style={{ fontWeight: '600', marginVertical: 5 }}>Reply</Text>
                                                    </TouchableOpacity>
                                                )}
                                                {showReplyInput && selectedRepIndex === key && (
                                                    <View>
                                                        <TextInput
                                                            style={styles.commentBox}
                                                            placeholder="Write a reply"
                                                            value={replyText}
                                                            onChangeText={setReplyText}
                                                            multiline
                                                        />
                                                        <TouchableOpacity
                                                            style={styles.postButton}
                                                            onPress={() => handleReplySubmit(item._id)}
                                                        >

                                                            <Text style={{ color: '#fff' }}>Submit</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                                {item.reply.length === 0 ? <View></View> :
                                                    <View style={{ marginTop: 10 }}>
                                                        {item.reply.map((item, key) => {
                                                            return (
                                                                <View style={{ marginVertical: 10, flexDirection: 'row' }} key={key}>
                                                                    <FontAwesome name='user-circle' size={25}
                                                                        style={{ marginRight: 10 }}
                                                                    />
                                                                    <View>

                                                                        <Text style={{ fontSize: 16, fontWeight: '500' }} >{item.username ? item.username : "Admin"}</Text>
                                                                        <Text style={{ opacity: 0.7, marginTop: 5 }}>{item.message}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        })}
                                                    </View>

                                                }
                                            </View>
                                        </View>


                                    )
                                })
                        }
                    </View>




                </View>



            </ScrollView>


        </View>

    )
}


export default ComplaintDetails;

const styles = StyleSheet.create({

    arrowIcon: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 50, width: 50,
        borderRadius: 50,
        alignSelf: 'center'
    },
    detailsContainer: {
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        // marginHorizontal:20
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',


    },
    swiperBox: {
        height: Math.round(windowHeight * 0.3),


    },
    swiperImg: {
        height: Math.round(windowHeight * 0.3),
        width: windowWidth,
        resizeMode: 'contain'

    },
    progressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10

    },
    descriptionText: {
        // opacity: 0.5,
        fontSize: 13
    },
    inageText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#000'
    },

    description: {
        fontSize: 15,
        color: '#000',
        // paddingBottom:20

    },
    middleContainer: {
        borderWidth: 0.1,
        borderRadius: 1,
        margin: 10,
        backgroundColor: '#fff',
        // opacity: 0.7,
        padding: 20,

    },
    bottomContainer: {
        borderWidth: 0.1,
        borderRadius: 1,
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#fff',
        // opacity: 0.7,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 90
        // height: Math.round(windowHeight * 0.5),


    },
    description2: {
        fontSize: 14,
        color: '#000',
        marginVertical: 10
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',



    },
    userIcon: {
        marginRight: 10

    },
    iconText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    postDetails: {
        fontSize: 15,
        marginTop: 3
    },
    commentBox: {
        backgroundColor: '#fff',
        borderRadius: Platform.OS === 'android' ? 4 : 8,
        height: 60,
        fontSize: 17,
        paddingHorizontal: 10,
        elevation: 5,
        shadowColor: '#000'
    },
    postButton: {
        backgroundColor: 'green',
        height: 40,
        width: '20%',
        marginTop: 20,
        marginBottom: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',


    }

})

