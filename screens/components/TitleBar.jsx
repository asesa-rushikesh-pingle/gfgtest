import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform ,} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from "@react-native-community/blur";

import styles from '../Style'
import { useNavigation } from '@react-navigation/native';

export default function TitleBar({title,setSafeAreaHeight}) {
  const nav = useNavigation()
  const inset = useSafeAreaInsets()
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
   
   
     <View style={[styles.headComp,{paddingTop : inset.top + 10}]}>
      <TouchableOpacity onPress={()=>{nav.goBack()}}>
      <Image source={require('../../assets/images/backBtn.png')} style={{width : 24, aspectRatio : 1 , height : undefined}}  />
      </TouchableOpacity>
      <Text style={styles.pageBarTitle}>{title ? title : "Daily Training Details"}</Text>
      <TouchableOpacity>
      <Image source={require('../../assets/images/iico.png')} style={{width : 32, aspectRatio : 1 , height : undefined}}  />
      </TouchableOpacity>


     </View>
   </View>
  )
}