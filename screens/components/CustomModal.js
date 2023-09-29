import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { ThemeColor } from '../../ThemeColor'

const CustomModal = ({ visible, modalText, onClose }) => {
    // const [modalVisible, setModalVisible] = useState(false);

    const toggalModal = () => {
        setModalVisible(!modalVisible)
    }
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                style={{backgroundColor:'red', flex:1}}
            >
                <View style={styles.cardModal}>
                    <View style={styles.card}>
                        <Text style={{fontSize:16,color:'#000', fontWeight:"500"}}>{modalText}</Text>
                        <TouchableOpacity
                            onPress={() => onClose()}
                            style={styles.button}
                        >
                            <Text style={{color:'#fff'}}>Close</Text>
                        </TouchableOpacity>

                    </View>


                </View>

            </Modal>

        </View>
    )
}

export default CustomModal

const styles = StyleSheet.create({
    card:{
        backgroundColor: ThemeColor.backgroundLight,
        borderRadius:10,
        // borderWidth:0.5,
        padding:15,
        height:'18%',
        marginHorizontal:30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardModal:{
        justifyContent:"center",
        flex:1
    
    },
    button:{
        backgroundColor:"green",
        // alignSelf:"center"
        position:"absolute",
        bottom:20,
        right:20,
        padding:8,
        borderRadius:5,
    }

})