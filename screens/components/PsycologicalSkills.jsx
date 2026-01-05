import { View, Text, Image, TouchableOpacity, Modal, Pressable, Alert, Dimensions } from 'react-native'
import React, { useState } from 'react'
import styles from '../Style'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { postJSONData } from '../../helper/callApi'

export default function PsycologicalSkills({testArr=[],isTrstPer}) {
    const [visible, setVisible] = useState(false)
    const [selectedQuestionNo, setSelectedQuestionNo] = useState(null)
    const [questions, setQuestions] = useState([])
    const nav = useNavigation()
    const [isLoading, setIsLoading] = useState(false)


    async function setAnsQue(ans) {

        setQuestions((arr)=>{

            let newarr = arr.map((item)=>{
                if(item.queNo == selectedQuestionNo){
                    return {...item,ans : ans}
                }else{
                    return item
                }
            })

            return newarr
            
        })

        setSelectedQuestionNo(selectedQuestionNo + 1)
        
    }


    async function submitTestFn(totalPercentage,totalCopingPecentage,totalCoachabilityPecentage,totalConcentrationPecentage,totalConfidencePecentage,totalGoalPecentage,totalPeakingPecentage,totalFreedomPecentage) {
      setIsLoading(true)
      const athleteCourseIdForGeneralCheckin = await AsyncStorage.getItem('athleteCourseIdForGeneralCheckincourse_id')
      if(!athleteCourseIdForGeneralCheckin){
        Alert.alert('Courseid not found')
        return
      }
      const branch = await AsyncStorage.getItem('branch_slug')

              console.log("payload for test",{
                    
                "percentages" : {athleteCourseIdForGeneralCheckin,totalPercentage,totalCopingPecentage,totalCoachabilityPecentage,totalConcentrationPecentage,totalConfidencePecentage,totalGoalPecentage,totalPeakingPecentage,totalFreedomPecentage}
            })
     

          const respo = await postJSONData(branch,'/athlete/add-mental-training-report',{
            
              "course_id" : Number(athleteCourseIdForGeneralCheckin),
              "total_percentage" : totalPercentage,
              "total_coping_percentage" : totalCopingPecentage,
              "total_coachability_percentage" : totalCoachabilityPecentage,
              "total_concentartion_percentage" : totalConcentrationPecentage,
              "total_confidence_percentage" : totalConfidencePecentage,
              "total_goal_percentage" : totalGoalPecentage,
              "total_peaking_percentage" : totalPeakingPecentage,
              "total_freedom_percentage" : totalFreedomPecentage
          
          })
        
          if(respo.status){
                setIsLoading(false)
                setSelectedQuestionNo(null)
                setVisible(false)
                 nav.navigate('PsyReport', {
                      id: respo.data.report})
                
          }else{
            setIsLoading(false)
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
    <View style={styles.moodBoxWaraper}>
    <View style={styles.moodTitleBox}>
      <Image
        source={require('../../assets/icons/psy.png')}
        style={{ width: 24, aspectRatio: 1, height: undefined }}
      />
      <Text style={styles.moodLable}>Sport Psychological Skills</Text>
    </View>
    <View style={styles.moodInner}>
      {testArr?.map((test,testIndex)=>{
        return(
          <View key={testIndex} style={{borderBottomWidth : .5, borderColor : '#383838', marginBottom : 5}}>
              <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.staMonthText}>{test?.created_date}</Text>
        <TouchableOpacity onPress={()=>{
          nav.navigate('PsyReport', {
            id: test.id})
        }}>
          <Image
            source={require('../../assets/images/rm.png')}
            style={{ width: 30, aspectRatio: 1, height: undefined }}
          />
        </TouchableOpacity>
              </View>
              <Text style={{marginTop : 10,marginBottom : 10, color  : 'white', fontSize : 16, fontWeight : '500'}}>{getGrade(Number(test?.total_percentage))}</Text>
              <Text style={{marginBottom : 10, width: ((Dimensions.get('window').width - 52) * Number(test?.total_percentage)) / 100, color  : 'white', fontSize : 16, fontWeight : '500',paddingVertical : 1, paddingHorizontal : 10,backgroundColor : Number(test?.total_percentage) < 40 ? '#FF6568' : '#008644', borderRadius  : 4,lineHeight : 24}}>{Number(test?.total_percentage)?.toFixed(0)} %</Text>


          </View>
        )
      })}
     
     
            {isTrstPer && 
            <View>

          
            <View style={{marginTop : 16,columnGap : 20, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start'}}>
                <View style={{flex : 1}}>
                    <Text style={{color : 'white', fontSize : 16, fontWeight : '600'}}>
                    Let’s check your sports mindset!
                    </Text>
                    <Text style={{marginTop : 10,  color : '#A8A8A8', fontSize : 12, fontWeight : '600'}}>
                    How often do you feel or experience these while you’re in action? 
                    </Text>

                </View>
                <Image
                    source={require('../../assets/icons/brain.png')}
                    style={{ width: 80, aspectRatio: 1, height: undefined }}
                  />

            </View>

            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('CourseDetail');
                setVisible(true)
                setQuestions([
                  {
                    queNo: 1,
                    image: require(`../../assets/images/que1.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 2,
                    image: require(`../../assets/images/que2.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1, 
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 3,
                    image: require(`../../assets/images/que3.png`),
                    ans: null,
                    opt1: 3,
                    opt2: 2,
                    opt3: 1,
                    opt4: 0,
                  },
                  {
                    queNo: 4,
                    image: require(`../../assets/images/que4.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 5,
                    image: require(`../../assets/images/que5.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 6,
                    image: require(`../../assets/images/que6.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 7,
                    image: require(`../../assets/images/que7.png`),
                    ans: null,
                    opt1: 3,
                    opt2: 2,
                    opt3: 1,
                    opt4: 0,
                  },
                  {
                    queNo: 8,
                    image: require(`../../assets/images/que8.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 9,
                    image: require(`../../assets/images/que9.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 10,
                    image: require(`../../assets/images/que10.png`),
                    ans: null,
                    opt1: 3,
                    opt2: 2,
                    opt3: 1,
                    opt4: 0,
                  },
                  {
                    queNo: 11,
                    image: require(`../../assets/images/que11.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 12,
                    image: require(`../../assets/images/que12.png`),
                    ans: null,
                    opt1: 3,
                    opt2: 2,
                    opt3: 1,
                    opt4: 0,
                  },
                  {
                    queNo: 13,
                    image: require(`../../assets/images/que13.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 14,
                    image: require(`../../assets/images/que14.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 15,
                    image: require(`../../assets/images/que15.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 16,
                    image: require(`../../assets/images/que16.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 17,
                    image: require(`../../assets/images/que17.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 18,
                    image: require(`../../assets/images/que18.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 19,
                    image: require(`../../assets/images/que19.png`),
                    ans: null,
                    opt1: 3,
                    opt2: 2,
                    opt3: 1,
                    opt4: 0,
                  },
                  {
                    queNo: 20,
                    image: require(`../../assets/images/que20.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 21,
                    image: require(`../../assets/images/que21.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 22,
                    image: require(`../../assets/images/que22.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 23,
                    image: require(`../../assets/images/que23.png`),
                    ans: null,
                    opt1: 3,
                    opt2: 2,
                    opt3: 1,
                    opt4: 0,
                  },
                  {
                    queNo: 24,
                    image: require(`../../assets/images/que24.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 25,
                    image: require(`../../assets/images/que25.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 26,
                    image: require(`../../assets/images/que26.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 27,
                    image: require(`../../assets/images/que27.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                  {
                    queNo: 28,
                    image: require(`../../assets/images/que28.png`),
                    ans: null,
                    opt1: 0,
                    opt2: 1,
                    opt3: 2,
                    opt4: 3,
                  },
                ]);
                
              }}
              style={[styles.moreInfoBtn,{marginTop : 17}]}
            >
              <Text style={styles.btnTextt}>Get Started</Text>
              <Image
              source={require('../../assets/images/arrright.png')}
              style={{ width: 24, aspectRatio: 1, height: undefined }}
              />
             
            </TouchableOpacity>

            </View>
            }



    </View>


    {/*report  generation model  */}
    <Modal
        visible={visible}
        transparent
        animationType="slide"  // fade | slide | none
        onRequestClose={() => {
          setVisible(false)
          setIsLoading(false)
        }} // Android back button
      >
        <View style={{flex : 1, backgroundColor : 'black'}}>
            <View style={{paddingVertical : 20, paddingHorizontal : 16, flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', }}>
                <Text style={{color : '#656565', fontSize : 16, fontWeight : '600',opacity : (selectedQuestionNo > 0 && selectedQuestionNo <= 28) ? 1 : 0}}><Text style={{color : '#fff', fontSize : 26, fontWeight : '600'}}>{selectedQuestionNo}</Text>/28</Text>
            <Text style={{color : '#fff', fontSize : 16, fontWeight : '600'}}>Psychological Skills</Text>
            <TouchableOpacity onPress={()=>{
                setVisible(false)
                setSelectedQuestionNo(null)
                setIsLoading(false)
            }}>
            <Image
            source={require('../../assets/icons/closeIcon.png')}
            style={{ width: 32, aspectRatio: 1, height: undefined }}
          />
            </TouchableOpacity>
            </View>

            {/* spalash screen  */}
            {(selectedQuestionNo == null) &&
            <View style={{  flex : 1, padding : 16, alignItems : 'center', justifyContent : 'space-between'}}>
            <Image
            source={require('../../assets/icons/brain.png')}
            style={{ width: 80, aspectRatio: 1, height: undefined }}
          />
          <Text style={{color : 'white', fontSize : 24, fontWeight : '400'}}>Let’s check your {'\n'}
          sports mindset!</Text>

          <View>
          <Text style={{color : '#656565', fontSize : 12, fontWeight : '600', textAlign : 'center'}}>The following are statements that athletes have used to describe their experiences. Please read each statement carefully, and then recall as accurately as possible how often you experience the same thing. There are no right or wrong answers. Do not spend too much time on any one statement.</Text>
            
          <TouchableOpacity
              onPress={() => {
                // navigation.navigate('CourseDetail');
                // setVisible(true)
                setSelectedQuestionNo(1)
              }}
              style={[styles.moreInfoBtn,{marginTop : 17,paddingVertical : 10}]}
            >
              <Text style={styles.btnTextt}>Lets Begin</Text>
              
             
            </TouchableOpacity>

          </View>

            </View>
             }

            {/* question screen  */}
            {(selectedQuestionNo > 0 && selectedQuestionNo <= 28) &&
            <View style={{flex : 1, }}>
                <Image
                // source={require(`../../assets/images/${questions?.find((it)=> it.queNo == 1)?.image}`)}
                source={questions?.find((it)=> it.queNo == selectedQuestionNo)?.image} style={{width : Dimensions.get('window').width, height : undefined, aspectRatio : 1}} 
                />
                <View>
                    <TouchableOpacity onPress={()=>{setAnsQue(questions?.find((it)=> it.queNo == selectedQuestionNo)?.opt1)}} style={{paddingLeft : '25%',marginTop : 10,marginHorizontal : 16, padding : 10, backgroundColor : '#2B2B2B', borderRadius : 10, flexDirection : 'row',alignItems : 'center', columnGap : 14}}>
                       <Image source={require('../../assets/images/opt1.png')} style={{width  : 40 , height : undefined, aspectRatio : 1}}/> 
                       <Text style={{fontSize : 16 ,fontWeight : '600', color : 'white'}}>Almost Never</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setAnsQue(questions?.find((it)=> it.queNo == selectedQuestionNo)?.opt2)}} style={{paddingLeft : '25%',marginTop : 10,marginHorizontal : 16, padding : 10, backgroundColor : '#2B2B2B', borderRadius : 10, flexDirection : 'row',alignItems : 'center', columnGap : 14}}>
                       <Image source={require('../../assets/images/opt2.png')} style={{width  : 40 , height : undefined, aspectRatio : 1}}/> 
                       <Text style={{fontSize : 16 ,fontWeight : '600', color : 'white'}}>Sometimes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setAnsQue(questions?.find((it)=> it.queNo == selectedQuestionNo)?.opt3)}} style={{paddingLeft : '25%',marginTop : 10,marginHorizontal : 16, padding : 10, backgroundColor : '#2B2B2B', borderRadius : 10, flexDirection : 'row',alignItems : 'center', columnGap : 14}}>
                       <Image source={require('../../assets/images/opt3.png')} style={{width  : 40 , height : undefined, aspectRatio : 1}}/> 
                       <Text style={{fontSize : 16 ,fontWeight : '600', color : 'white'}}>Often</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setAnsQue(questions?.find((it)=> it.queNo == selectedQuestionNo)?.opt4)}} style={{paddingLeft : '25%',marginTop : 10,marginHorizontal : 16, padding : 10, backgroundColor : '#2B2B2B', borderRadius : 10, flexDirection : 'row',alignItems : 'center', columnGap : 14}}>
                       <Image source={require('../../assets/images/opt4.png')} style={{width  : 40 , height : undefined, aspectRatio : 1}}/> 
                       <Text style={{fontSize : 16 ,fontWeight : '600', color : 'white'}}>Almost Always</Text>
                    </TouchableOpacity>
                </View>

            </View>
            }

            {selectedQuestionNo > 28 &&
            <View style={{  flex : 1, padding : 16, alignItems : 'center', justifyContent : 'space-between'}}>
            <Image
            source={require('../../assets/images/pinkBrain.png')}
            style={{ width: 80, aspectRatio: 1, height: undefined }}
          />
          <Text style={{color : 'white',textAlign : 'center', fontSize : 24, fontWeight : '400'}}>Great job ! {'\n'}
          Thank you for your time. 
          </Text>
          <Text style={{color : '#A8A8A8',textAlign : 'center', fontSize : 14, fontWeight : '700'}}>
          You will receive your mental skill value shortly.
          </Text>

          <View style={{width : Dimensions.get('window').width,paddingHorizontal : 20}}>
            
          {/* <TouchableOpacity
              onPress={() => {
                // navigation.navigate('CourseDetail');
                // setVisible(true)
                nav.navigate('PsyReport')

              }}
              style={[styles.moreInfoBtn,{marginTop : 17,paddingVertical : 10}]}
            >
              <Text style={styles.btnTextt}>Report</Text>
             
            </TouchableOpacity> */}
          <TouchableOpacity
              onPress={() => {
                // navigation.navigate('CourseDetail');
                // setVisible(true)
                
                // total marks 
                let totalMarks = questions.reduce((acc,element)=>{
                    return acc + Number(element.ans)
                },0)
                let totalPercentage = (100 * totalMarks ) / (28 * 3)
                // total coping 
                let totalCoping = questions.filter((itm)=>{return [5,17,21,24].includes(itm.queNo)}).reduce((acc,element)=>{
                  return acc + Number(element.ans)
                },0)
                let totalCopingPecentage = (100 * totalCoping ) / (4 * 3)
                 // total coachability 
                 let totalCoachability = questions.filter((itm)=>{return [3,10,15,27].includes(itm.queNo)}).reduce((acc,element)=>{
                  return acc + Number(element.ans)
                },0)
                let totalCoachabilityPecentage = (100 * totalCoachability ) / (4 * 3)
                 // total concentration 
                 let totalConcentration = questions.filter((itm)=>{return [4,11,16,25].includes(itm.queNo)}).reduce((acc,element)=>{
                  return acc + Number(element.ans)
                },0)
                let totalConcentrationPecentage = (100 * totalConcentration ) / (4 * 3)
                  // total confidence 
                  let totalConfidence = questions.filter((itm)=>{return [2,9,14,26].includes(itm.queNo)}).reduce((acc,element)=>{
                    return acc + Number(element.ans)
                  },0)
                  let totalConfidencePecentage = (100 * totalConfidence ) / (4 * 3)
                  // total goal 
                  let totalGoal = questions.filter((itm)=>{return [1,8,13,20].includes(itm.queNo)}).reduce((acc,element)=>{
                    return acc + Number(element.ans)
                  },0)
                  let totalGoalPecentage = (100 * totalGoal ) / (4 * 3)
                   // total peacking 
                   let totalPeaking = questions.filter((itm)=>{return [6,18,22,28].includes(itm.queNo)}).reduce((acc,element)=>{
                    return acc + Number(element.ans)
                  },0)
                  let totalPeakingPecentage = (100 * totalPeaking ) / (4 * 3)
                   // total freedom 
                   let totalFreedom = questions.filter((itm)=>{return [7,12,19,23].includes(itm.queNo)}).reduce((acc,element)=>{
                    return acc + Number(element.ans)
                  },0)
                  let totalFreedomPecentage = (100 * totalFreedom ) / (4 * 3)

                console.log("total marks ",totalMarks)
                console.log("total percentage ",totalPercentage)
                console.log("total coping ",totalCoping)
                console.log("total coping percentage ",totalCopingPecentage)
                console.log("total coachability ",totalCoachability)
                console.log("total coachability percentage ",totalCoachabilityPecentage)
                console.log("total concentration ",totalConcentration)
                console.log("total concentartion percentage ",totalConcentrationPecentage)
                console.log("total confidence ",totalConfidence)
                console.log("total confidence percentage ",totalConfidencePecentage)
                console.log("total goal ",totalGoal)
                console.log("total goal percentage ",totalGoalPecentage)
                console.log("total peacking ",totalPeaking)
                console.log("total peacking percentage ",totalPeakingPecentage)
                console.log("total freedom ",totalFreedom)
                console.log("total freedom percentage ",totalFreedomPecentage)

                if(!isLoading){
                  submitTestFn(totalPercentage,totalCopingPecentage,totalCoachabilityPecentage,totalConcentrationPecentage,totalConfidencePecentage,totalGoalPecentage,totalPeakingPecentage,totalFreedomPecentage)
                }

                // Alert.alert(`Your Score ${totalPercentage}%`, String(totalMarks))

              }}
              style={[styles.moreInfoBtn,{marginTop : 17,paddingVertical : 10}]}
            > 
              <Text style={styles.btnTextt}>{isLoading ? 'Submitting...' : 'Done'}</Text>
             
            </TouchableOpacity>

          </View>

            </View>

            }

            {/* <Text style={{color : 'white'}}>
                {questions?.find((it)=> it.queNo == 1)?.image}
            </Text> */}


          

        </View>
      </Modal>


  </View>
  )
}