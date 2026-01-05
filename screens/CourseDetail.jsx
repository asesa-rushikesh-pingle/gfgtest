import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal } from 'react-native'
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


export default function CourseDetail() {
  const isFocused = useIsFocused();
     const [safeAreaHeight, setSafeAreaHeight] = useState(0);
     const nav = useNavigation() 

     const [selectedCourse, setSelectedCourse] = useState('')
       const [onGoingProgram, setOnGoingProgram] = useState('')

       const [athleteCourseId, setAthleteCourseId] = useState('')
       const [athleteCompletedCourseId, setAthleteCompletedCourseId] = useState('')


       const [programDetailsObj, setProgramDetailsObj] = useState('')

       const [programList, setProgramList] = useState([])

       const [isChoosePrograms, setIsChoosePrograms] = useState(false)

       const [ongoingProgramList, setOngoingProgramList] = useState([])
       const [nestedAccourdianPrograms, setNestedAccourdianPrograms] = useState([])
     

     const today = moment();
     const [selectedDate, setSelectedDate] = useState(today);
     const [currentMonth, setCurrentMonth] = useState(today.format('MMMM YYYY'));

     const [courseObj, setCourseObj] = useState('')

     const [programToggler, setProgramToggler] = useState(false)
   
     const handleDateSelected = (date) => {
      if(date.isSame(moment(), 'day')){
        // Alert.alert('its today')
      
      } else{
        console.log(date.format("YYYY-MM-DD"))
        nav.navigate('HistoryDetails', {
        dateString: date.format("YYYY-MM-DD")})
       return
      }

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

     useEffect(() => {
      const controller = new AbortController();
      if(athleteCourseId &&  athleteCompletedCourseId){
        getChooseProgramListFn(controller)
      }
      return ()=>{
        controller.abort();
      }
    }, [ athleteCourseId, athleteCompletedCourseId, programToggler])

     useEffect(() => {
      const controller = new AbortController();

      if(athleteCourseId && selectedDate){
        getProgramsFnn(controller)
      }
    
      return ()=>{
        controller.abort();
      }
    }, [athleteCourseId,selectedDate,programToggler,isFocused])
  
    async function getProgramsFnn(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/get-program-by-date',{
        date : selectedDate.format('YYYY-MM-DD'),
        athlete_course_id : athleteCourseId,
        detail : 1
      },controller)
      if(respo.status){

        setProgramDetailsObj(respo.data.details[0])
        let list = respo.data.details[0].program_list?.map((itm)=>{
          return {
             value : itm, label : itm.program_name
          }
        }) 
        // if(!respo.data.details.athlete_completed_course_program_id){
        //   Alert.alert(selectedDate.format('YYYY-MM-DD'),'respo.data.details.athlete_completed_course_program_id not found')
        // }
        // await AsyncStorage.setItem('athlete_completed_course_program_id',respo.data.details.athlete_completed_course_program_id ? String(respo.data.details.athlete_completed_course_program_id) : '')
        setAthleteCompletedCourseId(respo.data.details[0].athlete_completed_course_program_id)
        // Alert.alert(String(respo.data.details.athlete_completed_course_program_id))
        setProgramList(list)
        console.log("dropdown progrma list ",list)



        console.log('get programs respo 12', respo)
        setOngoingProgramList(respo.data.details[0].program_list)

      }
    }
    async function logoutProgrmaFn(iscompleted) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await postJSONData(branch,'/athlete/close-todays-program',{
        "athlete_course_id": athleteCourseId,
        "is_completed" : iscompleted ? 1 : 0
      })
    
      if(respo.status){
        Alert.alert('Cheked Out','You are cheked out sucessfully!')
        nav.navigate('HistoryDetails', {
          dateString: selectedDate.format("YYYY-MM-DD")})
        // setProgramToggler(s=>!s)

      }
    }

    async function saveChoosenPrograms() {
      let temprograms = [
    ]

    nestedAccourdianPrograms?.forEach((element,indexx)=>{
      element.categories.forEach((category,catIndex)=>{
        category.all_programs.forEach((program,proIndex)=>{
          if(program.checked){
            temprograms.push({
              "id": program.id,
              "is_custom": program.is_custom ? 1 : 0
            })
          }
        })
      })
    })

    console.log('temprograms',temprograms)

      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await postJSONData(branch,'/athlete/update-programs',{
        "athlete_course_id": athleteCourseId,
        "athlete_completed_course_program_id" : athleteCompletedCourseId,
        "programs": temprograms
      })
    
      if(respo.status){
        setProgramToggler(s=>!s)
        setIsChoosePrograms(false)
      }
    }
    async function setProgrmaFn(value) {
      console.log("valueee",Number(value.athlete_course_program_id))
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await postJSONData(branch,'/athlete/set-program',{
        "athlete_course_id": athleteCourseId,
        "is_custom": value.is_custom ? 1 : 0,
        "course_category_id": value.course_category_id,
        "athlete_course_program_id":value.athlete_course_program_id,
        // "lane_scan_log_id": 6,
        "course_program_id": value.course_program_id
      })
    
      if(respo.status){
        Alert.alert('progrma set successfully')
        setProgramToggler(s=>!s)

      }
    }
    async function getCourseDataFn(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/course',{},controller)
      if(respo.status){
        setCourseObj(respo.data.course)
        console.log(respo.data.course.id)
        setAthleteCourseId(respo.data.course.id)
       
        setOnGoingProgram(respo.data.course.onGoingProgram.todayAthleteCoursePrograms)
        console.log("respo.data.course.onGoingProgram",respo.data.course.onGoingProgram)
      }
    }
    async function getChooseProgramListFn(controller) {
      const branch = await AsyncStorage.getItem('branch_slug')
      const respo = await getData(branch,'/athlete/get-all-programs',{
        athlete_course_id : athleteCourseId,
        athlete_completed_course_program_id : athleteCompletedCourseId

      },controller)
      
      if(respo.status){
        console.log("choose program ist from gell all programs",respo) 
         setNestedAccourdianPrograms(respo.data.data)
      }
    }

    function changeCheckboxFn(findex,sindex,tindex){
      let updatedpro = nestedAccourdianPrograms.map((it,inx)=>{
        if(inx == findex){
            let updatedCategories = it.categories?.map((cat,catIndex)=>{
              if(catIndex == sindex){

                let updatedPrograms = cat.all_programs?.map((program,programIndex)=>{
                  if(programIndex == tindex){
                    return {...program , checked : !program.checked}
    
                  }else{
                    return program
                  }
    
                })
                return {...cat, all_programs : updatedPrograms}

              }else{
                return cat
              }

            })
            return {...it, categories : updatedCategories}
        }else{
          return it
        }

      })
      setNestedAccourdianPrograms(updatedpro)
    }

  return (
    <View style={styles.parentWrapper}>
    <TitleBar setSafeAreaHeight={setSafeAreaHeight}/>
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

       {/* calendar srip  */}
       <CalendarStrip
              scrollable 
              // startingDate={moment().subtract(3, 'days')}
              maxDate={moment()} 
              style={styles.calendar}
              scrollToOnSetSelectedDate={true} 
              calendarHeaderStyle={{ color: '#fff', fontSize: 16 }}
              dateNumberStyle={{ color: '#888' }}
              dateNameStyle={{ color: '#888', fontSize: 10 }}
              highlightDateNumberStyle={{ color: '#ff6a00', fontSize: 20 }}
              highlightDateNameStyle={{ color: '#ff6a00', fontSize: 12 }}
              highlightDateContainerStyle={{
                backgroundColor: 'transparent',
              }}
              iconContainer={{ flex: 0.1 }}
              
              daySelectionAnimation={{
                type: 'border',
                duration: 200,
                borderWidth: 0,
                borderHighlightColor: '#ff6a00',
              }}
              selectedDate={selectedDate}
              onDateSelected={handleDateSelected}
              useIsoWeekday={false}
              showMonth={true}
              showDate={true}
              iconLeft={null}
              iconRight={null}
              headerText={selectedDate.isSame(moment(), 'day') ? 'Today' : ' '}
              markedDates={[
                // { date: '2025-11-01', dots: [{ color: '#ff6a00' }] },
                // { date: '2025-11-02', dots: [{ color: '#ff6a00' }] },
                // { date: '2025-11-03', dots: [{ color: '#ff6a00' }] },
              ]}
            />
             <Text
              style={{
                color: '#fff',
                fontSize: 18,
                textAlign: 'center',
                marginTop: 0,
              }}
            >
              {currentMonth} 
            </Text>

            


           

      {/* choose program modal  */}

      <Modal
          animationType="slide"
          transparent={true}
          visible={isChoosePrograms}
          onRequestClose={() => {
            setIsChoosePrograms(!isChoosePrograms);
          }}>



 <View style={{ flex: 1 }}>
        
          <View style={{backgroundColor : 'black', flex : 1}}>

          
          <View style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                lineHeight: 22,
                color: 'white', 
                textAlign: 'center',
              }}
            >
             Select Today’s Program
            </Text>
            <TouchableOpacity onPress={()=>{setIsChoosePrograms(false)}}
              style={{ position: 'absolute', top: '50%', right: 16 }}
            >
              <Image
                style={{ height: undefined, width: 32, aspectRatio: 1 }}
                source={require('../assets/images/cll.png')}
              />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={{padding : 16}}>
              {nestedAccourdianPrograms?.map((elem,inndexing)=>{
                return (
                    <View  key={inndexing} style={{borderWidth : .5, borderColor : 'gray', padding : 16, marginBottom : 16, borderRadius : 16}} >
                      <Text style={{color : 'white', textAlign : 'center', fontWeight : 400, fontSize : 16,marginBottom : 5 }} >Day {elem?.startDay} - Day {elem?.endDay}</Text>

                    
                      {elem?.categories?.map((elemm,inndexingg)=>{
                     return (<View key={inndexingg} style={{ borderTopColor : 'gray', paddingTop : 10, marginTop : 10, borderWidth : .5}}>
                    <Text style={{color : 'white', fontSize : 16, fontWeight : '600',paddingBottom : 10}}>
                   {elemm?.course_category_name}
                    </Text>
                    {elemm?.all_programs?.map((ineerElem,innerIndex)=>{
                      return(

                      
                    <View key={innerIndex} style={{padding : 10, marginBottom : 10, backgroundColor : ineerElem?.checked  ? '#481D07' : '#202020', borderRadius : 10, borderWidth : 1,flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', borderColor : ineerElem?.checked ? '#EB6925' : '#202020'}}>
                      <Text style={{color : 'white', fontSize : 14, fontWeight : '400', }}>
                        {ineerElem?.program_name}
                      </Text>

                      <TouchableOpacity onPress={()=>{
                        changeCheckboxFn(inndexing,inndexingg,innerIndex)
                      }}> 
                        {ineerElem?.checked ?
                        <Image
                        source={require('../assets/images/programCheck.png')}
                        style={{ width: 24, aspectRatio: 1, height: undefined }}
                      />
                        : 
                        <Image
                          source={require('../assets/images/programUnCheck.png')}
                          style={{ width: 24, aspectRatio: 1, height: undefined }}
                       />
                        
                        }
                      
                      </TouchableOpacity>
                    </View>
                    )
                  })}
                   
                    </View>)
                      })}


                    </View>
                )
              })}

            </View>
          </ScrollView>
         


       

      <TouchableOpacity onPress={()=>{
        saveChoosenPrograms()
        
      }} style={{marginTop : 16, paddingHorizontal : 16}}>
        <Text style={{textAlign : 'center', padding : 10 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}>Save</Text>
      </TouchableOpacity>


          </View>

        </View>
          </Modal>



       {/* mental training view  */}
       <View style={[styles.mentalTraiView,{borderWidth : 0,paddingHorizontal : 16}]}>

        {/* <View style={{alignItems : 'center', justifyContent : 'space-between', flexDirection : 'row'}}>
          <Text style={{color : 'white', fontSize : 18, fontWeight : '600'}}>Today’s Training Program</Text>
          <TouchableOpacity onPress={()=>{setIsChoosePrograms(true)}}>
          <Image
                    source={require('../assets/images/pen.png')}
                    style={{ width: 24, aspectRatio: 1, height: undefined }}
                  />
          </TouchableOpacity>
        </View> */}

        {/* new ui  */}
        {/* {ongoingProgramList?.map((it,ixx)=>{
          return(
<View key={ixx} style={{backgroundColor : '#202020',borderRadius : 16, padding : 10,marginTop : 16}}>
              <View style={[styles.imgCont, { alignItems: 'center' }]}>
                <View style={styles.courseContentt}>
                  <Text style={styles.coHeadinggg}>{it.course_category_name}</Text>
                   <View
                    style={{
                      marginTop: 8,
                      flexDirection: 'row',
                      columnGap: 10,
                      alignItems: 'center',
                      display : 'none'
                    }}
                  >
                    <Text style={styles.staMonthText}>
                      Started Jan 15, 2024
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#A8A8A8',
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                      }}
                    ></View>
                    <Text style={styles.staMonthText}>07 Days</Text>
                  </View>
                </View>
              
              </View>
              <View style={styles.checkContView}>
                <View style={styles.cheLeftCont}>
                  <Image
                    source={require('../assets/images/watch.png')}
                    style={{ width: 22, aspectRatio: 1, height: undefined }}
                  />
                  <View style={{ flex: 1 }}>
                   
                  
                      <Text style={styles.codescr}>{it?.program_name}</Text>
                    <View
                      style={{
                        marginTop: 10,
                        alignContent: 'center',
                        flexDirection: 'row',
                        columnGap: 10,
                      }}
                    >
                      {(true) &&
                      <Text style={styles.ongoingtext}>On Going</Text>
                      }
                   
                    </View>
                  </View>
                </View>
               
              </View>
        </View>
          )
        })} */}
        {/* new ui end  */}


       
             
              <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 10, marginTop : 16}}>
                <TouchableOpacity onPress={()=>{
                  if(programDetailsObj?.display_login_time){
                    nav.navigate('ScanQr',{
                      isScaLane: true
                    })
                  }else{
                    Alert.alert('Please check in first')
                  }
                 
                }} style={styles.laBoxRef}>
                  <Text   style={styles.lnoRefText}>Lane no.</Text>
                  <Text style={styles.lnoRefTextNum}>{programDetailsObj?.lane_details ? programDetailsObj?.lane_details?.name?.split(' ')[1] : '--'}</Text>
                </TouchableOpacity>
                <View style={styles.chchvdeyai}>
                  <Text style={styles.dchtegray}>Check In</Text>
                  <Text style={styles.dchtegraytm}>{programDetailsObj?.display_login_time || '--'}</Text>
                </View>
                <View style={styles.chchvdeyai}>
                  <Text style={styles.dchtegray}>Check Out</Text>
                  <Text style={styles.dchtegraytm}>{programDetailsObj?.display_logout_time || '--'}</Text>
                  {programDetailsObj?.logoutProgram && 
                  <TouchableOpacity style={{position : 'absolute', top : '35%', right : 10}} onPress={()=>{
                    Alert.alert(
                      'Confirm Checkout',
                      'Are you sure you want to complete the Program?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel', // gives iOS-style grey button
                        },
                        {
                          text: 'No',
                          onPress: () =>  logoutProgrmaFn(false),
                        },
                        {
                          text: 'Yes',
                          onPress: () =>  logoutProgrmaFn(true),
                        },
                      ],
                      { cancelable: true }
                    );

                   
                  }}>
                  <Image source={require('../assets/images/chout.png')} style={{height : undefined, width : 24, aspectRatio :1, }}/>
          
                            </TouchableOpacity>
                  }
                  
                </View>

              </View>
            </View>


            {/* DiaryTabs  */}
            {athleteCompletedCourseId &&
            <DiaryTabs selectedDate={selectedDate} athleteCourseId={athleteCourseId} athleteCompletedCourseId={athleteCompletedCourseId}/>
            }

            <View style={{marginBottom : 300}}></View>
            

       


     </ScrollView>
  </View>
  )
}