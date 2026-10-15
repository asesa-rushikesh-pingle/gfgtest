import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform ,Button,PermissionsAndroid,Alert} from 'react-native'
import React, {useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { SafeAreaProvider,useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from "@react-native-community/blur";
import styles from '../Style'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Geolocation from 'react-native-geolocation-service';

export default function Footer({activeIndex = 1}) {
  const nav = useNavigation()
  const inset = useSafeAreaInsets() 
  const [location, setLocation] = useState(null);


  useEffect(() => {
    getCurrentLocation()
  
    return () => {
      
    }
  }, [])
  

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Location permission is required.');
          return;
        }
      } else {
        const authorization =
          await Geolocation.requestAuthorization('whenInUse');

        if (authorization !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required.');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;

          setLocation({latitude, longitude});

          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);
        },
        error => {
          console.log('Location error:', error.code, error.message);
          Alert.alert('Location Error', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
          showLocationDialog: true,
        },
      );
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const isWithinBranchRadius = async (currentLat, currentLong) => {
    try {
      const branchLat = parseFloat(await AsyncStorage.getItem('lat'));
      const branchLong = parseFloat(await AsyncStorage.getItem('long'));
  
      if (
        !Number.isFinite(branchLat) ||
        !Number.isFinite(branchLong) ||
        !Number.isFinite(currentLat) ||
        !Number.isFinite(currentLong)
      ) {
        return false;
      }
  
      const toRadians = degree => (degree * Math.PI) / 180;
      const earthRadiusKm = 6371;
  
      const dLat = toRadians(currentLat - branchLat);
      const dLong = toRadians(currentLong - branchLong);
  
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(branchLat)) *
          Math.cos(toRadians(currentLat)) *
          Math.sin(dLong / 2) ** 2;
  
      const distance = 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
  
      return distance <= 1;
    } catch (error) {
      console.log('Location check error:', error);
      return false;
    }
  };


  return (
    
    <View style={{ position : 'absolute', bottom : 0, left : 0, right : 0, backgroundColor : 'rgba(255, 192, 203, 0)',overflow : 'hidden', zIndex : 1}}>
    <BlurView
    style={styles.absolute}
    blurType="dark"
    blurAmount={3}
    // reducedTransparencyFallbackColor="white" 
  />
  <View style={{paddingVertical : 10, paddingHorizontal : 20, flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
    <TouchableOpacity onPress={()=>{
       nav.navigate('Home')
    }}>
    <Image source={require('../../assets/images/homeico.png')} style={{ tintColor :  activeIndex == 1  ?  '#EB6925' : '#959595', width : 37, aspectRatio : 1 , height : undefined,objectFit : 'contain', borderBottomWidth : 2, borderBottomColor : true ?  '#EB6925' : 'transparent', paddingBottom : 2}}  />
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>{
         nav.navigate('History')
    }}>
    <Image source={require('../../assets/images/dico.png')} style={{ tintColor :  activeIndex == 2  ?  '#EB6922' : '#929595', width : 37, aspectRatio : 1 , height : undefined,objectFit : 'contain', borderBottomWidth : 2, borderBottomColor : false ?  '#EB6925' : 'transparent', paddingBottom : 2}}  />
    </TouchableOpacity>
    <TouchableOpacity onPress={async ()=>{

      if(!location){
        Alert.alert('Allow location to perform this action')
        return
      }

        const isNearby = await isWithinBranchRadius(
          location.latitude,
          location.longitude,
        );

        if (isNearby) {
          // console.log('User is within 1 km of the branch');
          // Alert.alert('User is within 1 km of the branch')
          nav.navigate('ScanQr')
        } else {
          // console.log('User is outside the branch radius');
          Alert.alert('User is outside the branch location')
        }
        // nav.navigate('ScanQr')


    }}>
       
      <View style={{alignItems : 'center',justifyContent : 'center', padding : 14, backgroundColor : '#383838', borderRadius : 30}}>
    <Image source={require('../../assets/images/qrico.png')} style={{ tintColor :  false ?  '#EB6925' : '#fff', width : 32, aspectRatio : 1 , height : undefined,objectFit : 'contain'}}  />
      </View>
    </TouchableOpacity>
    <TouchableOpacity>
    <Image source={require('../../assets/images/achicoo.png')} style={{ tintColor :  false ?  '#EB6925' : '#959595', width : 37, aspectRatio : 1 , height : undefined,objectFit : 'contain', borderBottomWidth : 2, borderBottomColor : false ?  '#EB6925' : 'transparent', paddingBottom : 2}}  />
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>{
      // nav.navigate('MyWeapon')
    }}>
    <Image source={require('../../assets/images/settico.png')} style={{ tintColor :  false ?  '#EB6925' : '#959595', width : 37, aspectRatio : 1 , height : undefined,objectFit : 'contain', borderBottomWidth : 2, borderBottomColor : false ?  '#EB6925' : 'transparent', paddingBottom : 2}}  />
    </TouchableOpacity>

  </View>
  {/* <Text style={{color : 'white', fontSize : 30}}>Footer  {safeAreaHeight}  Section weh sdhfb sdfhbsd  here</Text> */}
  
      <View style={{paddingBottom : inset.bottom}}>

      </View>

   </View>
  )
}