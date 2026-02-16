import { View, Text, Image, TouchableOpacity, Modal, Pressable, Alert, Dimensions } from 'react-native'
import React, { useState } from 'react'
import styles from '../Style'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { postJSONData } from '../../helper/callApi'

export default function PsycologicalSkills({testArr=[],isTrstPer, testQuestios=[]}) {
    const [visible, setVisible] = useState(false)
    const [selectedQuestionNo, setSelectedQuestionNo] = useState(null)
    const [questions, setQuestions] = useState([])
    const [spycologicalTestId, setSpycologicalTestId] = useState('')
    const nav = useNavigation()
    const [isLoading, setIsLoading] = useState(false)


    async function setAnsQue(ansId) {

        setQuestions((arr)=>{

            let newarr = arr.map((item)=>{
                if(item.queNo == selectedQuestionNo){
                    return {...item,selectedOptionId : ansId}
                }else{
                    return item
                }
            })

            console.log('new que array',newarr)
            return newarr
            
        })

        setSelectedQuestionNo(selectedQuestionNo + 1)
        
    }


    async function submitTestFn() {
      setIsLoading(true)
      const athleteCourseIdForGeneralCheckin = await AsyncStorage.getItem('athleteCourseIdForGeneralCheckincourse_id')
      if(!athleteCourseIdForGeneralCheckin){
        Alert.alert('Courseid not found')
        return
      }
      const branch = await AsyncStorage.getItem('branch_slug')

             


            let newQuestis = questions?.map((itm)=>{
              return {
                "question_id": itm.question_id,
                    "option_id": itm.selectedOptionId   
              }

            })
            console.log(newQuestis)

            
     

          const respo = await postJSONData(branch,'/athlete/add-mental-training-report',{
            
              "course_id" : Number(athleteCourseIdForGeneralCheckin),
              "psychological_test_id" : spycologicalTestId,
              "answers": newQuestis
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
        <Text style={[styles.staMonthText,{color : 'white', fontSize : 16,fontWeight : '500'}]}>{test?.test_name}</Text>

              <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.staMonthText}>{test?.created_date} </Text>
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
              {/* <Text style={{marginTop : 10,marginBottom : 10, color  : 'white', fontSize : 16, fontWeight : '500'}}>{getGrade(Number(test?.total_percentage))}</Text> */}
              <Text style={{marginTop : 10,marginBottom : 10, color  : 'white', fontSize : 16, fontWeight : '500'}}>{test.grade || ''}</Text>
              <Text style={{marginBottom : 10, width: ((Dimensions.get('window').width - 52) * Number(test?.total_percentage)) / 100, color  : 'white', fontSize : 16, fontWeight : '500',paddingVertical : 1, paddingHorizontal : 10,backgroundColor : Number(test?.total_percentage) < 40 ? '#FF6568' : '#008644', borderRadius  : 4,lineHeight : 24}}>{Number(test?.total_percentage)?.toFixed(0)}%</Text>


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

                console.log(testQuestios[0].questions)
                console.log("psychological_test_id",testQuestios[0].psychological_test_id)
                setSpycologicalTestId(testQuestios[0].psychological_test_id)
                let updatedQueArr = testQuestios[0].questions?.map((itm)=>{
                  return {...itm, selectedOptionId : null}
                })
                setQuestions(updatedQueArr)
                // setQuestions([
                //   {
                //     queNo: 1,
                //     image: require(`../../assets/images/que1.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 2,
                //     image: require(`../../assets/images/que2.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1, 
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 3,
                //     image: require(`../../assets/images/que3.png`),
                //     ans: null,
                //     opt1: 3,
                //     opt2: 2,
                //     opt3: 1,
                //     opt4: 0,
                //   },
                //   {
                //     queNo: 4,
                //     image: require(`../../assets/images/que4.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 5,
                //     image: require(`../../assets/images/que5.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 6,
                //     image: require(`../../assets/images/que6.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 7,
                //     image: require(`../../assets/images/que7.png`),
                //     ans: null,
                //     opt1: 3,
                //     opt2: 2,
                //     opt3: 1,
                //     opt4: 0,
                //   },
                //   {
                //     queNo: 8,
                //     image: require(`../../assets/images/que8.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 9,
                //     image: require(`../../assets/images/que9.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 10,
                //     image: require(`../../assets/images/que10.png`),
                //     ans: null,
                //     opt1: 3,
                //     opt2: 2,
                //     opt3: 1,
                //     opt4: 0,
                //   },
                //   {
                //     queNo: 11,
                //     image: require(`../../assets/images/que11.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 12,
                //     image: require(`../../assets/images/que12.png`),
                //     ans: null,
                //     opt1: 3,
                //     opt2: 2,
                //     opt3: 1,
                //     opt4: 0,
                //   },
                //   {
                //     queNo: 13,
                //     image: require(`../../assets/images/que13.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 14,
                //     image: require(`../../assets/images/que14.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 15,
                //     image: require(`../../assets/images/que15.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 16,
                //     image: require(`../../assets/images/que16.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 17,
                //     image: require(`../../assets/images/que17.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 18,
                //     image: require(`../../assets/images/que18.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 19,
                //     image: require(`../../assets/images/que19.png`),
                //     ans: null,
                //     opt1: 3,
                //     opt2: 2,
                //     opt3: 1,
                //     opt4: 0,
                //   },
                //   {
                //     queNo: 20,
                //     image: require(`../../assets/images/que20.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 21,
                //     image: require(`../../assets/images/que21.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 22,
                //     image: require(`../../assets/images/que22.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 23,
                //     image: require(`../../assets/images/que23.png`),
                //     ans: null,
                //     opt1: 3,
                //     opt2: 2,
                //     opt3: 1,
                //     opt4: 0,
                //   },
                //   {
                //     queNo: 24,
                //     image: require(`../../assets/images/que24.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 25,
                //     image: require(`../../assets/images/que25.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 26,
                //     image: require(`../../assets/images/que26.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 27,
                //     image: require(`../../assets/images/que27.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                //   {
                //     queNo: 28,
                //     image: require(`../../assets/images/que28.png`),
                //     ans: null,
                //     opt1: 0,
                //     opt2: 1,
                //     opt3: 2,
                //     opt4: 3,
                //   },
                // ]);
                
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
                <Text style={{color : '#656565', fontSize : 16, fontWeight : '600',opacity : (selectedQuestionNo > 0 && selectedQuestionNo <= questions?.length) ? 1 : 0}}><Text style={{color : '#fff', fontSize : 26, fontWeight : '600'}}>{selectedQuestionNo}</Text>/{questions?.length}</Text>
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
            {(selectedQuestionNo > 0 && selectedQuestionNo <= questions?.length) &&
            <View style={{flex : 1, }}>
                {/* <Image
                // source={require(`../../assets/images/${questions?.find((it)=> it.queNo == 1)?.image}`)}
                source={questions?.find((it)=> it.queNo == selectedQuestionNo)?.image} style={{width : Dimensions.get('window').width, height : undefined, aspectRatio : 1}} 
                /> */}
                <Text style={{color : 'white', backgroundColor : 'black', paddingHorizontal : 16, paddingVertical : 16, fontSize : 22, fontWeight : '500', marginBottom : 20}}>
                  {questions?.find((it)=> it.queNo == selectedQuestionNo)?.queText}
                  
                </Text>
                <View>
                {questions?.find((it)=> it.queNo == selectedQuestionNo)?.options?.map((opt,optIndex)=>{
                  return (
                    <TouchableOpacity key={optIndex} onPress={()=>{setAnsQue(opt?.id)}} style={{paddingLeft : '5%',marginTop : 10,marginHorizontal : 16, padding : 10,paddingVertical : 16, backgroundColor : '#2B2B2B', borderRadius : 10, flexDirection : 'row',alignItems : 'center', columnGap : 14}}>
                    {/* <Image source={require('../../assets/images/opt1.png')} style={{width  : 40 , height : undefined, aspectRatio : 1}}/>  */}
                    <Text style={{fontSize : 16 ,fontWeight : '600', color : 'white'}}>{opt?.optionText}</Text>
                 </TouchableOpacity>
                  )
                })}
                   
                </View>

            </View>
            }

            {selectedQuestionNo > questions?.length &&
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

                if(!isLoading){
                  submitTestFn()
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