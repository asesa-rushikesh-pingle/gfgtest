import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import TitleBar from './components/TitleBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {postJSONData} from '../helper/callApi'
import { useIsFocused } from '@react-navigation/native'

export default function ScanQr({navigation,route}) {
      const [qrString, setQrString] = useState('')
  const [showCam, setShowCam] = useState(true)
    const [safeAreaHeight, setSafeAreaHeight] = useState(0)

    
    const { isScaLane } = route.params || {};

    const [isScanned, setisScanned] = useState(false)

    const isFocused = useIsFocused();


    useEffect(() => {
      setisScanned(false)
      return () => {
        setisScanned(false) 
      }
    }, [isFocused])
    
  
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
     
      if(isScanned){
        return
      }
      // Alert.alert('code scanned')
      setisScanned(true)
      console.log(`Scanned ${codes.length} codes!`)
      if(codes.length > 0){
        // setQrString(JSON.stringify(codes[0]))
        checkinFn(codes[0]?.value)
       
        // setShowCam(false)
      }
      console.log(codes)
      // Alert.alert(`scanned ${codes.length}`)
    }
  })

  async function checkinFn(scanedJson) {
    const branch = await AsyncStorage.getItem('branch_slug')

    let input = JSON.parse(scanedJson)
    let uri = ''
    if(input.branch_slug){
      uri = '/athlete/general-qr-login'
      if(input.branch_slug !== branch){
        Alert.alert('Failed to scan the QR')
        navigation.navigate('CourseDetail')
        return
      }
    }else if (input.url && isScaLane){
      uri = input.url
      console.log(uri)
    }else{
      //  uri = '/athlete/general-qr-login'
      Alert.alert('Failed to scan the QR')
      navigation.navigate('CourseDetail')
      return
    }
  
    let athleteCourseIddd = await AsyncStorage.getItem('athleteCourseIdForGeneralCheckin')
    const respo = await postJSONData(branch,uri,{
      "athlete_course_id": Number(athleteCourseIddd),
    })

    console.log(respo)
  
    if(respo.status){
      navigation.navigate('CourseDetail')
    }
  }

  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()

  useEffect(() => {
    requestPermission()
  }, [])

  async function ask() {
    Linking.openSettings();
  }


  if (!hasPermission) return  <View style={{flex : 1, backgroundColor : 'black', alignItems : 'center',justifyContent : 'center'}}> <TouchableOpacity onPress={()=>{ask()}}> <Text style={{color : 'white',opacity : .5, fontSize  : 14}}>Allow Camera Permission</Text> </TouchableOpacity></View>
  if (device == null) return <Text style={{color : 'white', fontSize  : 50}}>Camera not found</Text>
    return (
    <View style={{flex : 1}}>

     

  
  {showCam &&
  <View style={{flex  : 1}}>
     <TitleBar title={"Scan QR Code"} setSafeAreaHeight={setSafeAreaHeight}/>
    <Text style={{position : 'absolute',zIndex : 20, bottom : 150, left : 20, right : 20 , textAlign : 'center', color : '#fff',fontWeight : '600', fontSize : 16}}>Place the QR code properly inside the area Scanning will start automatically</Text>
   <Camera
   style={StyleSheet.absoluteFill}
   codeScanner={codeScanner}
   device={device}
   isActive={true}
 />
 </View>
  }
   


    {qrString &&
        <View style={{marginTop : 100}}>
        <Text style={{color : 'white', fontSize : 30}}>{qrString}</Text>
        <TouchableOpacity onPress={()=>{
          setQrString('')
          setShowCam(true)
        }} >
          <Text style={{backgroundColor : 'red', color : 'white', fontSize : 20, borderRadius : 10, padding  : 20}}>Scan again</Text>
        </TouchableOpacity>
      </View>
    }
     
    
    </View>
  )
}