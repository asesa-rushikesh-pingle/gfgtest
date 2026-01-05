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
import {getData, postJSONData} from '../helper/callApi'
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';


export default function Profile() {
     const [safeAreaHeight, setSafeAreaHeight] = useState(0);


     const [pedingAmount, setPedingAmount] = useState(0)
     const [athleteInfo, setAthleteInfo] = useState('')


     const nav = useNavigation()


     

    

     useEffect(() => {
      const controller = new AbortController();
      getCourseInfo(controller)
      return ()=>{
        controller.abort();
      }
    }, [])

     useEffect(() => {
      const controller = new AbortController();
      getProfileFn(controller)
      return ()=>{
        controller.abort();
      }
    }, [])
   
    async function getCourseInfo(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/course',{},controller)
      if(respo.status){
        // setCourseObj(respo.data.course)
        setPedingAmount(respo.data.course.remainingAmount)
        console.log(respo.data)
      }
    }
    async function getProfileFn(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/profile',{},controller)
      if(respo.status){
        // setCourseObj(respo.data.course)
        console.log("profile info", respo)
        setAthleteInfo(respo.data.athlete)
      }
    }

  return (
    <View style={styles.parentWrapper}>
    <TitleBar title={"Profile"} setSafeAreaHeight={setSafeAreaHeight}/>
    <Footer/>
      <ScrollView style={{paddingTop : safeAreaHeight}}>

        <View style={{paddingHorizontal : 16}}>
          <TouchableOpacity onPress={()=>{
             nav.navigate('EditProfile')
          }}>
            <View style={stylesNew.userSection}>
              <View style={stylesNew.photoConatiner}>
                <View style={stylesNew.userPhoto}>
                  <Image
                    source={{uri : athleteInfo?.profile_pic_url}}
                    style={{ width: 80, height: 80 }}
                    blurRadius={1}
                  /> 
                </View>

                <View style={stylesNew.userDetails}>
                  <Text style={stylesNew.userName}>{athleteInfo?.first_name} {athleteInfo?.last_name}</Text>
                  <Text style={stylesNew.userContactnumber}>{athleteInfo?.mobile_no}</Text>

                  <View style={stylesNew.approvedContainer}>
                    <Image
                      source={require('../assets/icons/check_box.png')}
                      style={{ height: 18, width: 18 }}
                    />
                    <Text style={stylesNew.approvedText}>Approved</Text>
                  </View>
                </View>
              </View>

              <Image
                source={require('../assets/icons/expand.png')}
                style={{ height: 24, width: 24 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={stylesNew.billingSection}
            onPress={() => nav.navigate('Billing')}
          >
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/rupee-indian.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>Billing & Payments</Text>
                <Text style={stylesNew.pendingAmount}>
                  Pending Amount -
                  <Text style={stylesNew.amountPending}> {pedingAmount.toLocaleString('en-IN')}/-</Text>
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={stylesNew.billingSection} onPress={()=>{
            nav.navigate('HealthScreen')
          }}>
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/cardiogram.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>Health Info</Text>
                <Text style={stylesNew.pendingAmount}>
                  All health related metrics
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={stylesNew.billingSection} onPress={()=>{
            nav.navigate('MyWeapon')
          }}>
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/rifle.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>My Weapon</Text>
                <Text style={stylesNew.pendingAmount}>
                  Configure your weapon or rent it
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={stylesNew.billingSection}>
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/ammunition.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>Other Accessories</Text>
                <Text style={stylesNew.pendingAmount}>
                  Keep track on your accessories or rent it
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={stylesNew.billingSection} onPress={()=>{
            nav.navigate('CourseInfo')
          }}>
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/target.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>Course Info</Text>
                <Text style={stylesNew.pendingAmount}>
                  In-depth info about your course & program{' '}
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={stylesNew.billingSection}>
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/terms-and-conditions.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>Terms & Conditions</Text>
                <Text style={stylesNew.pendingAmount}>
                  All info about terms & conditions
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={stylesNew.billingSection}>
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/policy.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>Privacy Policy</Text>
                <Text style={stylesNew.pendingAmount}>
                  Info about how your personal data is handle
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={stylesNew.billingSection}>
            <View style={stylesNew.billingConatiner}>
              <Image
                source={require('../assets/icons/phone.png')}
                style={{ height: 24, width: 24 }}
              />
              <View>
                <Text style={stylesNew.billingpayment}>Help & FAQs</Text>
                <Text style={stylesNew.pendingAmount}>
                  Chat, call or mail for quick and easy help
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={stylesNew.billingSection} onPress={async ()=>{
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('profile_pic_url');
            await AsyncStorage.removeItem('first_name');
            await AsyncStorage.removeItem('last_name');
            await AsyncStorage.removeItem('branch_name');
            await AsyncStorage.removeItem('branch_slug');

            nav.navigate('LoginScreen')
          }}>
            <View style={stylesNew.billingConatiner}>
              {/* <Image
                source={require('../assets/icons/phone.png')}
                style={{ height: 24, width: 24 }}
              /> */}
              <View>
                <Text style={stylesNew.billingpayment}>Logout</Text>
                <Text style={stylesNew.pendingAmount}>
                 
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={{ height: 24, width: 24 }}
            />
          </TouchableOpacity>

          <Text style={stylesNew.appVersion}>App Version - 1.0</Text>
        </View>
     

        

            <View style={{marginBottom : 300}}></View>
            

       


     </ScrollView>
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
