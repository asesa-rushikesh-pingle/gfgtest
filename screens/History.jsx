import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import TitleBar from './components/TitleBar';
import Footer from './components/Footer';
import DiaryTabs from './components/DiaryTabs';
import styles from './Style';
import { BlurView } from '@react-native-community/blur';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, postJSONData } from '../helper/callApi';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker'



const { width } = Dimensions.get('window');
export default function History() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);

  const [pedingAmount, setPedingAmount] = useState(0);
  const [bookingAmount, setBookingAmount] = useState(0);
  const [coursePrice, setCoursePrice] = useState(0);

  const [courseObj, setCourseObj] = useState('');

  const [historyList, setHistoryList] = useState([])

  const dropdownRef = useRef(null);

  const [toDate, setToDate]  = useState(new Date())

  const [fromDate, setFromDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)))

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false)


  const nav = useNavigation();

    const inset = useSafeAreaInsets()

    const data = [
      { label: 'This Month', value: '1' },
      { label: 'Last Three Month', value: '2' },
      { label: 'This Year', value: '3' },
    ];

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);


  

 


  useEffect(() => {
    const controller = new AbortController();
    getCourseInfo(controller);
    return () => {
      controller.abort();
    };
  }, [fromDate, toDate]);

  async function getCourseInfo(controller) {
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(branch, '/athlete/all-course-history', {
      startDate : formatDate(fromDate),
      endDate : formatDate(toDate)
    }, controller);
    if (respo.status) {
      setHistoryList(respo.data.data)
      console.log(respo); 
    }
  }

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.parentWrapper}>
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
            <Image source={require('../assets/images/backBtn.png')} style={{width : 24, aspectRatio : 1 , height : undefined}}  />
            </TouchableOpacity>
            <Text style={styles.pageBarTitle}>{"History"}</Text>
            <TouchableOpacity onPress={()=>{
              dropdownRef.current?.open();
            }}> 
            <Image source={require('../assets/images/filterIco.png')} style={{width : 32, aspectRatio : 1 , height : undefined}}  />
            <Dropdown
              ref={dropdownRef}
          style={[ { marginTop : 10, width : 200, position : 'absolute', right : 16, top : 30 }]}
          data={data}

          containerStyle={{
            backgroundColor: '#121210',
            borderRadius: 16,
            borderWidth : .5,
            overflow : 'hidden',
            paddingVertical : 6
          }}
          itemContainerStyle={{
            paddingVertical: 0,
            paddingHorizontal: 12,
            borderBottomColor : 'gray'
          }}
          itemTextStyle={{
            fontSize: 16,
            lineHeight : 16,
            color: '#fff',
            fontWeight : '600',
            backgroundColor : 'transparent'
          }}
          // placeholder={<View><Image source={require('../assets/images/filterIco.png')} style={{width : 32, aspectRatio : 1 , height : undefined}}  /></View>}
          placeholder={false}
          placeholderStyle={{height : 0}}
          maxHeight={300}
          labelField="label"
          valueField="value"
          activeColor="#000"
          // value={'hu'}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}

          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderRightIcon={() => (
            null
          )}
          renderLeftIcon={() => (
            null
          )}
        />
            </TouchableOpacity>
      
      
           </View>
         </View>


      <Footer activeIndex={2} />
      <ScrollView style={{ paddingTop: safeAreaHeight }}>

              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'center', columnGap : 10, marginTop : 16}}>
                
                <TouchableOpacity onPress={()=>{
                  setOpenStartDatePicker(true)

                }} style={{
    width : ((Dimensions.get('window').width - 42) / 2), paddingVertical : 5, paddingHorizontal : 10, backgroundColor : '#202020', borderRadius : 10  
  }}>
                  <Text style={styles.dchtegray}>From Date</Text>
                  <Text style={styles.dchtegraytm}>{ formatDate(fromDate) || '--'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  setOpenEndDatePicker(true)

                }} style={{
    width : ((Dimensions.get('window').width - 42) / 2), paddingVertical : 5, paddingHorizontal : 10, backgroundColor : '#202020', borderRadius : 10  
  }}>
                  <Text style={styles.dchtegray}>To Date</Text>
                  <Text style={styles.dchtegraytm}>{ formatDate(toDate) || '--'}</Text>
                </TouchableOpacity>

                 
               

              </View>

              <DatePicker
        modal
        mode='date'
        open={openStartDatePicker}
        date={fromDate}
        onConfirm={(date) => {
          setOpenStartDatePicker(false)
          setFromDate(date)
        }}
        onCancel={() => {
          setOpenStartDatePicker(false)
        }}
      />
              <DatePicker
        modal
        mode='date'
        open={openEndDatePicker}
        date={toDate}
        onConfirm={(date) => {
          setOpenEndDatePicker(false)
          setToDate(date)
        }}
        onCancel={() => {
          setOpenEndDatePicker(false)
        }}
      />


             


        <View style={{ paddingHorizontal: 16 }}>
          {historyList?.length == 0 && <Text style={{color : 'white',fontSize : 20, fontWeight : '400', marginTop  : 50,textAlign :'center'}}>Nothing to show</Text> }
          {historyList?.map((itemm,indexx)=>{
            return(

            <View
            key={indexx}
            style={{
              padding: 10,
              backgroundColor: '#202020',
              borderRadius: 16,
              marginTop: 16,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  columnGap: 10,
                }}
              >
                <View
                  style={{
                    paddingVertical: 8,
                    width: 50,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    backgroundColor: '#383838',
                  }}
                >
                  <Text
                    style={{
                      color: '#A8A8A8',
                      fontSize: 12,
                      fontWeight: '600',
                      marginBottom: 5,
                    }}
                  >
                    {itemm?.dateMonth}
                  </Text>
                  <Text
                    style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}
                  >
                   {itemm?.date}
                  </Text>
                </View>
                <Text
                  style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}
                >
                  {itemm?.course_name}
                </Text>
              </View>

             {itemm.status == 'Absent' ? 
              <View>
                <Text style={{color : 'red', fontSize : 14, borderRadius : 5, borderWidth : .5, borderColor:'red', paddingHorizontal : 10, paddingVertical : 2}}>Absent</Text>
              </View>
             : 
             <TouchableOpacity onPress={()=>{
              if(itemm.status == 'Absent'){
                return
              }
              nav.navigate('HistoryDetails', {
                    dateString: itemm?.fullDate})
              }}>
              <Image
                source={require('../assets/images/rrr.png')}
                style={{ width: 28, aspectRatio: 1, height: undefined }}
              />
            </TouchableOpacity>
             } 
            </View>
            {/* {itemm?.programs?.map((elemm,eleINdex)=>{
              return(
                <View
                key={eleINdex}
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop : 16
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    columnGap: 10,
                  }}
                >
                 <Image
                    source={require('../assets/images/tickk.png')}
                    style={{ width: 35, aspectRatio: 1, height: undefined }}
                  />
                  <View>
                  <Text
                    style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}
                  >
                    {itemm?.programs?.length} Programs Completed
                  </Text>
                  <Text
                    style={{ color: '#656565', fontSize: 12, fontWeight: '400',marginTop: 6 }}
                  >
                   {elemm?.display_login_time
                   } - {elemm?.display_logout_time || '--'
                   }  {elemm?.lane_details ? ` ●  ${elemm?.lane_details?.name}` : ''}
                  </Text>
                  </View>
                 
                </View>
  
               <Text style={{color : '#2BA750', marginLeft : 10, fontSize : 12, fontWeight : '600', paddingVertical : 4, paddingHorizontal : 8, borderColor :'#2BA750', borderWidth : .5,borderRadius : 4}}>
               {itemm?.status}
               </Text>
              </View>
              )
            })} */}
           
          </View>
          )
        })}
        </View>

        <View style={{ marginBottom: 300 }}></View>
      </ScrollView>
    </View>
  );
}


const stylesdpr = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});


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
    marginBottom: 10,
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
