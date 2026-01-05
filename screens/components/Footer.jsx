import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform ,} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SafeAreaProvider,useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from "@react-native-community/blur";
import styles from '../Style'
import { useNavigation } from '@react-navigation/native';

export default function Footer({activeIndex = 1}) {
  const nav = useNavigation()
  const inset = useSafeAreaInsets() 
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
    <TouchableOpacity onPress={()=>{
      nav.navigate('ScanQr')
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