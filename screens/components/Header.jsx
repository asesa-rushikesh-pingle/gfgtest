import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform ,} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from "@react-native-community/blur";

import styles from '../Style'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header({setSafeAreaHeight}) {
  const nav = useNavigation()
  const inset = useSafeAreaInsets()

  const [branchName, setBranchName] = useState('')
  const [profileUrl, setProfileUrl] = useState('')

  useEffect(() => {
    checkStorage()
  

  }, [])

  async function checkStorage(){
    const value = await AsyncStorage.getItem('branch_name');
    const pic = await AsyncStorage.getItem('profile_pic_url');
    setBranchName(value)
    setProfileUrl(pic)
  } 
  
  return (
    <View 
    onLayout={(event) => {
     const { height } = event.nativeEvent.layout;
     setSafeAreaHeight(height);
   }}
   style={{position : 'absolute', top : 0, left : 0, right : 0, backgroundColor : 'rgba(255, 192, 203, 0)', zIndex : 2,overflow : 'hidden'}}>
     <BlurView
   style={styles.absolute}
   blurType="dark"
   blurAmount={1}
   // overlayColor="transparent" 
   // reducedTransparencyFallbackColor="white"
 />

  <View style={{paddingBottom : inset.top}}>
 
  </View>
  

    
     <View style={styles.headComp}>
       <View  style={styles.leftHead}>
         <Image source={require('../../assets/images/logo.png')} style={{width : 66, aspectRatio : 66/43 , height : undefined}}  />
         <Text style={styles.brachName}>GFG {'\n'}
         {branchName}</Text>
       </View>

        <TouchableOpacity onPress={()=>{
          // AsyncStorage.removeItem('authToken')
          nav.navigate('Profile')
        }}>
          {profileUrl ? 
          <Image source={{uri : profileUrl}} style={{width : 40, aspectRatio : 1 ,borderRadius : 50,borderColor : 'white', borderWidth : 1, height : undefined}}  />
          : 
          <Image source={require('../../assets/images/user.png')} style={{width : 40, aspectRatio : 1 , height : undefined}}  />
          }
        </TouchableOpacity>


     </View>
   </View>
  )
}