import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native'
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

const { width } = Dimensions.get('window');
export default function Billing() {
     const [safeAreaHeight, setSafeAreaHeight] = useState(0);


     const [pedingAmount, setPedingAmount] = useState(0)
     const [bookingAmount, setBookingAmount] = useState(0)
     const [coursePrice, setCoursePrice] = useState(0)

     const [courseObj, setCourseObj] = useState('')

     const nav = useNavigation()

     const paymentStatus = [
      {
        id : 0 , value : 'Pending' , color : 'yellow'
      },
      {
        id : 1 , value : 'Approved' ,color : 'green'
      },
      {
        id : 2 , value : 'Rejected' ,color : 'red'
      },
    ]


     const instalmentData = [
      { date: 'Jan 15, 2024', method: 'UPI', amount: '14,000/-' },
      { date: 'Feb 15, 2024', method: 'UPI', amount: '14,000/-' },
      { date: 'Mar 15, 2024', method: 'UPI', amount: '14,000/-' },
    ];
  
    const recivedAmount = [
      {
        date: 'Jan 15, 2024',
        paymentmethod: 'UPI',
        paymentid: '29347982740978',
        paymentstatus: 'Received',
        amount: '14,000/-',
      },
      {
        date: 'feb 15, 2024',
        paymentmethod: 'UPI',
        paymentid: '29347982740978',
        paymentstatus: 'Received',
        amount: '14,000/-',
      },
      {
        date: 'mar 15, 2024',
        paymentmethod: 'UPI',
        paymentid: '29347982740978',
        paymentstatus: 'Received',
        amount: '14,000/-',
      },
    ];


     

    

     useEffect(() => {
      const controller = new AbortController();
      getCourseInfo(controller)
      return ()=>{
        controller.abort();
      }
    }, [])

    
   
    async function getCourseInfo(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/course',{},controller)
      if(respo.status){
        setCourseObj(respo.data.course)
        setBookingAmount(Number(respo.data.course.booking_amount))
        setPedingAmount(Number(respo.data.course.remainingAmount))
        setCoursePrice(Number(respo.data.course.course_price))
        console.log(respo.data)
      } 
    }
    

  return (
    <View style={styles.parentWrapper}>
    <TitleBar title={"Billing & Payments"} setSafeAreaHeight={setSafeAreaHeight}/>
    <Footer/>
      <ScrollView style={{paddingTop : safeAreaHeight}}>

          <View style={{paddingHorizontal : 16}}>
            <View style={stylesNew.billingTypesSection}>
              <View style={stylesNew.billingTypes}>
                <Text style={stylesNew.coursepriceText}>Course Price</Text>
                <Text style={stylesNew.coursePrice}>{coursePrice.toLocaleString('en-IN')}</Text>
              </View>
              <View style={stylesNew.billingTypes}> 
                <Text style={stylesNew.coursepriceText}>Booking Amount</Text>
                <Text style={stylesNew.bookingAmount}>{bookingAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={stylesNew.billingTypes}>
                <Text style={stylesNew.coursepriceText}>
                  Total Pending{'\n'} Amount
                </Text>
                <Text style={stylesNew.totalpendingAmount}>{pedingAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View style={stylesNew.paymentPlanssection}>
              <View style={stylesNew.salary}>
                <Image
                  source={require('../assets/icons/salary.png')}
                  style={{ height: 20, width: 20 }}
                />
                <View>
                  <Text style={stylesNew.paymentPlanText}>Payment Plan</Text>
                  <Text style={stylesNew.instalmentsText}>{courseObj?.projection_plan?.length || 0} Instalments</Text>
                </View>
              </View>
              <Text style={stylesNew.updatedjustnowText}>Updated Just Now</Text>
            </View>

            <View style={stylesNew.instalmentsDatesection}>
              {courseObj?.projection_plan?.map((item, index) => (
                <View
                  key={index}
                  style={[
                    stylesNew.instalmentStructure,
                    index === 0 && { borderTopWidth: 0 },
                  ]}
                >
                  <View>
                    <Text style={stylesNew.instalmentsDateText}>{item.payment_date}</Text>
                    <Text style={stylesNew.upiText}>{item.payment_type}</Text>
                  </View>
                  <Text style={stylesNew.totalInstalmentText}>{Number(item.amount).toLocaleString('en-IN')}/-</Text>
                </View>
              ))}
            </View>

            <View style={stylesNew.receivedSection}>
              <Image
                source={require('../assets/icons/wallet.png')}
                style={{ height: 20, width: 20 }}
              />
              <Text style={stylesNew.paymentPlanText}>Received Payment Info</Text>
            </View>

            {courseObj?.paymentList?.map((item, index) => (
              <View style={stylesNew.receivedInstalmentSection} key={index}>
                <View>
                  <Text style={stylesNew.instalmentsDateText}>{item.payment_date}</Text>
                  <View style={stylesNew.upirevivedContainer}>
                    <Text style={stylesNew.recivedupiText}>{item.payment_type}</Text>
                    <Text style={[stylesNew.receivedText,  { borderColor :  paymentStatus?.find((it)=>it.id == item.payment_approval_status)?.color, color : paymentStatus?.find((it)=>it.id == item.payment_approval_status)?.color}]}>{paymentStatus?.find((it)=>it.id == item.payment_approval_status)?.value}</Text>
                  </View>
                  <Text style={stylesNew.paymnetIdText}>{item.receipt_no}</Text>
                </View>
                <View style={stylesNew.viewInstalmentdetailssection}>
                  <Text style={stylesNew.recivedAmountText}>{Number(item.amount_received).toLocaleString('en-IN')}/-</Text>
                  <TouchableOpacity>
                    <Image
                      source={require('../assets/icons/eye.png')}
                      style={{ height: 24, width: 24 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
     

        

            <View style={{marginBottom : 300}}></View>
            

       


     </ScrollView>
  </View>
  )
}


const stylesNew = StyleSheet.create({
  billpaySection: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  billingTypesSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
  },
  billingTypes: {
    backgroundColor: '#202020',
    borderRadius: 5,
    padding: 10,
    height: 88,
    display: 'flex',
    width: (width - 52) / 3,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coursepriceText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  coursePrice: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#EB6925',
  },
  bookingAmount: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#A8A8A8',
  },
  totalpendingAmount: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#E0B519',
  },
  paymentPlanssection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salary: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  paymentPlanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  instalmentsText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  updatedjustnowText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  instalmentsDatesection: {
    padding: 10,
    backgroundColor: '#202020',
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 26,
  },
  instalmentStructure: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#383838',
    borderTopWidth: 0.5,
    paddingVertical: 5,
  },
  instalmentsDateText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  upiText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    paddingTop: 10,
  },
  totalInstalmentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    lineHeight: 22,
  },
  receivedSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  receivedInstalmentSection: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#202020',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:10
  },
  viewInstalmentdetailssection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 26,
  },
  recivedAmountText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#2A9F4D',
  },
  upirevivedContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  recivedupiText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  receivedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2BA750',
    borderColor: '#2BA750',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  paymnetIdText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
    paddingTop: 5,
  },
});

