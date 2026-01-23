import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform, Dimensions, Button, Modal, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from '@react-native-async-storage/async-storage';


import {baseUrl} from '../constants/variables'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import Tts from 'react-native-tts';



export default function LoginScreen() {


    const nav = useNavigation()

    const inset = useSafeAreaInsets()
    



    const [otpTime, setOtpTime] = useState(30)

    const [isotpSent, setIsotpSent] = useState(false)

    const [moNum, setMoNum] = useState('')

    const [otpText, setOtpText] = useState('')


    const [modalVisible, setModalVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false)
    const scrollViewRef = useRef(null);
    const [innputText, setInnputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([
       
       
    ])



    useEffect(() => {
        // checkUserTokekn()
    }, [])

    async function checkUserTokekn() {
        let token = await AsyncStorage.getItem('authToken')
        if(token){
            nav.navigate('Home')
        }
    }
    


    useEffect(() => {

        const timerr = setInterval(() => {
                if(otpTime > 0){
                setOtpTime(s=>s-1)
            }
        }, 1000);
      
       
    
      return () => {
        clearInterval(timerr)
      }
    }, [otpTime])

    async function veryOtpfn(txt) {
     

        try {

            let payload ={
                "mobile_no": moNum,
                "otp": txt
            }

            const res = await fetch(`${baseUrl}/auth/verify-otp`,{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',

                },
                body : JSON.stringify(payload)
            })

            const data = await res.json()
            if(data.status){
                setIsotpSent(false)
                setOtpTime(0)

                await AsyncStorage.setItem('authToken', data.data.authToken);
                if(data.data.profile_pic_url){
                    await AsyncStorage.setItem('profile_pic_url', data.data.profile_pic_url);
                }
                await AsyncStorage.setItem('first_name', data.data.first_name);
                await AsyncStorage.setItem('last_name', data.data.last_name);
                await AsyncStorage.setItem('branch_name', data.data.branches[0].branch_name);
                await AsyncStorage.setItem('branch_slug', data.data.branches[0].branch_slug);
                nav.replace('Home');
                // data.data.authToken


            }else{
                Alert.alert(data.message)
            }
            
        } catch (error) {
            console.log(error)
            Alert.alert('Something went wrong!')
            
        }
        
        
    }
    async function sendOtpFn() {
        if(moNum.length == 10){

        }else{
            Alert.alert('Oops!','Please enter mobile number')
            return
        }
       

        try {

            let payload ={
                  "mobile_no": moNum
            }

            const res = await fetch(`${baseUrl}/auth/send-otp`,{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',

                },
                body : JSON.stringify(payload)
            })

            const data = await res.json()
            if(data.status){
                setIsotpSent(true)
                setOtpTime(30)

                setOtpText(data.data.otp)

            }else{
                Alert.alert(data.message)
            }
            
        } catch (error) {
            console.log(error)
            Alert.alert('Something went wrong!',String(error))
            
        }
        
        
    }

    // async function getSummaryDataFn() {
    //     const formData = new FormData();
    //     formData.append('start_date', '2024-01-01');
    //     formData.append('end_date', '2025-01-01');
    //     try {
    //       const res = await fetch(`${'https://hubshooting.com/api/api'}/ios/report/state`, {
    //         // const res = await fetch(`https://hubshooting.com/api/api/get-product-list`,{
    //         method: 'POST',
    //         headers: {
    //           // 'Content-Type': 'application/json',
    //           Accept: 'application/json',
    //         },
    //         body: formData,
    //       });
    //       console.log(res);
    //       const data = await res.json();
    //       if (data.status) {
    //         Alert.alert('Api called successfully')
    //       } else {
    //         Alert.alert(data.message);
    //       }
    //     } catch (error) {
    //       Alert.alert('Something went wrong',String(error));
    //       console.log(error);
    //     }
    //   }

    useEffect(() => {
        // Auto scroll to bottom when messages change
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, [messages,isTyping]);


      async function callGemini(innputText) { 
        setIsTyping(true)
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${'AIzaSyDG99sMgK-sSHjBo9salhCw7UEPJArrPpY'}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: innputText }],
                },
              ],
            }),
          }
        );

        const data = await response.json();

        console.log(data?.candidates[0]?.content?.parts[0]?.text)

        setIsTyping(false)

        setMessages(msgs=>{
            return [...msgs,  {
                message : data?.candidates[0]?.content?.parts[0]?.text || 'simething went wrong',
                isRobot : true
            }]
        })
        if(data?.candidates[0]?.content?.parts[0]?.text){

            // Tts.speak(data?.candidates[0]?.content?.parts[0]?.text);
        }

    }
    

  return (
    <View style={{flex : 1, backgroundColor : 'black'}} > 
  <ScrollView 
    //   showsVerticalScrollIndicator={false}
    //   keyboardShouldPersistTaps="handled"
    //   keyboardDismissMode="interactive" 
    showsVerticalScrollIndicator={false}
    
    >
       

     
    <View style={{height :  Dimensions.get('window').height}}>
     
        <View style={{height  : 220, alignItems  : 'center', justifyContent : 'center'}}>
            <Image source={require('../assets/images/logImage.png')} style={{width : 130, height : undefined, aspectRatio  : 292/191}}/>
        </View>
        <View style={{flex : 1, borderRadius : 40, backgroundColor : '#202020', borderBottomLeftRadius : 0, borderBottomRightRadius : 0, paddingHorizontal : 16, paddingVertical : 50}}>
            <Text style={{color : 'white', textAlign : 'center', fontSize : 20, lineHeight : 22, fontWeight : '700'}}>Welcome Back</Text>
            {otpText && <Text style={{color : 'white', textAlign : 'center', fontSize : 20, lineHeight : 22, fontWeight : '700'}}>{otpText}</Text>}
            <Text style={{color : 'white', textAlign : 'center', fontSize : 14, lineHeight : 22, fontWeight : '400', marginTop : 7}}>Enter your details below</Text>
            <TextInput 
            value={moNum}
            maxLength={10}
            onChangeText={(val)=>{
                setMoNum(val)
            }}
            autoFocus={true}
            style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 10, borderWidth : .5,marginTop : 20,borderColor : '#A8A8A8', color : 'white', fontSize : 16, fontWeight : '500'}}
            placeholderTextColor={'#A8A8A8'}
            keyboardType='phone-pad'
            placeholder='Enter Mobile Number'
             />

             {isotpSent &&
                <View>
                <OtpInput numberOfDigits={6}  
            //   placeholder="******"
              onFilled={(text) => {
                veryOtpfn(text)
            }}

            theme={{
                containerStyle: { marginTop : 16},
                pinCodeContainerStyle: {borderColor  : '#A8A8A8', borderWidth : .5, borderRadius : 10},
                pinCodeTextStyle: {color : '#A8A8A8', },
                focusStickStyle: {color : 'red', backgroundColor : '#EB6925'},
                focusedPinCodeContainerStyle: {borderColor : '#EB6925'},
                // placeholderTextStyle: styles.placeholderText,
                filledPinCodeContainerStyle: { backgroundColor : '#383838',color : 'white'},
              }}
                onTextChange={(text) => console.log(text)} />
                <View style={{flexDirection : 'row', alignItems : 'center', columnGap : 10,justifyContent :'center', marginTop : 16}}>
                    <Text style={{color : '#A8A8A8', fontSize : 16, fontWeight : '500', }}>Time : {otpTime} Sec </Text> <TouchableOpacity onPress={()=>{
                sendOtpFn()
             }}><Text style={{color : '#EB6925', fontSize : 16, fontWeight : '500',}}>Resend OTP</Text></TouchableOpacity>
                </View>
                </View>
             }

         
            
                


             {!isotpSent &&
               <TouchableOpacity style={{marginTop : 26}} onPress={()=>{
                sendOtpFn()
                // getSummaryDataFn()
             }}>
                <Text style={{backgroundColor : '#EB6925', borderRadius : 10, textAlign : 'center', padding : 10, color : 'white', fontSize : 16, fontWeight : '600', lineHeight : 22}}>Verify</Text>
             </TouchableOpacity>
             }
           

           
        </View>


        <Button title='hieee'  onPress={()=>{
setModalVisible(true)
}}>

