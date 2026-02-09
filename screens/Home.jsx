import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';

import Header from './components/Header';
import Footer from './components/Footer';

import styles from '../screens/Style';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {getData} from '../helper/callApi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PsycologicalSkills from '../screens/components/PsycologicalSkills'

export default function Home({route}) {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const navigation = useNavigation();
  const [courseObj, setCourseObj] = useState('')
  const [onGoingProgram, setOnGoingProgram] = useState('')

  const isFocused = useIsFocused();

  const [isApproved, setIsApproved] = useState(false)


  useEffect(() => {
    const controller = new AbortController();
    if(isFocused){
      getCourseDataFn(controller)
    } 
    return ()=>{
      controller.abort();
    }
  }, [isFocused]) 

  useEffect(() => {
    const controller = new AbortController();
    if(isFocused){
      checkIfUserActive(controller)
    } 
    return ()=>{
      controller.abort();
    }
  }, [isFocused]) 
 
 

  async function checkIfUserActive(controller) {
    const branch = await AsyncStorage.getItem('branch_slug')
    const respo = await getData(branch,'/athlete/check-athlete-active-status',{},controller)
    if(respo.status){
      console.log("user activity check",respo.data)
      setIsApproved(respo.data.is_approved == 1 ? true : false)
      
    }
  }
  async function getCourseDataFn(controller) {
    const branch = await AsyncStorage.getItem('branch_slug')
    const respo = await getData(branch,'/athlete/course',{},controller)
    if(respo.status){
      console.log("respo.data.course",respo.data)
      await AsyncStorage.setItem('athleteCourseIdForGeneralCheckin',String(respo.data.course.id))
      await AsyncStorage.setItem('athleteCourseIdForGeneralCheckincourse_id',String(respo.data.course.course_id))
      setCourseObj(respo.data.course) 
      setOnGoingProgram(respo.data.course.onGoingProgram.todayAthleteCoursePrograms)
      // athleteCourseIdForGeneralCheckin
      console.log("course details ",respo.data.course)
    }
  }

  
  
  return (
    <View style={styles.parentWrapper}>
      <Header setSafeAreaHeight={setSafeAreaHeight} />
      {isApproved && 
      <Footer />
}
     
     
     {!isApproved ? 
 <ScrollView style={{ paddingTop: safeAreaHeight , height : 1400}}>
 <View style={{padding : 16}}>
   <Image source={require('../assets/images/hold.png')} style={{width : '100%', height : undefined, aspectRatio : 358/246}} />
   <Text style={{textAlign : 'center', marginTop : 26, color : '#A8A8A8', fontSize : 20, fontWeight : '700'}}>Waiting for Approval</Text>
   <Text style={{textAlign : 'center', marginTop : 26, color : '#656565', fontSize : 16, fontWeight : '600'}}>Your registration is under review.</Text>
 </View>
 </ScrollView>
     : 
     <ScrollView style={{ paddingTop: safeAreaHeight }}>
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={[
              styles.progressView,
              { width: Dimensions.get('window').width - 32 },
            ]}
          >
            <Text style={styles.proTitle}>Course Progress</Text>
            <Text style={styles.percenten}>{Math.floor(parseFloat(courseObj?.daysPercentage))}% </Text>
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
                        (40 * Math.floor(parseFloat(courseObj?.daysPercentage)) ) / 100 >= itm ? '#EB6925' : '#383838',
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
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 16,
            flexDirection: 'row',
            columnGap: 16,
          }}
        >
          <View
            style={[
              styles.progressView,
              { marginRight : 0,width: (Dimensions.get('window').width - 48) / 2 },
            ]}
          >
            <Text style={styles.proTitle}>Your Progress</Text>
            <Image
                source={require('../assets/images/graph.png')}
                style={{ width: '100%', aspectRatio: 139/55, height: undefined }}
              />
           
          </View>
          <View
            style={[
              styles.progressView,
              { marginRight : 0, width: (Dimensions.get('window').width - 48) / 2 },
            ]}
          >
            <Text style={styles.proTitle}>Highest Achievement</Text>
            <View style={styles.achBox}>
              <View>
                <Text style={styles.firstText}>1st</Text>
                <Text style={styles.goldText}>Gold</Text>
              </View>
              <Image
                source={require('../assets/images/medal.png')}
                style={{ width: 50, aspectRatio: 1, height: undefined }}
              />
            </View>
          </View>
        </View>
        
 
        <View style={styles.courseCardsMain}>
          <Text style={styles.mainHead}>Welcome,</Text>
          <Text style={styles.sunHeadingCourgfdh}>
            Your daily training summary
          </Text>
          <View style={styles.secCardCurse}>
            <View style={styles.imgCont}>
              <Image
                source={{uri : courseObj?.courseObject?.course_image_url}}
                style={{ width: 96, aspectRatio: 96 / 69, height: undefined }}
              />
              <View style={styles.courseContentt}>
                <Text style={styles.coHeadinggg}>
                  {courseObj?.course_name}
                </Text>
                <View
                  style={{
                    marginTop: 8,
                    flexDirection: 'row',
                    columnGap: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.staMonthText}>{courseObj?.no_of_days} Days</Text>
                  <View
                    style={{
                      backgroundColor: '#A8A8A8',
                      height: 5,
                      width: 5,
                      borderRadius: 5,
                    }}
                  ></View>
                  <Text style={styles.staMonthText}>Started {courseObj?.start_date}</Text>
                </View>
                <View
                  style={{
                    marginTop: 8,
                    flexDirection: 'row',
                    columnGap: 10,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#E0B519',
                      height: 10,
                      width: 10,
                      borderRadius: 10,
                      outlineColor: '#E0B519',
                      outlineWidth: 1,
                      outlineOffset: 2,
                    }}
                  ></View>
                  <Text style={styles.staMonthText}>In Progress</Text>
                </View>
              </View>
            </View>
            {onGoingProgram &&

            <View>

           
            {/* {onGoingProgram?.programs?.map((eemt,inx)=>{
              return(
<View key={inx} style={styles.mentalTraiView}>
            <View style={[styles.imgCont, { alignItems: 'center' }]}>
              <View style={styles.courseContentt}>
                <Text style={styles.coHeadinggg}>{eemt?.course_category_name}</Text>
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
                  <Text style={styles.codescr}>
                    {eemt?.program_name}
                  </Text>
                  <View
                    style={{
                      marginTop: 10,
                      alignContent: 'center',
                      flexDirection: 'row',
                      columnGap: 10,
                    }}
                  >
                    {!onGoingProgram?.display_logout_time &&
                     <Text style={styles.ongoingtext}>On Going</Text>
                    }
                    {onGoingProgram?.lane_scan_log_id &&
                     <Text style={[styles.ongoingtext, { color: '#A8A8A8' }]}>
                      <Text style={{ color: 'white' }}>{onGoingProgram?.lane_details ? onGoingProgram?.lane_details?.name : null}</Text>
                    </Text>
                    }
                   
                  </View>
                </View>
              </View>
              <View style={{ rowGap: 5 }}>
                <View>
                  <Text style={styles.chinTexttt}>Check In</Text>
                  <Text style={styles.timeTexttt}>{onGoingProgram?.display_login_time || '--'}</Text>
                </View>
                <View>
                  <Text style={styles.chinTexttt}>Check Out</Text>
                  <Text style={styles.timeTexttt}>{onGoingProgram?.display_logout_time || '--'}</Text>
                </View>
              </View>
            </View>
          </View>
              )
            })} */}

            
          </View>
            }
            

            {/* coach info  */}

            {courseObj?.coaches?.head_coaches?.map((itt,indexxx)=>{
              return (

              
            <View
            key={indexxx}
              style={[
                styles.imgCont,
                {
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: 16,
                },
              ]}
            >
              <Image
                source={{uri : itt?.profile_pic_path}}
                style={{ width: 35, aspectRatio: 1, height: undefined,borderRadius : 50 }}
              />

              <View style={styles.courseContentt}>
                <Text
                  style={[styles.coHeadinggg, { fontSize: 14, lineHeight: 14 }]}
                >
                 {itt?.coach_name}
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    flexDirection: 'row',
                    columnGap: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.staMonthText}>Head Coach</Text>
                </View>
              </View>
            </View>
            )
          })}

{courseObj?.coaches?.assistant_coaches?.map((itt,indexxx)=>{
              return (

              
            <View
            key={indexxx}
              style={[
                styles.imgCont,
                {
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: 16,
                },
              ]}
            >
              <Image
                source={{uri : itt?.profile_pic_path}}
                style={{ width: 35, aspectRatio: 1, height: undefined,borderRadius : 50 }}
              />

              <View style={styles.courseContentt}>
                <Text
                  style={[styles.coHeadinggg, { fontSize: 14, lineHeight: 14 }]}
                >
                 {itt?.coach_name}
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    flexDirection: 'row',
                    columnGap: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.staMonthText}>Assistant Coach</Text>
                </View>
              </View>
            </View>
            )
          })}

            {/* more info btn  */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CourseDetail');
              }}
              style={styles.moreInfoBtn}
            >
              <Text style={styles.btnTextt}>More info</Text>
              <Image
                source={require('../assets/images/arrright.png')}
                style={{ width: 24, aspectRatio: 1, height: undefined }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <PsycologicalSkills isTrstPer={courseObj?.test_permission == 1 ? true : false} testQuestios={courseObj?.courseObject?.psychological_questions} testArr={courseObj?.test_percentage}/>

        {/* mood box  */}
        <View style={styles.moodBoxWaraper}>
          <View style={styles.moodTitleBox}>
            <Image
              source={require('../assets/images/mood.png')}
              style={{ width: 24, aspectRatio: 1, height: undefined }}
            />
            <Text style={styles.moodLable}>Your Mood</Text>
          </View>
          <View style={styles.moodInner}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.staMonthText}>Jan 15, 2024</Text>
              <TouchableOpacity>
                <Image
                  source={require('../assets/images/options.png')}
                  style={{ width: 24, aspectRatio: 1, height: undefined }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{ marginTop: 16, marginBottom: 16, alignItems: 'center' }}
            >
              <Image
                source={require('../assets/images/happy.png')}
                style={{ width: 86, aspectRatio: 1, height: undefined }}
              />
            </View>

            <View>
              <Text style={styles.moRegTitle}>A slightly pleasant Day</Text>
              <View style={styles.chipss}>
                <Text style={styles.chip}>Amazed</Text>
                <Text style={styles.chip}>Confident</Text>
                <Text style={styles.chip}>Hopeful</Text>
                <Text style={styles.chip}>Spirituality</Text>
                <Text style={styles.chip}>Community</Text>
                <Text style={styles.chip}>Amazed</Text>
                <Text style={styles.chip}>Confident</Text>
                <Text style={styles.chip}>Hopeful</Text>
              </View>
            </View>
          </View>
        </View>

        

        {/* my diary section  */}
        <View style={[styles.moodBoxWaraper, { paddingBottom: 250 }]}>
          <View style={styles.moodTitleBox}>
            <Image
              source={require('../assets/images/diaryico.png')}
              style={{ width: 20, aspectRatio: 20 / 22, height: undefined }}
            />
            <Text style={styles.moodLable}>My Diary</Text>
          </View>
          <View style={{ marginTop: 16, flexDirection: 'row', columnGap: 10 }}>
            <View style={styles.dcard}>
              <Text style={styles.gPrasctie}>General Practice</Text>
              <Text
                style={[
                  styles.gPrasctie,
                  { color: 'white', fontSize: 20, fontWeight: '600' },
                ]}
              >
                {courseObj?.diarySummary?.general_practice}
              </Text>
            </View>
            <View style={styles.dcard}>
              <Text style={styles.gPrasctie}>Score Card</Text>
              <Text
                style={[
                  styles.gPrasctie,
                  { color: 'white', fontSize: 20, fontWeight: '600' },
                ]}
              >
                   {courseObj?.diarySummary?.score_card}
              </Text>
            </View>
            <View style={styles.dcard}>
              <Text style={styles.gPrasctie}>Mental Training</Text>
              <Text
                style={[
                  styles.gPrasctie,
                  { color: 'white', fontSize: 20, fontWeight: '600' },
                ]}
              >
                  {courseObj?.diarySummary?.mental_training}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>}
    </View>
  ); 
}
