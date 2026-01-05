import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import TitleBar from './components/TitleBar';
import Footer from './components/Footer';
import DiaryTabs from './components/DiaryTabs';
import styles from './Style';
import { BlurView } from '@react-native-community/blur';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData, postFormData, postJSONData} from '../helper/callApi'
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pick, types } from "@react-native-documents/picker";
import TextInputComp from './components/TextInputComp';



export default function HealthScreen() {
     const [safeAreaHeight, setSafeAreaHeight] = useState(0);
     const [selectedImage, setSelectedImage] = useState(null);
     const [selectedFile, setSelectedFile] = useState(null)
     const [remoteUri, setRemoteUri] = useState('')





     const [pedingAmount, setPedingAmount] = useState(0)
     const [athleteInfo, setAthleteInfo] = useState('')

     const [isLoading, setIsLoading] = useState(false)


     const nav = useNavigation()

     const inset = useSafeAreaInsets() 


    const [height, setHeight] = useState('')
    const [Weight, setWeight] = useState('')
    const [suit, setSuit] = useState('')
    const [shueSize, setShueSize] = useState('')
    const [tshirtSize, setTshirtSize] = useState('')
    const [bloodGroup, setBloodGroup] = useState('')


     

    

   const [toggler, setToggler] = useState(false)

     useEffect(() => {
      const controller = new AbortController();
      getProfileFn(controller)
      return ()=>{
        controller.abort();
      }
    }, [toggler])
   
    
    async function getProfileFn(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/profile',{},controller)
      if(respo.status){
        // setCourseObj(respo.data.course)
        console.log("profile info", respo)
        setHeight(respo.data.athlete.height)
        setWeight(respo.data.athlete.weight)
        setSuit(respo.data.athlete.suit)
        setTshirtSize(respo.data.athlete.tshirt_size)
        setShueSize(respo.data.athlete.shoe_size)
      }
    }

  

  

   

      async function saveInfoFn() {
        setIsLoading(true)
        
        const branch = await AsyncStorage.getItem('branch_slug')
       

        let payload = { 
          "suit": suit,
          "shoe_size":shueSize,
          "tshirt_size": tshirtSize,
          "blood_group": bloodGroup,
          "height": height,
          "weight": Weight
      }


        const respo = await postJSONData(branch,`/athlete/make-update-health-profile-request`,payload)
      
        if(respo?.status){
          setIsLoading(false)
          Alert.alert('Approval Sent Successfully','Please wait for sometime, Admin will approve your request')
        }
      }

  return (
    <View style={styles.parentWrapper}>
    <TitleBar title={"Health Info"} setSafeAreaHeight={setSafeAreaHeight}/>
      <ScrollView style={{paddingTop : safeAreaHeight}}>

       


                <View style={{paddingHorizontal : 16, marginBottom : 16}}>
                <TextInputComp placeholder={'Height'} style={{marginHorizotal : 16}} state={height} setState={setHeight}/>
                <TextInputComp placeholder={'Weight'} style={{marginHorizotal : 16}} state={Weight} setState={setWeight}/>
                <TextInputComp placeholder={'Suit'} style={{marginHorizotal : 16}} state={suit} setState={setSuit}/>
                <TextInputComp placeholder={'Shoe Size'} style={{marginHorizotal : 16}} state={shueSize} setState={setShueSize}/>
                <TextInputComp placeholder={'T - Shirt Size'} style={{marginHorizotal : 16}} state={tshirtSize} setState={setTshirtSize}/>
                </View>
                {/* <RNPickerSelect
                  onValueChange={(value) => setMaritalStatus(value)}
                  useNativeAndroidPickerStyle={false}
                  items={[
                    {
                      label : 'Married',
                      value : 'Married'
                    },
                    {
                      label : 'Unmarried',
                      value : 'Unmarried'
                    }
                  ]}
                >
                      <View style={{paddingHorizontal : 16, }}>
                        <View style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 16, backgroundColor : '#202020', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
                            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{[
                        {
                          label : 'Married',
                          value : 'Married'
                        },
                        {
                          label : 'Unmarried',
                          value : 'Unmarried'
                        }
                      ]?.find((it)=> it.value == maritalStatus)?.label || 'Choose Shoe Size'}</Text>
                            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../assets/images/donArrr.png')}/>
                        </View> 
                        </View>
                </RNPickerSelect> */}
                
                

         

         
          
                
       


        

            <View style={{marginBottom : 400}}></View>
            

       


     </ScrollView>
     <View>
      <TouchableOpacity onPress={()=>{
        if(!isLoading){
          saveInfoFn()
        }
            }} style={{marginTop : 16, paddingHorizontal : 16, marginBottom : inset.bottom + 10}}>
            <Text style={{textAlign : 'center', padding : 10 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}> {isLoading ? 'Saving...' : 'Save'} </Text>
      </TouchableOpacity>
     </View>
  </View>
  )
}


const stylesNew = StyleSheet.create({
  profilesection: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  userSection: {
    borderRadius: 16,
    borderColor: '#383838',
    borderWidth: 0.25,
    padding: 16,
    flexDirection: 'row',
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 26,
  },
  photoConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userPhoto: {
    borderColor: '#fff',
    borderWidth: 1.5,
    borderRadius: 50,
    overflow: 'hidden',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#EB6925',
    paddingBottom: 7,
  },
  userContactnumber: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#fff',
    paddingBottom: 7,
  },
  approvedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  approvedText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 22,
    color: '#2BA750',
  },
  billingSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#202020',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  billingConatiner: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  billingpayment: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff',
  },
  pendingAmount: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#A8A8A8',
    paddingTop: 3,
  },
  amountPending: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#E0B519',
  },
  appVersion: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 22,
    color: '#A8A8A8',
    paddingBottom: 26,
    paddingTop: 10,
    textAlign: 'center',
  },
});
