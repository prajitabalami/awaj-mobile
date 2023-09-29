import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { strings } from '../../lng/LocalizedStrings'
import { ThemeColor } from '../../ThemeColor'

const CustomModalDelete = ({ visible, modalText, onClickedYes, onClickedNo }) => {
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
                style={{ backgroundColor: 'red', flex: 1 }}
            >
                <View style={styles.cardModal}>
                    <View style={styles.card}>
                        <Text style={{ fontSize: 16, color: '#000', fontWeight: "500" }}>{modalText}</Text>
                        <View style={{flexDirection:'row', position:"absolute",right:20, bottom:20}}>
                        <TouchableOpacity
                            onPress={() => onClickedYes()}
                            style={styles.button}
                        >
                            <Text style={{ color: '#fff' }}>{strings.yes}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onClickedNo()}
                            style={{...styles.button, marginLeft:20}}
                        >
                            <Text style={{ color: '#fff' }}>{strings.no}</Text>
                        </TouchableOpacity>

                        </View>
                        

                    </View>


                </View>

            </Modal>

        </View>
    )
}

export default CustomModalDelete

const styles = StyleSheet.create({
    card: {
        backgroundColor: ThemeColor.backgroundLight,
        borderRadius: 10,
        // borderWidth: 0.5,
        padding: 15,
        height: '17%',
        marginHorizontal: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardModal: {
        justifyContent: "center",
        flex: 1

    },
    button: {
        backgroundColor: "green",
        // alignSelf:"center"

        padding: 8,
        borderRadius: 5,
        width:50,
        alignItems:"center"
    }

})