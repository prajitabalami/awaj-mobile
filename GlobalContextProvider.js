import React, { createContext, useState, useEffect } from 'react';
import {
    
    View, Image, Button, FlatList, VirtualizedList, Alert, TouchableOpacity, Dimensions, Platform
  } from 'react-native';
  
  
  import { ThemeColor } from '../../ThemeColor'
  import { BaseUrl } from './BaseUrl';
  

  import axios from 'axios';

const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const [glist, setgList] = useState([]);
  const [areaList, setAreaList] = useState([]);


  const updategList = (value) => {
    setgList(value);
    
  };

  useEffect(() => {
   
        getAllPublicComplaints()
        getAreas()
    

  }, [])

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
        setAreaList(data.data.map(type => ({ label: type.type, value: type.type })));
       


    } catch (error) {
        console.log(error);
    }
}



  const getAllPublicComplaints = async () => {
    
    let config = {
      headers: {

        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',

      }
    }
    try {
      const data = await axios.get(BaseUrl.BaseUrl + 'allPublicComplaints');
      console.log("Requestssss dataaaaa", data.data)
    //   setspinner(false)
    //   setData(data.data)
    //   setFilteredData(data.data)
    setgList(data.data)

    } catch (error) {
      console.log(error);
    //   setspinner(false)
      Alert.alert("Something went wrong. Please check your Internet Connection!")
    }

  }


  return (
    <GlobalContext.Provider value={{glist, updategList, areaList}}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;