</Button>
<View style={{height : 50}}></View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={{backgroundColor : '#343541', flex : 1}}>
            <View style={styles.headChatCom}>
                   <TouchableOpacity style={{flexDirection : 'row', columnGap : 10, alignItems :'center'}}>
                   <Image style={{aspectRatio : 1, width : 16, height : undefined, objectFit : 'contain'}} source={require('../assets/images/barrow.png')} /> 
                   <Text style={{color : 'white', fontSize : 16, fontWeight : '600'}}>Back</Text>
                    </TouchableOpacity> 
                   <Image style={{aspectRatio : 1, width : 20, height : undefined, objectFit : 'contain'}} source={require('../assets/images/chatGpt.png')} /> 
                   
            </View>
            <View style={styles.chatComp}>

                {messages?.length == 0 ? <View style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                    <Text style={{color : 'white', fontSize  : 16, color : 'grey', fontWeight : '600'}}>Ask anything, get yout answer</Text>
                </View> : 
                <View style={{flex : 1}}>
                    <ScrollView
                      ref={scrollViewRef}
                     contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "flex-end",
                        paddingBottom: 100,
                      }}
                    >
                        {messages?.map((msg,msgIndex)=>{
                            return(
                                <View key={msgIndex} style={{alignItems : msg?.isRobot ? 'flex-start': 'flex-end',marginTop : 20,marginHorizontal  : 20}}>
                                <Text style={{color : 'white', fontSize : 16, fontWeight : '600', maxWidth : 267, padding : 12, backgroundColor : msg?.isRobot ? '#5d5d67': '#11a37f', borderRadius : 12, borderBottomRightRadius : msg?.isRobot ? 12 : 0,borderBottomLeftRadius : msg?.isRobot ? 0 : 12}}>
                                {msg?.message}
                                </Text>
                            </View>
                            )
                        })} 

                           {isTyping &&

                            <View  style={{alignItems : true ? 'flex-start': 'flex-end',marginTop : 20,marginHorizontal  : 20}}>
                            <Text style={{color : 'white', fontSize : 16, fontWeight : '600', maxWidth : 267, padding : 12, backgroundColor : true ? '#5d5d67': '#11a37f', borderRadius : 12, borderBottomRightRadius : true ? 12 : 0,borderBottomLeftRadius : true ? 0 : 12}}>
                            Typing...
                            </Text>
                            </View>
                           
                           } 
                       
                    </ScrollView>

                </View> }

            <View style={styles.inboxo}>
                <TextInput value={innputText} onChangeText={(val)=>{setInnputText(val)}} style={styles.textInnpt} placeholder='Ask GFG Ai' />
                <TouchableOpacity style={{position : 'absolute', top : 7, right : 7}} onPress={()=>{
                    if(innputText){

                        setInnputText('')

                        callGemini(innputText)
                        
                        setMessages(msgs=>{
                            return [...msgs,  {
                                message : innputText,
                                isRobot : false
                            }]
                        })
                    }else{
                         
                    }
                   
                }}>
                <Image style={{aspectRatio : 1, width : 36, height : undefined, objectFit : 'contain'}} source={require('../assets/images/plane.png')} /> 
                </TouchableOpacity>
                {/* <TouchableOpacity style={{position : 'absolute', top : -100, right : 7}} onPress={()=>{
                  
                   
                }}>
                <Image style={{aspectRatio : 1, width : 36, height : undefined, objectFit : 'contain'}} source={require('../assets/images/plane.png')} /> 
                </TouchableOpacity> */}
            </View>
            </View>
           
          </View>
        </Modal>

    </View>


   

      
        
    </ScrollView>
        

    </View>
  )
}


const styles = StyleSheet.create({
    headChatCom : {
        alignItems : 'center',
        justifyContent : 'space-between',
        flexDirection : 'row',
        padding : 20,
        borderBottomWidth : .5,
        borderBottomColor : 'white'
    },
    chatComp : {
         flex : 1,
         position : 'relative'
    },
    inboxo:{

        position : 'absolute', bottom : 20, left : 20, right : 20

    },
    textInnpt :{
        backgroundColor : '#484954',
        color : 'white',

        borderRadius : 10, 
        borderColor : 'white', 
        borderWidth : .5,
        height : 50,
        padding : 10,
        color : 'white',
        fontSize : 16, 
        fontWeight : '600'
    }
})