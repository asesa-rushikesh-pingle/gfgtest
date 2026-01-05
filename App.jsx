import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert ,} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from "@react-native-community/blur";

import LoginScreen from "./screens/LoginScreen"
import Home from "./screens/Home"
import CourseDetail from "./screens/CourseDetail"
import Profile from "./screens/Profile"
import EditProfile from "./screens/EditProfile"
import PsyReport from "./screens/PsyReport"
import HealthScreen from "./screens/HealthScreen"
import CourseInfo from "./screens/CourseInfo"
import Billing from "./screens/Billing"
import ScanQr from "./screens/ScanQr"
import MyWeapon from "./screens/MyWeapon"
import History from "./screens/History"
import HistoryDetails from "./screens/HistoryDetails"
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

import TitleBar from './screens/components/TitleBar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';



// const Stack = createNativeStackNavigator();
const Stack = createStackNavigator();



export default function App() {

  // const [qrString, setQrString] = useState('')
  // const [showCam, setShowCam] = useState(true)
  const [safeAreaHeight, setSafeAreaHeight] = useState(0)

  const [initialRoute, setInitialRoute] = useState(null); // null means loading


  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setInitialRoute('Home'); // Token found → go to Home
        } else {
          setInitialRoute('LoginScreen'); // No token → go to Login
        }
      } catch (e) {
        console.log('Error reading token:', e);
        setInitialRoute('LoginScreen');
      }
    };


      checkToken();
  }, []);


  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr', 'ean-13'],
  //   onCodeScanned: (codes) => {
  //     console.log(`Scanned ${codes.length} codes!`)
  //     if(codes.length > 0){
  //       setQrString( JSON.stringify(codes[0]))
  //       setShowCam(false)
  //     }
  //     console.log(codes)
  //     // Alert.alert(`scanned ${codes.length}`)
  //   }
  // })

  // const device = useCameraDevice('back')
  // const { hasPermission, requestPermission } = useCameraPermission()

  // useEffect(() => {
  //   requestPermission()
  // }, [])


  // if (!hasPermission) return <Text style={{color : 'white', fontSize  : 50}}>Request permission</Text>
  // if (device == null) return <Text style={{color : 'white', fontSize  : 50}}>Camera not found</Text>

  
  


//   return (
//     <View style={{flex : 1}}>

     

  
//   {showCam &&
//   <View style={{flex  : 1}}>
//      <TitleBar title={"Scan QR Code"} setSafeAreaHeight={setSafeAreaHeight}/>
//     <Text style={{position : 'absolute',zIndex : 20, bottom : 150, left : 20, right : 20 , textAlign : 'center', color : '#fff',fontWeight : '600', fontSize : 16}}>Place the QR code properly inside te area Scanning will start automatically</Text>
//    <Camera
//    style={StyleSheet.absoluteFill}
//    codeScanner={codeScanner}
//    device={device}
//    isActive={true}
//  />
//  </View>
//   }
   


//     {qrString &&
//         <View style={{marginTop : 100}}>
//         <Text style={{color : 'white', fontSize : 30}}>{qrString}</Text>
//         <TouchableOpacity onPress={()=>{
//           setQrString('')
//           setShowCam(true)
//         }} >
//           <Text style={{backgroundColor : 'red', color : 'white', fontSize : 20, borderRadius : 10, padding  : 20}}>Scan again</Text>
//         </TouchableOpacity>
//       </View>
//     }
     
    
//     </View>
//   )

  return (
    <SafeAreaProvider>

    <NavigationContainer >
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown : false,animation :'scale_from_center'}}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="PsyReport" component={PsyReport} />
    <Stack.Screen name="CourseDetail" component={CourseDetail} />
    <Stack.Screen name="Profile" component={Profile} />  
    <Stack.Screen name="EditProfile" component={EditProfile} />  
    <Stack.Screen name="HealthScreen" component={HealthScreen} />  
    <Stack.Screen name="CourseInfo" component={CourseInfo} />  
    <Stack.Screen name="Billing" component={Billing} />  
    <Stack.Screen name="ScanQr" component={ScanQr} />  
    <Stack.Screen name="MyWeapon" component={MyWeapon} />  
    <Stack.Screen name="History" component={History} />  
    <Stack.Screen name="HistoryDetails" component={HistoryDetails} />
    </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>

  )
}


