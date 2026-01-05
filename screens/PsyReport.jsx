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







export default function PsyReport({route}) {
     const [safeAreaHeight, setSafeAreaHeight] = useState(0);

     const { id } = route.params;


     const [pedingAmount, setPedingAmount] = useState(0)
     const [bookingAmount, setBookingAmount] = useState(0)
     const [coursePrice, setCoursePrice] = useState(0)

     const [courseObj, setCourseObj] = useState('')

     const [reportObj, setReportObj] = useState('')

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
      const respo = await getData(branch,'/athlete/get-mental-training-report',{
        report_id : id
      },controller)
      if(respo.status){
        console.log('report respo ', respo)
        setReportObj(respo.data.reports[0])
        
      } 
    }


    function getGrade(obtainedMarks) {
      const maxMarks = 84;
    
      if (obtainedMarks < 0 || obtainedMarks > maxMarks) {
        return "Invalid Marks";
      }
    
      // Convert to percentage (1 - 100 scale)
    
      // Grade mapping based on provided table
      if (obtainedMarks >= 0 && obtainedMarks <= 17) return "LOW";
      if (obtainedMarks >= 18 && obtainedMarks <= 34) return "BELOW AVERAGE";
      if (obtainedMarks >= 35 && obtainedMarks <= 51) return "AVERAGE";
      if (obtainedMarks >= 52 && obtainedMarks <= 68) return "ABOVE AVERAGE";
      if (obtainedMarks >= 69 && obtainedMarks <= 100) return "EXCELLENT";
    
      return "Invalid Percentage";
    }
    

  return (
    <View style={styles.parentWrapper}>
    <TitleBar title={"Detail Mental Skill Values"} setSafeAreaHeight={setSafeAreaHeight}/>
    {/* <Footer/> */}
      <ScrollView style={{paddingTop : safeAreaHeight}}>

        <View style={{paddingHorizontal : 16}}>
          <Text style={{fontSize : 12, fontWeight : '400',marginTop : 16, color : '#A8A8A8'}}>
          Feb 15, 2024 
          </Text>

          <View style={{ marginTop : 26 }}>
          <View
            style={[
              styles.progressView,
              { width: Dimensions.get('window').width - 32 },
            ]}
          >
            <Text style={styles.proTitle}>{getGrade((Number(reportObj?.total_percentage) * 84)/100)}</Text>
            <Text style={styles.percenten}>{Number(reportObj?.total_percentage).toFixed(0)}% </Text> 
            <View
              style={{
                flexDirection: 'row',
                columnGap: 2,
                marginTop: 5,
                paddingBottom: 5,
                borderBottomWidth: 0.5,
                borderStyle: 'dashed',
                borderBottomColor: '#A8A8A8',
              }}
            >
              {[
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                ,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
              ]?.map(itm => {
                return (
                  <View
                    key={itm}
                    style={{
                      height: 15,
                      flex: 1,
                      backgroundColor:
                        (40 * Number(reportObj?.total_percentage) ) / 100 >= itm ? Number(reportObj?.total_percentage) < 40 ? '#FE373B' : '#008644' : '#383838',
                      borderRadius: 3,
                    }}
                  ></View>
                );
              })}
            </View>
            <View style={styles.taLimitView}>
              <Text style={styles.taTiLab}>0</Text>
              <Text style={styles.taTiLab}>50</Text>
              <Text style={styles.taTiLab}>100</Text>
            </View>
          </View>
          </View>

          <Text style={{fontSize : 20, fontWeight : '700',marginTop : 26, color : '#fff'}}>
          Conclusion,
          </Text>
          <Text style={{fontSize : 14,lineHeight : 22, fontWeight : '400',marginTop : 6, color : '#A8A8A8'}}>
          This report highlights the seven essential mental skills required by the athlete. Regular mental training and continuous development of your mental capacities will help you perform consistently at your best. At Gun for Glory, we provide opportunities to enhance your mental abilities.
          </Text>
          <Text style={{fontSize : 20, fontWeight : '700',marginTop : 26, color : '#fff'}}>
          The chart below explains the seven mental skill values for the athlete
          </Text>

          <View style={{flexDirection : 'row', alignItems : 'center',justifyContent : 'flex-start', marginTop : 16}}>
            <View style={{width  : 35, height : 200, alignItems : 'flex-end', paddingRight : 3,justifyContent : 'space-between'}}>
                <Text style={{fontSize : 10, color : '#A8A8A8', fontWeight : '400'}}>100 %</Text>
                <Text style={{fontSize : 10, color : '#A8A8A8', fontWeight : '400'}}>80 %</Text>
                <Text style={{fontSize : 10, color : '#A8A8A8', fontWeight : '400'}}>60 %</Text>
                <Text style={{fontSize : 10, color : '#A8A8A8', fontWeight : '400'}}>40 %</Text>
                <Text style={{fontSize : 10, color : '#A8A8A8', fontWeight : '400'}}>20 %</Text>
                <Text style={{fontSize : 10, color : '#A8A8A8', fontWeight : '400'}}>00 %</Text>
            </View>
            <View style={{flex : 1, height : 200, borderLeftWidth : .5,borderBottomWidth : .5, borderColor : '#848484', flexDirection : 'row', alignItems : 'flex-end', justifyContent : 'space-evenly'}}>
                <View style={{width : 33, height :  Number(reportObj?.total_coachability_percentage)?.toFixed(0) * 2, backgroundColor : '#008644'}}></View>
                <View style={{width : 33, height :  Number(reportObj?.total_concentartion_percentage)?.toFixed(0) * 2, backgroundColor : '#FFD04D'}}></View>
                <View style={{width : 33, height :  Number(reportObj?.total_confidence_percentage)?.toFixed(0) * 2, backgroundColor : '#EB6925'}}></View>
                <View style={{width : 33, height :  Number(reportObj?.total_coping_percentage)?.toFixed(0) * 2, backgroundColor : '#FF928A'}}></View>
                <View style={{width : 33, height :  Number(reportObj?.total_freedom_percentage)?.toFixed(0) * 2, backgroundColor : '#D9B8FF'}}></View>
                <View style={{width : 33, height :  Number(reportObj?.total_goal_percentage)?.toFixed(0) * 2, backgroundColor : '#537FF1'}}></View>
                <View style={{width : 33, height :  Number(reportObj?.total_goal_percentage)?.toFixed(0) * 2, backgroundColor : '#537FF1'}}></View>
                <View style={{width : 33, height : Number(reportObj?.total_peaking_percentage)?.toFixed(0) * 2, backgroundColor : 'gray'}}></View>
            </View>

          </View>

          <View style={{marginTop : 26}}>

            <View style={{flexDirection : 'row', borderBottomWidth : .3, borderColor : '#383838',alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16}} >
              <View style={{width : 10, height :  10,borderRadius : 10, backgroundColor : '#008644'}}></View>
              <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400', lineHeight :28 }}>Coachability</Text>
              </View>
              <Text style={{color : '#fff', fontSize : 16, fontWeight : '600', lineHeight :28 }}>{Number(reportObj?.total_coachability_percentage)?.toFixed(0)}%</Text>
            </View>
            <View style={{flexDirection : 'row', borderBottomWidth : .3, borderColor : '#383838',alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16}} >
              <View style={{width : 10, height :  10,borderRadius : 10, backgroundColor : '#FFD04D'}}></View> 
              <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400', lineHeight :28 }}>Concentration</Text>
              </View>
              <Text style={{color : '#fff', fontSize : 16, fontWeight : '600', lineHeight :28 }}>{Number(reportObj?.total_concentartion_percentage)?.toFixed(0)}%</Text>

            </View>
            <View style={{flexDirection : 'row', borderBottomWidth : .3, borderColor : '#383838',alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16}} >
              <View style={{width : 10, height :  10,borderRadius : 10, backgroundColor : '#EB6925'}}></View>
              <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400', lineHeight :28 }}>Confidence</Text>
              </View>
              <Text style={{color : '#fff', fontSize : 16, fontWeight : '600', lineHeight :28 }}>{Number(reportObj?.total_confidence_percentage)?.toFixed(0)}%</Text>

            </View>
            <View style={{flexDirection : 'row', borderBottomWidth : .3, borderColor : '#383838',alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16}} >
              <View style={{width : 10, height :  10,borderRadius : 10, backgroundColor : '#FF928A'}}></View>
              <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400', lineHeight :28 }}>Coping With Adversity</Text>
              </View>
              <Text style={{color : '#fff', fontSize : 16, fontWeight : '600', lineHeight :28 }}>{Number(reportObj?.total_coping_percentage)?.toFixed(0)}%</Text>

            </View>
            <View style={{flexDirection : 'row', borderBottomWidth : .3, borderColor : '#383838',alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16}} >
              <View style={{width : 10, height :  10,borderRadius : 10, backgroundColor : '#D9B8FF'}}></View>
              <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400', lineHeight :28 }}>Freedom From Worry</Text>
              </View>
              <Text style={{color : '#fff', fontSize : 16, fontWeight : '600', lineHeight :28 }}>{Number(reportObj?.total_freedom_percentage)?.toFixed(0)}%</Text>

            </View>
            <View style={{flexDirection : 'row', borderBottomWidth : .3, borderColor : '#383838',alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16}} >
              <View style={{width : 10, height :  10,borderRadius : 10, backgroundColor : '#537FF1'}}></View>
              <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400', lineHeight :28 }}>Goal Setting</Text>
              </View>
              <Text style={{color : '#fff', fontSize : 16, fontWeight : '600', lineHeight :28 }}>{Number(reportObj?.total_goal_percentage)?.toFixed(0)}%</Text>

            </View>
            <View style={{flexDirection : 'row', borderBottomWidth : .3, borderColor : '#383838',alignItems : 'center', justifyContent : 'space-between'}}>
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16}} >
              <View style={{width : 10, height :  10,borderRadius : 10, backgroundColor : 'gray'}}></View>
              <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400', lineHeight :28 }}>Peaking Under Pressure</Text>
              </View>
              <Text style={{color : '#fff', fontSize : 16, fontWeight : '600', lineHeight :28 }}>{Number(reportObj?.total_peaking_percentage)?.toFixed(0)}%</Text>

            </View>

          </View>


          <Text style={{fontSize : 14, fontWeight : '400',marginTop : 26,lineHeight : 22, color : '#A8A8A8'}}>
          Psychological profile reveals a clear distinction between areas of strength and those that require focused improvement.
          </Text>

          <View style={{marginTop : 16, padding : 10, borderRadius : 16, borderColor : '#383838', borderWidth : .5}}>
            <Text style={{fontSize : 16, fontWeight : '500',marginBottom : 6, color : '#fff'}}>Coping with  Adversity</Text>
            <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 22, color : '#A8A8A8'}}>Ability to stay calm confident and focused in tough situations</Text>
            <View style={{height : .5, backgroundColor : '#383838',marginTop : 8,marginBottom : 8}}></View>

            <Text style={{fontSize : 16, fontWeight : '500',marginBottom : 6, color : '#fff'}}>Coachability</Text>
            <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 22, color : '#A8A8A8'}}>Ability to stay calm confident and focused in tough situations</Text>
            <View style={{height : .5, backgroundColor : '#383838',marginTop : 8,marginBottom : 8}}></View>

            <Text style={{fontSize : 16, fontWeight : '500',marginBottom : 6, color : '#fff'}}>Concentration</Text>
            <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 22, color : '#A8A8A8'}}>Ability to stay calm confident and focused in tough situations</Text>
            <View style={{height : .5, backgroundColor : '#383838',marginTop : 8,marginBottom : 8}}></View>

            <Text style={{fontSize : 16, fontWeight : '500',marginBottom : 6, color : '#fff'}}>Confidence</Text>
            <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 22, color : '#A8A8A8'}}>Ability to stay calm confident and focused in tough situations</Text>
            <View style={{height : .5, backgroundColor : '#383838',marginTop : 8,marginBottom : 8}}></View>

            <Text style={{fontSize : 16, fontWeight : '500',marginBottom : 6, color : '#fff'}}>Peaking under Pressure</Text>
            <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 22, color : '#A8A8A8'}}>Ability to stay calm confident and focused in tough situations</Text>
            <View style={{height : .5, backgroundColor : '#383838',marginTop : 8,marginBottom : 8}}></View>

            <Text style={{fontSize : 16, fontWeight : '500',marginBottom : 6, color : '#fff'}}>Goal Setting</Text>
            <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 22, color : '#A8A8A8'}}>Ability to stay calm confident and focused in tough situations</Text>
            <View style={{height : .5, backgroundColor : '#383838',marginTop : 8,marginBottom : 8}}></View>

            <Text style={{fontSize : 16, fontWeight : '500',marginBottom : 6, color : '#fff'}}>Freedom from Worry</Text>
            <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 22, color : '#A8A8A8'}}>Ability to stay calm confident and focused in tough situations</Text>

          </View>

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

