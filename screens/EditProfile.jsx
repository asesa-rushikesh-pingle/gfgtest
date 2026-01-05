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



export default function EditProfile() {
     const [safeAreaHeight, setSafeAreaHeight] = useState(0);
     const [selectedImage, setSelectedImage] = useState(null);
     const [selectedFile, setSelectedFile] = useState(null)
     const [remoteUri, setRemoteUri] = useState('')





     const [pedingAmount, setPedingAmount] = useState(0)
     const [athleteInfo, setAthleteInfo] = useState('')

     const [isLoading, setIsLoading] = useState(false)


     const nav = useNavigation()

     const inset = useSafeAreaInsets() 


     const [firstName, setFirstName] = useState('')
     const [lastName, setLastName] = useState('')
     const [maritalStatus, setMaritalStatus] = useState('')
     const [dob, setDob] = useState('')
     const [gender, setGender] = useState('')
     const [phoneNo, setPhoneNo] = useState('')
     const [alternetNo, setAlternetNo] = useState('')
     const [emailId, setEmailId] = useState('')
     const [placeOfWork, setPlaceOfWork] = useState('')
     const [designnation, setDesignnation] = useState('')
     const [bloodGroup, setBloodGroup] = useState('')
     const [resAddressOne, setResAddressOne] = useState('')
     const [resAddressTwo, setResAddressTwo] = useState('')
     const [resCity, setResCity] = useState('')
     const [resZipCode, setResZipCode] = useState('')
     const [perAddressOne, setPerAddressOne] = useState('')
     const [perAddressTwo, setPerAddressTwo] = useState('')
     const [perCity, setPerCity] = useState('')
     const [perZipCode, setPerZipCode] = useState('')
     const [fileTitle, setFileTitle] = useState('')

     const [remoteFiles, setRemoteFiles] = useState([])

     

    

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
        setAthleteInfo(respo.data.athlete)
        setRemoteFiles(respo.data.doc) 
        setFirstName(respo.data.athlete.first_name)
        setLastName(respo.data.athlete.last_name)
        setDob(respo.data.athlete.date_of_birth)
        setGender(respo.data.athlete.gender)
        setPhoneNo(respo.data.athlete.mobile_no)
        setAlternetNo(respo.data.athlete.contact_no)
        setEmailId(respo.data.athlete.email)
        setPlaceOfWork(respo.data.athlete.work_place)
        setDesignnation(respo.data.athlete.desgination)
        setBloodGroup(respo.data.athlete.blood_group)
        setRemoteUri(respo.data.athlete.profile_pic_url)
        setResAddressOne(respo.data.residentAddress.address_line_1)
        setResAddressTwo(respo.data.residentAddress.address_line_2)
        setResCity(respo.data.residentAddress.city)
        setResZipCode(respo.data.residentAddress.pin_code)
        setPerAddressOne(respo.data.permanantAddress.address_line_1)
        setPerAddressTwo(respo.data.permanantAddress.address_line_2)
        setPerCity(respo.data.permanantAddress.city)
        setPerZipCode(respo.data.permanantAddress.pin_code)
        setMaritalStatus(respo.data.athlete.married ? 'Married' : 'Unmarried')
      }
    }

    async function dltFileFnn(idd) {

       
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await postJSONData(branch,'/athlete/profile/delete-profile-document-request',{
        "athlete_document_id": idd,
      })
    
      if(respo.status){
        setToggler(s=>!s)
        Alert.alert('Approval Sent Successfully','Please wait for sometime, Admin will approve your request')
      }
    }

    const pickImage = async () => {
      // Alert.alert('picking')
      try {
        const result = await pick({
          allowMultiSelection: false,
          mode: 'open',
          type: [types.images],
        })

        console.log(result)
  
        if (result && result.length > 0) {
          const file = result[0];
  
          console.log("Picked File:", file);
  
          // file.assetCopyUri → safe local path (best for Image)
          setSelectedImage(file);
          setRemoteUri('')
        }
      } catch (e) { 
        if (e.code === "DOCUMENT_PICKER_CANCELED") {
          console.log("User cancelled");
          return;
        }
        console.log("Error:", e);
      }
    };

    const pickFile = async () => {
      // Alert.alert('picking')
      try {
        const result = await pick({
          allowMultiSelection: false,
          mode: 'open',
          type: [types.images,types.pdf],
        })

        console.log("result",result)
  
        if (result && result.length > 0) {
          const file = result[0];
  
          console.log("Picked File:", file);
  
          // file.assetCopyUri → safe local path (best for Image)
          setSelectedFile(file);
        }
      } catch (e) { 
        if (e.code === "DOCUMENT_PICKER_CANCELED") {
          console.log("User cancelled");
          return;
        }
        console.log("Error:", e);
      }
    };

      async function saveInfoFn() {
        if(selectedFile){
          if(!fileTitle){
            Alert.alert('Please enter file title')
            return
          }
        }
        const branch = await AsyncStorage.getItem('branch_slug')
        let formData = new FormData()
        formData.append("first_name", firstName);
        formData.append("last_name",lastName);
        formData.append("email", emailId);
        formData.append("mobile_no", phoneNo);
        formData.append("contact_no", alternetNo);
        formData.append("married", maritalStatus == 'Married' ? 1 : 0);
        formData.append("date_of_birth", dob);
        formData.append("gender", gender);
        formData.append("work_place", placeOfWork);
        formData.append("desgination", designnation);
        formData.append("blood_group", bloodGroup);
        formData.append("address_line_1", resAddressOne);
        formData.append("address_line_2", resAddressTwo);
        formData.append("city", resCity);
        formData.append("pin_code", resZipCode);
        formData.append("permanant_address_line_1", perAddressOne);
formData.append("permanant_address_line_2", perAddressTwo);
formData.append("permanant_city", perCity);
formData.append("permanant_pin_code", perZipCode);
        if(selectedImage){
          formData.append("profile_pic", selectedImage);
        }
        console.log(selectedFile)
        if(selectedFile && fileTitle){
          formData.append("doc_files[0]", selectedFile);
          formData.append("doc_types[0]", fileTitle);

        }


        const respo = await postFormData(branch,`/athlete/profile/update-profile-request`,formData,setIsLoading)
      
        if(respo?.status){
          setIsLoading(false)
          setFileTitle('')
          setSelectedFile(null)
          Alert.alert('Approval Sent Successfully','Please wait for sometime, Admin will approve your request')
        }
      }

  return (
    <View style={styles.parentWrapper}>
    <TitleBar title={"Edit Profile"} setSafeAreaHeight={setSafeAreaHeight}/>
      <ScrollView style={{paddingTop : safeAreaHeight}}>

        <View style={{paddingHorizontal : 16}}>
           <View style={{alignItems : 'center',marginTop : 37}}>
            <TouchableOpacity onPress={()=>{
              pickImage()
            }} style={{position : 'relative'}}>
              {remoteUri ?
            <Image source={{uri : remoteUri}}  style={{width : 100, height : undefined,
              aspectRatio : 1, borderWidth : 2, borderRadius : 100, borderColor : 'white'
            }} /> :
            <Image source={{uri : selectedImage?.uri}}  style={{width : 100, height : undefined,
              aspectRatio : 1, borderWidth : 2, borderRadius : 100, borderColor : 'white'
            }} />
              }
            <Image source={require('../assets/icons/eicon.png')}  style={{width : 20, height : undefined,
              aspectRatio : 1, position : 'absolute', top : 40, left : 40
            }} />
            </TouchableOpacity>
            
           </View>

        </View>


                <View style={{paddingHorizontal : 16, marginBottom : 16}}>
                <TextInputComp placeholder={'First Name'} style={{marginHorizotal : 16}} state={firstName} setState={setFirstName}/>
                <TextInputComp placeholder={'Last Name'} style={{marginHorizotal : 16}} state={lastName} setState={setLastName}/>
                </View>
                <RNPickerSelect
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
                      ]?.find((it)=> it.value == maritalStatus)?.label || 'Choose Marital Status'}</Text>
                            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../assets/images/donArrr.png')}/>
                        </View> 
                        </View>
                </RNPickerSelect>
                <View style={{paddingHorizontal : 16, marginBottom : 16}}>
                <TextInputComp placeholder={'Date Of Birth (YYYY-MM-DD)'} style={{marginHorizotal : 16}} state={dob} setState={setDob}/>
                </View>
                <RNPickerSelect
                  onValueChange={(value) => setGender(value)}
                  useNativeAndroidPickerStyle={false}
                  items={[
                    {
                      label : 'Male',
                      value : 'Male'
                    },
                    {
                      label : 'Female',
                      value : 'Female'
                    },
                    {
                      label : 'Other',
                      value : 'Other'
                    }
                  ]}
                >
                      <View style={{paddingHorizontal : 16, }}>
                        <View style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 16, backgroundColor : '#202020', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
                            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{[
                        {
                          label : 'Male',
                          value : 'Male'
                        },
                        {
                          label : 'Female',
                          value : 'Female'
                        },
                        {
                          label : 'Other',
                          value : 'Other'
                        }
                      ]?.find((it)=> it.value == gender)?.label || 'Choose Gender'}</Text>
                            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../assets/images/donArrr.png')}/>
                        </View> 
                        </View>
                </RNPickerSelect>
                <View style={{paddingHorizontal : 16, marginBottom : 16}}>
                <TextInputComp placeholder={'Mobile No'} style={{marginHorizotal : 16}} state={phoneNo} setState={setPhoneNo}/>
                <TextInputComp placeholder={'Alternate Number'} style={{marginHorizotal : 16}} state={alternetNo} setState={setAlternetNo}/>
                <TextInputComp placeholder={'Email'} style={{marginHorizotal : 16}} state={emailId} setState={setEmailId}/>
                <TextInputComp placeholder={'Place of Work / Study'} style={{marginHorizotal : 16}} state={placeOfWork} setState={setPlaceOfWork}/>
                <TextInputComp placeholder={'Designation'} style={{marginHorizotal : 16}} state={designnation} setState={setDesignnation}/>
                <TextInputComp placeholder={'Blood Group'} style={{marginHorizotal : 16}} state={bloodGroup} setState={setBloodGroup}/>
                </View>

                <View style={[styles.moodTitleBox,{marginHorizontal : 16}]}>
            <Image
              source={require('../assets/images/mood.png')}
              style={{ width: 24, aspectRatio: 1, height: undefined }}
            />
            <Text style={styles.moodLable}>Residential Address</Text>
          </View>

          <View style={{paddingHorizontal : 16, marginBottom : 16}}>
                <TextInputComp placeholder={'Address 1'} style={{marginHorizotal : 16}} state={resAddressOne} setState={setResAddressOne}/>
                <TextInputComp placeholder={'Address 2'} style={{marginHorizotal : 16}} state={resAddressTwo} setState={setResAddressTwo}/>
                <TextInputComp placeholder={'City'} style={{marginHorizotal : 16}} state={resCity} setState={setResCity}/>
                <TextInputComp placeholder={'Zip Code'} style={{marginHorizotal : 16}} state={resZipCode} setState={setResZipCode}/>
                </View>

                <View style={[styles.moodTitleBox,{marginHorizontal : 16}]}>
            <Image
              source={require('../assets/images/mood.png')}
              style={{ width: 24, aspectRatio: 1, height: undefined }}
            />
            <Text style={styles.moodLable}>Permanent Address</Text>
          </View>

                <View style={{paddingHorizontal : 16, marginBottom : 16}}>
                <TextInputComp placeholder={'Address 1'} style={{marginHorizotal : 16}} state={perAddressOne} setState={setPerAddressOne}/>
                <TextInputComp placeholder={'Address 2'} style={{marginHorizotal : 16}} state={perAddressTwo} setState={setPerAddressTwo}/>
                <TextInputComp placeholder={'City'} style={{marginHorizotal : 16}} state={perCity} setState={setPerCity}/>
                <TextInputComp placeholder={'Zip Code'} style={{marginHorizotal : 16}} state={perZipCode} setState={setPerZipCode}/>
                </View>

                <View style={[styles.moodTitleBox,{marginHorizontal : 16}]}>
            <Image
              source={require('../assets/images/mood.png')}
              style={{ width: 24, aspectRatio: 1, height: undefined }}
            />
            <Text style={styles.moodLable}>Upload Documents</Text>
          </View>

          <View style={{marginTop : 10, backgroundColor : '#202020', borderRadius : 10, padding  : 16, borderWidth : .5, borderColor : 'white', borderStyle :'dashed', marginHorizontal : 16}}>
            <View style={{alignItems : 'center'}}>
              <View style={{height : 55, width : 55, borderRadius : 200, alignItems : 'center', justifyContent : 'center', backgroundColor : '#2b2b2b'}}>
               <Image
              source={require('../assets/icons/upVector.png')}
              style={{ width: 24, aspectRatio: 1, height: undefined }}
            />
              </View>
              <Text style={{textAlign : 'center', marginTop : 10, color : '#A8A8A8', fontSize : 14, fontWeight : '500', }}>Upload Document</Text>
              <Text style={{textAlign : 'center', marginTop : 2, color : '#A8A8A8', fontSize : 10, fontWeight : '400', }}>Tap to browse files from your device</Text>
              <TouchableOpacity onPress={()=>{
                pickFile()
              }}>
                <Text style={{padding : 6, backgroundColor : '#481D07', borderRadius : 6, color : '#EB6925', fontSize : 12, fontWeight : '600', marginTop : 10,paddingHorizontal : 20}}>Browse Files</Text>
              </TouchableOpacity>

              {selectedFile &&
              <View style={{ width :'100%'}}>
                <TextInputComp bordered={true} placeholder={'Enter title'} style={{marginHorizotal : 16}} state={fileTitle} setState={setFileTitle}/>
                </View>
              
              } 

            </View>

          </View>

          <Text style={{paddingLeft : 16, marginTop : 10, color : '#656565', fontSize : 13, fontWeight : '400', }}>File upload size must be under 2mb</Text>
          <View style={{paddingHorizontal : 16}}>
            {remoteFiles?.map((element,indexx)=>{
              return(
                <View key={indexx} style={{marginTop:10, padding :10,backgroundColor  : '#202020', borderRadius : 10,flexDirection : 'row', justifyContent : 'space-between',alignItems : 'center'}}>
                <View style={{flex : 1, flexDirection : 'row', alignItems : 'center',columnGap : 16}}>
                  {/* <View style={{borderRadius : 10, backgroundColor : '#2B2B2B', height : 70, width : 70}}>
                  </View> */}
                  <Image style={{borderRadius : 10, backgroundColor : '#2B2B2B', height : 70, width : 70}} source={{uri : element?.doc_url || ''}} />
                  <View style={{flex : 1}}>
                <Text style={{ color : '#fff', fontSize : 14, fontWeight : '500', }}>{element?.doc_name}</Text>
                <View style={{marginTop : 16, flexDirection : 'row', columnGap : 16, alignItems : 'center'}}>
                <Text style={{ color : '#fff', fontSize : 10, fontWeight : '400', }}>{element?.doc_uploaded_custom_time}</Text>
                <Text style={{backgroundColor : '#A8A8A8', height : 3, width : 3, borderRadius : 3}}></Text>
                <Text style={{ color : '#A8A8A8', fontSize : 10, fontWeight : '400', }}>{element?.doc_size}</Text>
                </View>
  
                  </View>
                </View>
                <TouchableOpacity style={{width : 60, alignItems : 'flex-end'}} onPress={()=>{
                  
                               Alert.alert(
                               'Delete Document',
                               'Are you sure you want to delete it ?',
                                [
                                { text: 'Cancel', style: 'cancel' },
                                 { text: 'Delete', onPress: () => dltFileFnn(element.id) },
                                 ],
                                 { cancelable: true } 
                                 );
                }}>
                <Image
                source={require('../assets/icons/dltt.png')}
                style={{ width: 40, aspectRatio: 1, height: undefined }}
              />
                
                </TouchableOpacity>
              </View>
              )
            })}
           
          </View>
          
                
       


        

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
