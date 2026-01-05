import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
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
import { useIsFocused, useNavigation } from '@react-navigation/native';


export default function CourseInfo() {
  const isFocused = useIsFocused();
     const [safeAreaHeight, setSafeAreaHeight] = useState(0);
     const nav = useNavigation() 

     const [selectedCourse, setSelectedCourse] = useState('')
       const [onGoingProgram, setOnGoingProgram] = useState('')

       const [athleteCourseId, setAthleteCourseId] = useState('')
       const [athleteCompletedCourseId, setAthleteCompletedCourseId] = useState('')


       const [programDetailsObj, setProgramDetailsObj] = useState('')

       const [programList, setProgramList] = useState([])
     

     const today = moment();
     const [selectedDate, setSelectedDate] = useState(today);
     const [currentMonth, setCurrentMonth] = useState(today.format('MMMM YYYY'));

     const [courseObj, setCourseObj] = useState('')

     const [programToggler, setProgramToggler] = useState(false)

     const [programNestedList, setProgramNestedList] = useState([])
   
     const handleDateSelected = (date) => {
        setSelectedDate(date);
       setCurrentMonth(date.format('MMMM YYYY'));
     };

     
     


     useEffect(() => {
      const controller = new AbortController();
      getCourseDataFn(controller)
      return ()=>{
        controller.abort();
      }
    }, [programToggler])
  
   
    
    async function getCourseDataFn(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/course',{},controller)
      if(respo.status){
        setCourseObj(respo.data.course)
        console.log(respo.data.course.id)
        setAthleteCourseId(respo.data.course.id)
       
        setOnGoingProgram(respo.data.course.onGoingProgram.todayAthleteCoursePrograms)
        console.log("respo.data.course",respo.data.course.programs)

        setProgramNestedList(respo.data.course.programs)
      }
    }

  return (
    <View style={styles.parentWrapper}>
    <TitleBar title={'Course Info'} setSafeAreaHeight={setSafeAreaHeight}/>
    <Footer/>
      <ScrollView style={{paddingTop : safeAreaHeight}}>
       <View style={styles.courseDetView}>
        <Image  source={{uri : courseObj?.courseObject?.course_image_url}} style={{height : undefined, width : '100%', aspectRatio : 540/270, objectFit : 'cover'}}/>

        <View  style={styles.coverlayyy}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={1}
          // overlayColor="transparent" 
          // reducedTransparencyFallbackColor="white"
        />
        <Text style={styles.coHeadinggg}> {courseObj?.course_name}</Text>
        <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between',marginTop : 2}}>
        <View  style={{marginTop : 8, flexDirection : 'row', columnGap : 10, alignItems : 'center',}}>
                <Text style={styles.staMonthText}>{courseObj?.no_of_days} Days</Text>
                <View style={{backgroundColor : '#A8A8A8',height : 5, width : 5, borderRadius : 5}}></View>
                <Text style={styles.staMonthText}>Started {courseObj?.start_date}</Text>

              </View>
              <View  style={{marginTop : 8, flexDirection : 'row', columnGap : 10, alignItems : 'center',}}>
                <View style={{  backgroundColor : '#E0B519',height : 10, width : 10, borderRadius : 10, outlineColor : '#E0B519', outlineWidth : 1, outlineOffset : 2}}></View>
                <Text style={styles.staMonthText}>In Progress</Text>

              </View>
        </View>

        </View>
       </View>


       <View style={{padding : 16}}>
        {programNestedList?.map((itt,indexx)=>{
          return(
            <View key={indexx} style={{marginBottom : 26}}>
            <Text style={{fontSize : 16, fontWeight : '500', color : 'white'}}>{itt?.course_category_name}</Text>
            
            {itt?.programs?.map((elem,inx)=>{
              return(
                <View key={inx} style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginTop : 16}}>
                <Text style={{fontSize : 14, fontWeight : '400',lineHeight : 19, color : '#A8A8A8'}}>{inx + 1}. {elem?.program_name}</Text>
                <Text style={{fontSize : 16, fontWeight : '500', color : 'white'}}>{elem?.days} Days</Text>
                </View>
              ) 
            })}
           
           
          </View>
          )
        })}
        </View>
       

      

            





            <View style={{marginBottom : 300}}></View>
            

       


     </ScrollView>
  </View>
  )
}