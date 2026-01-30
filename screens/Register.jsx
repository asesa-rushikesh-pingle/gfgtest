import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet, FlatList, Dimensions } from 'react-native'
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
import RazorpayCheckout from 'react-native-razorpay';



export default function Register() {
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
     const [phoneNo, setPhoneNo] = useState('')
     const [alternetNo, setAlternetNo] = useState('') 
     const [emailId, setEmailId] = useState('')
     const [fileTitle, setFileTitle] = useState('')

     const [branchList, setBranchList] = useState([])
     const [selectedBranchId, setSelectedBranchId] = useState('')

     const [courseList, setCourseList] = useState([])

     const [selectedCourseId, setSelectedCourseId] = useState('')
     const [paymetOpt, setPaymetOpt] = useState('')
     const [payableAmount, setPayableAmount] = useState('')


     

    

   const [toggler, setToggler] = useState(false)


   
   useEffect(() => {
    const controller = new AbortController();
    getBranchListFn(controller)
    return ()=>{
      controller.abort();
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController();
    if(selectedBranchId){
      getCoursesByBranch(controller)
    }
    return ()=>{
      controller.abort();
    }
  }, [selectedBranchId])
 
  
  async function getCoursesByBranch(controller) {
    // const branch = await AsyncStorage.getItem('branch_slug')
    const respo = await getData('','/public-api/branch-course-list',{branch_id : selectedBranchId},controller)
    if(respo.status){
      
      console.log("branch with payment", respo)
      setCourseList(respo.data)
       
    }
  }
  async function getBranchListFn(controller) {
    // const branch = await AsyncStorage.getItem('branch_slug')
    const respo = await getData('','/public-api/branch-list',{},controller)
    if(respo.status){
      // setCourseObj(respo.data.course)
      let brnchess = respo.data?.map((bt,btindex)=>{
        return {
            label : bt.branch_name,
             value : bt.id
        }
      })

      setBranchList(brnchess)
      console.log("branchListing Ifo", respo)
      
    }
  }
   

  
  


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


      async function regUser() {
        setIsLoading(true)
        let payload = {
          "first_name" : firstName,
          "last_name" : lastName,
          "mobile_no" : phoneNo,
          "email" : emailId,
          "branch_id" : selectedBranchId,
          "course_id" : selectedCourseId,
          "amount_paid": payableAmount,
          "payment_type" : paymetOpt
      }
        const respo = await postJSONData('','/auth/register',payload)
        console.log(respo)
        if(respo?.status){
          console.log(respo)
          setIsLoading(false)
          
          
          payWithRazorpayFn(respo.data.razorpay_order_id,respo.data.amount)
        }else{
          setIsLoading(false)
        }
        
      }


      async function payWithRazorpayFn(odId,amountt) {
        var options = {
          description: 'Credits towards GFG',
          image: 'https://www.gunforglory.in/wp-content/uploads/2024/05/GFG-Logo-W.png.webp',
          currency: 'INR',
          key: 'rzp_test_Jmnl3BIulz7LuL',
          amount: amountt,
          name: 'Gun For Glory',
          order_id: odId,//Replace this with an order_id created using Orders API.
          prefill: {
            email: emailId,
            contact: phoneNo,
            name: firstName + ' ' + lastName
          },
          theme: {color: '#EB6925'}
        }
        RazorpayCheckout.open(options).then((data) => {
          // handle success
          console.log(data)
          verifyPayment(data.razorpay_order_id,data.razorpay_payment_id,data.razorpay_signature)
         
          // alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
          // handle failure
          // Alert.alert(`Error: ${error.code} | ${error.description}`)
          // alert(`Error: ${error.code} | ${error.description}`);
        });
        
      }

      async function verifyPayment(razorpay_order_id,razorpay_payment_id,razorpay_signature) {
        let payload = {
          "razorpay_order_id" : razorpay_order_id,
          "razorpay_payment_id": razorpay_payment_id,
          "razorpay_signature" :razorpay_signature ,
          "branch_id" : selectedBranchId,
      }
        const respo = await postJSONData('','/auth/verify-payment',payload)
        if(respo?.status){
          console.log(respo)
          await AsyncStorage.setItem('authToken', respo.data.authToken);
               
                await AsyncStorage.setItem('first_name', respo.data.first_name);
                await AsyncStorage.setItem('last_name', respo.data.last_name);
                await AsyncStorage.setItem('branch_name', respo.data.branches[0].branch_name);
                await AsyncStorage.setItem('branch_slug', respo.data.branches[0].branch_slug);
                nav.replace('Home');
         
        }
        
      }


    

  return (
    <View style={styles.parentWrapper}>
    <TitleBar title={"Registration"} setSafeAreaHeight={setSafeAreaHeight}/>
      <ScrollView style={{paddingTop : safeAreaHeight}}>

       


                <View style={{paddingHorizontal : 16, marginBottom : 16}}>
                <TextInputComp placeholder={'First Name'} style={{marginHorizotal : 16}} state={firstName} setState={setFirstName}/>
                <TextInputComp placeholder={'Last Name'} style={{marginHorizotal : 16}} state={lastName} setState={setLastName}/>
                <TextInputComp placeholder={'Mobile No'} style={{marginHorizotal : 16}} state={phoneNo} setState={setPhoneNo}/>
                <TextInputComp placeholder={'Email'} style={{marginHorizotal : 16}} state={emailId} setState={setEmailId}/>


                </View>
                <RNPickerSelect
                  onValueChange={(value) => setSelectedBranchId(value)}
                  useNativeAndroidPickerStyle={false}
                  items={branchList}
                >
                      <View style={{paddingHorizontal : 16, }}>
                        <View style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 16, backgroundColor : '#202020', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
                            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{branchList?.find((it)=> it.value == selectedBranchId)?.label || 'Choose Branch'}</Text>
                            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../assets/images/donArrr.png')}/>
                        </View> 
                        </View>
                </RNPickerSelect>



                <View style={stylesNew.container}>
      
         {courseList?.map((co,coindex)=>{
          return(

           <View key={coindex} style={stylesNew.card}>
        <Text style={stylesNew.courseName}>{co?.course_name}</Text>

        <Text style={stylesNew.cardTitle}>Choose Payment Option</Text>

        {/* Booking Price */} 
        <View style={{alignItems : 'center', justifyContent : 'flex-start',columnGap : 16, flexDirection  : 'row'}}>
          {co?.booking_price &&
           <TouchableOpacity style={{width : (Dimensions.get('window').width - 80)/2, borderWidth : 1, borderColor : ((selectedCourseId == co.central_course_id) && (paymetOpt == 'booking')) ? '#EB6925' : 'gray',borderRadius : 5, paddingHorizontal : 10, paddingVertical : 5}}
           onPress={()=>{
            setSelectedCourseId(co.central_course_id)
            setPaymetOpt('booking')
            setPayableAmount(Number(co?.booking_price).toFixed(0))
           }}
           
         
           >
             <Text style={stylesNew.optionLabel}>Booking Price</Text>
             <Text style={stylesNew.price}>{co?.booking_price}</Text>
           </TouchableOpacity>
          }
         {/* Full Price */}
         {co?.price &&
         <TouchableOpacity style={{ width : (Dimensions.get('window').width - 80)/2, borderWidth : 1, borderColor : ((selectedCourseId == co.central_course_id) && (paymetOpt == 'full')) ? '#EB6925' : 'gray',borderRadius : 5, paddingHorizontal : 10,paddingVertical : 5}}
         onPress={()=>{
          setSelectedCourseId(co.central_course_id)
          setPaymetOpt('full')
          setPayableAmount(Number(co?.price).toFixed(0))
         }}
          
         >
           <Text style={stylesNew.optionLabel}>Full Price</Text>
           <Text style={stylesNew.price}>{co?.price}</Text> 
         </TouchableOpacity>
         }
         

        </View>
        
          </View>
          )
        })}

          
     
    </View>
                
 


         

          
          
                
  


        

            <View style={{marginBottom : 400}}></View>
            

       


     </ScrollView>
     <View>
     {payableAmount &&
   <TouchableOpacity onPress={()=>{


    
    if(!isLoading){
      regUser()
    }
       
   }} style={{marginTop : 16, paddingHorizontal : 16, marginBottom : inset.bottom + 10}}>
   <Text style={{textAlign : 'center', padding : 10 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}> {isLoading ? 'Loading...' : `Pay ${payableAmount}`}   </Text>
</TouchableOpacity>
   } 
     </View>
  </View>
  )
}


const stylesNew = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  courseName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#A1A1A3',
    fontSize: 14,
    marginBottom: 12,
  },
  optionBox: {
    backgroundColor: '#2A2A2C',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  selectedBox: {
    borderColor: '#FF6A00',
    backgroundColor: '#1F130A',
  },
  optionLabel: {
    color: '#A1A1A3',
    fontSize: 13,
    marginBottom: 4,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
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


