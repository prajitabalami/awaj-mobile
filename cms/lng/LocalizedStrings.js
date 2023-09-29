import LocalizedStrings from "react-native-localization";
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en'
import np from './np'

let strings = new LocalizedStrings({
    English:en,
    नेपाली:np
})

const changeLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('language');
      if (selectedLanguage) {
        strings.setLanguage(selectedLanguage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  export { strings, changeLanguage };