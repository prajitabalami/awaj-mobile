import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
  FlatList,
  VirtualizedList,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl, Modal
} from 'react-native';

import { ThemeColor } from '../../ThemeColor';
import { BaseUrl } from '../../BaseUrl';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { strings } from '../../lng/LocalizedStrings';

import CustomModal from '../components/CustomModal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import Collapsible from 'react-native-collapsible';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

import AsyncStorage from '@react-native-async-storage/async-storage';

import GlobalContext from '../../GlobalContextProvider';

const LatestComplaints = ({ navigation }) => {

  const [loggedIn, setLoggedIn] = useState(false);

  const [isCollapsed, setisCollapsed] = useState(true);
  const [complaintsList, setComplaintsList] = useState([]);
  const [spinner, setspinner] = useState(false);

  const [data, setData] = useState([]); // Your original data
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on status
  const [selectedStatus, setSelectedStatus] = useState('All'); // Selected status option
  const [selectedArea, setSelectedArea] = useState('All'); // Selected status option
  const [refreshing, setRefreshing] = React.useState(false);

  const { glist, updategList } = useContext(GlobalContext);
  const {areaList} = useContext(GlobalContext);
  console.log(areaList)

  const [modalVisible, setModalVisible] = useState(false);
  const [dynamicModalText, setDynamicModalText] = useState('');
  const [isMounted, setIsMounted] = useState(true);

  const [isVisible, setIsVisible] = useState(false)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: strings.success, value: 'Success' },
    { label: strings.progress, value: 'Progress' },
    { label: strings.queue, value: 'Queue' },
    { label: strings.all, value: 'All' }
  ]);
  const [openArea, setOpenArea] = useState(false);
  const [valueArea, setValueArea] = useState(null);
  const [itemsArea, setItemsArea] = useState([
    { label: 'food', value: 'food' },
    { label: 'road', value: 'road' },
    { label: 'Water Pipe', value: 'Water Pipe' },
    { label: 'All', value: 'All' }
  ]);

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleModalVisible = () => {
    setIsVisible(!isVisible);
  };

  const fetchData = isMounted => {
    if (isMounted) {
      setFilteredData(glist);
      checkToken();

    } else return null;
  };

  useEffect(() => {
    let isMounted = true;
    // const unsubscribe = navigation.addListener('focus', async () =>

    // );
    fetchData(isMounted)
    return () => {
      isMounted = false;
      // unsubscribe();
    };
  }, [glist]);

  const checkToken = async () => {
    let token = await AsyncStorage.getItem('token');

    console.log('Toookennn', token);
    if (token == null || token == '') {
      setLoggedIn(false);
      console.log('No token');
    } else setLoggedIn(true);
  };

  // const filterData = status => {
  //   let filteredArray = [];
  //   if (status === 'All') {
  //     filteredArray = glist;
  //   } else {
  //     filteredArray = glist.filter(item => item.status === status);
  //   }
  //   setFilteredData(filteredArray);
  // };

  // const filterDataByArea = status => {
  //   let filteredArray = [];
  //   if (status === 'All') {
  //     filteredArray = glist;
  //   } else {
  //     filteredArray = glist.filter(item => item.area === status);
  //   }
  //   setFilteredData(filteredArray);
  // };
  const filterData = (status, area) => {
    let filteredArray = glist;

    if (status !== 'All') {
      filteredArray = filteredArray.filter(item => item.status === status);
    }

    if (area !== 'All') {
      filteredArray = filteredArray.filter(item => item.area === area);
    }

    setFilteredData(filteredArray);
  };

  const filterDataByStatus = status => {
    setSelectedStatus(status)
    // const selectedArea = valueArea; 
    filterData(status, selectedArea);
  };

  const filterDataByArea = area => {
    setSelectedArea(area) // Get the currently selected status value from the other dropdown
    filterData(selectedStatus, area);
  };


  const changeStatus = status => {
    setSelectedStatus(status);
    filterData(status);
    setisCollapsed(!isCollapsed);
  };

  const setColor = status => {
    switch (status) {
      case 'Success':
        return '#9bcfa8';
        break;
      case 'Progress':
        return '#ffd599';
        break;
      case 'Queue':
        return '#f29a99';
        break;

      default:
        return '#f29a99';
        break;
    }
  };
  const setTextColor = status => {
    switch (status) {
      case 'Success':
        return '#1e9758';
        break;
      case 'Progress':
        return '#fea42c';
        break;
      case 'Queue':
        return '#e02831';
        break;

      default:
        return '#e02831';
        break;
    }
  };

  const checkLoggedIn = item => {
    // if (loggedIn) {
    navigation.navigate('ComplaintDetails', {
      items: item,
      date: item.Date.slice(0, 15),
    });
    // } else {
    //   navigation.navigate('LoginStack');
    // }
  };

  const reloadData = async () => {
    setRefreshing(true);
    try {
      const data = await axios.get(BaseUrl.BaseUrl + 'allPublicComplaints');
      console.log('Requestssss dataaaaa', data.data);
      updategList(data.data);
      setFilteredData(data.data);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
      // Alert.alert("Something went wrong. Please check your Internet Connection!")
      setModalVisible(true);
      setDynamicModalText(
        'Something went wrong. Please check your Internet Connection!',
      );
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: '#fff', padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={reloadData} />
      }
    >
      <Spinner visible={spinner} color={ThemeColor.box3} />

      <View
        style={{
          marginBottom: 30,
          flexDirection: 'row',
          marginTop: Platform.OS === 'ios' ? 20 : null,
        }}>
        <Text style={{ fontSize: 20, color: '#000', fontWeight: '900' }}>
          {strings.latestComplaints}
        </Text>
      </View>

      <StatusBar backgroundColor={ThemeColor.backgroundLight} />
      <CustomModal
        visible={modalVisible}
        modalText={dynamicModalText}
        onClose={handleModal}
      />

      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          style={styles.collapseButton}
          // onPress={() => setisCollapsed(!isCollapsed)}
          onPress={() => handleModalVisible()}
        >
          <Text style={{color:'#fff'}}>{strings.FilterBy}</Text>
          <FontAwesome style={{ marginRight: 10 }} name='filter' color='#fff' size={20} />
        </TouchableOpacity>
        {/* <Collapsible collapsed={isCollapsed}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => {
                changeStatus('Success');
              }}
              style={styles.collapsibleText}>
              <Text>{strings.success}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                changeStatus('Progress');
              }}
              style={styles.collapsibleText}>
              <Text>{strings.progress}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => {
              changeStatus('Queue');
            }}
            style={styles.collapsibleText}>
            <Text>{strings.queue}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              changeStatus('All');
            }}
            style={styles.collapsibleText}>
            <Text>{strings.all}</Text>
          </TouchableOpacity>
          </View>

         
        </Collapsible> */}
      </View>




      {/* <View style={{ alignItems: 'flex-end', }}>
        <TouchableOpacity
          style={styles.reloadBtn}
          onPress={() => reloadData()}
        >
          <Text style={{ color: '#fff', opacity: 0.9 }}>Reload</Text>
          <AntDesign name='reload1' color='#fff' />
        </TouchableOpacity>
      </View> */}

      <Text style={{ marginBottom: 5 }}>Swipe down to reload.</Text>

      {glist.length === 0 ? (
        <View>
          <Text>{strings.NoComplaints}</Text>
        </View>
      ) : (
        filteredData.map((item, key) => {
          return (
            <TouchableOpacity
              key={key}
              style={{ ...styles.viewStatus, backgroundColor: '#f8f9fa'}}
              onPress={() => checkLoggedIn(item)}>
              <View style={{ width: '87%' }}>
                <Text style={styles.formTitle}>{item.title}</Text>
                <Text style={{ fontSize: 13 }}>{item.Date.slice(0, 15)}</Text>
                <View style={styles.statusButton}>
                  <Text
                    style={{
                      color: setTextColor(item.status),
                    }}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.arrowIcon}>
                <FontAwesome5 style={{}} name="arrow-right" />
              </View>
            </TouchableOpacity>
          );
        })
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        style={{ backgroundColor: 'red', flex: 1 }}
      >
        <View style={styles.cardModal}>
          <View style={styles.card}>
            <Text style={{ fontSize: 16, color: '#000', fontWeight: "500" }}>Filter</Text>
            <View style={{ flexDirection: 'row', justifyContent:"center" }}>
              <View style={{ flex: 1 }}>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  style={styles.categoryDrop}
                  listMode="SCROLLVIEW"
                  dropDownContainerStyle={{
                    backgroundColor: "#fff",
                    borderColor: '#fff',
                    width:'90%',
                    marginTop:15
                  }}
                  placeholder='By Status'
                  onChangeValue={value => filterDataByStatus(value)}
                />
              </View>

              <View style={{ flex: 1 }}>
                <DropDownPicker
                  open={openArea}
                  value={valueArea}
                  items={areaList}
                  setOpen={setOpenArea}
                  setValue={setValueArea}
                  setItems={setItemsArea}
                  style={styles.categoryDrop}
                  listMode="SCROLLVIEW"
                  dropDownContainerStyle={{
                    backgroundColor: "#fff",
                    borderColor: '#fff',
                    width:'90%',
                    marginTop:15
                  }}
                  placeholder='By Area'
                  onChangeValue={value => filterDataByArea(value)}
                />
              </View>
            </View>


            <TouchableOpacity
              onPress={() => handleModalVisible()}
              style={styles.button}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>

          </View>


        </View>

      </Modal>
    </ScrollView>
  );
};

export default LatestComplaints;

const styles = StyleSheet.create({
  viewStatus: {
    borderRadius: 10,
    opacity: 0.6,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 20,
    borderColor:'#000',
    borderWidth:0.2

  },
  formTitle: {
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  statusButton: {
    width: '40%',
    alignItems: 'flex-start',

    marginTop: 10,
  },
  arrowIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 30,
    width: 30,
    borderRadius: 40,
    alignSelf: 'center',
  },
  collapseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    width:'40%',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    borderRadius: Platform.OS === 'android' ? 10 : 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#0fb482'
  },
  collapsibleText: {
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '47%',
    marginTop: 10,
    borderRadius: 5,
  },
  reloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#00A300',
    padding: 10,
    width: '30%',
    borderRadius: 5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: ThemeColor.backgroundLight,
    borderRadius: 10,
    // borderWidth:0.5,
    padding: 15,
    height: '30%',
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
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 8,
    borderRadius: 5,
  },
  categoryDrop: {
    backgroundColor: '#fff',
    width: '90%',
    borderWidth: 0,
    fontSize: 15,
    marginTop: 20
  }

});
