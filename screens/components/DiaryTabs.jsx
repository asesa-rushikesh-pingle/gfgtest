import { View, Text, TouchableOpacity, Dimensions, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Accordion from 'react-native-collapsible/Accordion';
import styles from '../Style';
import GeneralPracticeComp from '../components/GeneralPracticeComp'
import ScoreCardComp from '../components/ScoreCardComp'
import ScoreCardCompByCoach from '../components/ScoreCardCompByCoach'
import MentailTrainingComp from '../components/MentailTrainingComp'

const SECTIONS = [
    {
      index : 0,
      title: 'General Practice',
      image : require('../../assets/images/oneone.png'),
      content: 'Lorem ipsum...',
    },
    {
        index : 1,

      title: 'Training / Score Card',
      image : require('../../assets/images/onetwo.png'),
      content: 'Lorem ipsum...',
    },
    // {
    //     index : 2,

    //   title: 'Mental Training',
    //   image : require('../../assets/images/onetrhree.png'),
    //   content: 'Lorem ipsum...',
    // },
  ];


  



export default function DiaryTabs({selectedDate,athleteCourseId,athleteCompletedCourseId}) {

  const SECTIONS_BY_COACH = [
   
    {
        index : 0,

      title: 'Training / Score Card',
      image : require('../../assets/images/onetwo.png'),
      content: <ScoreCardCompByCoach/>,
    },
    
  ];

  
  

  const [activeTab, setActiveTab] = useState('My Diary')

    const [activeSections, setActiveSections] = useState([]);
    const [activeSectionsByCoach, setActiveSectionsByCoach] = useState([]);

    useEffect(() => {
      // if (activeTab === 'My Diary') {
      //   setActiveSections([0]);
      // }
      // if (activeTab === 'By Coach') {
      //   setActiveSectionsByCoach([0]);
      // }
      setActiveSections([])
      setActiveSectionsByCoach([])
    }, [activeTab]);

    const renderSectionTitle = (section) => (
        <View style={styles.content}>
          {/* <Text style={{color : 'white'}}>{section.title}</Text> */}
        </View>
      );

      const renderHeader = (section) => (
        <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 10,paddingVertical : 11}}>
              <Image source={section.image} style={{height : undefined, width : 22, aspectRatio :1, }}/>
              <Text style={{fontSize : 16 , fontWeight : '600', lineHeight : 22, color : 'white'}}>{section.title}</Text>
            </View>
            <Image source={require('../../assets/images/riarrhere.png')} style={{height : undefined, width : 24, aspectRatio :1, transform: [{ rotate:  activeSections.includes(section.index) ? '90deg' :  '0deg' }] }}/>

        </View>
      );
      // const renderHeaderByCoach = (section) => (
      //   <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between'}}>
      //       <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 10,paddingVertical : 11}}>
      //         <Image source={section.image} style={{height : undefined, width : 22, aspectRatio :1, }}/>
      //         <Text style={{fontSize : 16 , fontWeight : '600', lineHeight : 22, color : 'white'}}>{section.title}</Text>
      //       </View>
      //       <Image source={require('../../assets/images/riarrhere.png')} style={{height : undefined, width : 24, aspectRatio :1, transform: [{ rotate:  activeSectionsByCoach.includes(section.index) ? '90deg' :  '0deg' }] }}/>

      //   </View>
      // );
      const renderHeaderByCoach = (section, index, isActive) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingVertical: 11 }}>
            <Image source={section.image} style={{ width: 22, aspectRatio: 1 }} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
              {section.title}
            </Text>
          </View>
          <Image
            source={require('../../assets/images/riarrhere.png')}
            style={{
              width: 24,
              aspectRatio: 1,
              transform: [{ rotate: isActive ? '90deg' : '0deg' }],
            }}
          />
        </View>
      );

      const renderContent = (section) => (
        <View style={styles.content}>
            {activeSections.includes(0) &&
            <GeneralPracticeComp selectedDate={selectedDate} athleteCourseId={athleteCourseId} athleteCompletedCourseId={athleteCompletedCourseId}/>
            }
            {activeSections.includes(1) &&
            <ScoreCardComp selectedDate={selectedDate} athleteCourseId={athleteCourseId} athleteCompletedCourseId={athleteCompletedCourseId}/>
            }
            {/* {activeSections.includes(2) &&
            <MentailTrainingComp/>
            } */}
        </View>
      );
      const renderContentByCoach = (section) => (
        <View style={styles.content}>
            {section.content}
        </View>
      );

      const updateSections = (sections) => {
        setActiveSections(sections);
      };
      const updateSectionsByCoach = (sections) => {
        setActiveSectionsByCoach(sections);
      };

  return (
    <View style={{marginTop : 25, paddingHorizontal : 16}}>
        <View style={{flexDirection : 'row',padding : 2, backgroundColor : '#202020', borderRadius : 8,marginBottom : 25,}}>
            <TouchableOpacity style={{width : (Dimensions.get('window').width - 35) / 1,}} onPress={()=>{setActiveTab('My Diary')}} >
                <Text style={{backgroundColor : activeTab == 'My Diary' ?  '#636366' : 'transparent', textAlign : 'center',  paddingVertical : 6, paddingHorizontal : 8, borderRadius : 7,  color : 'white', fontSize : 13, lineHeight : 20, fontWeight : '400'}}>My Diary</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{width : (Dimensions.get('window').width - 32 )/ 3,}} onPress={()=>{setActiveTab('By Coach')}} >
                <Text style={{backgroundColor : activeTab == 'By Coach' ?  '#636366' : 'transparent', textAlign : 'center',  paddingVertical : 6, paddingHorizontal : 8, borderRadius : 7, color : 'white', fontSize : 13, lineHeight : 20, fontWeight : '400'}}>By Coach</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width : (Dimensions.get('window').width - 32) / 3,}} onPress={()=>{setActiveTab('Mood')}}>
                <Text style={{backgroundColor : activeTab == 'Mood' ?  '#636366' : 'transparent', textAlign : 'center',  paddingVertical : 6, paddingHorizontal : 8, borderRadius : 7, color : 'white', fontSize : 13, lineHeight : 20, fontWeight : '400'}}>Mood</Text>
            </TouchableOpacity> */}
        </View>

        {activeTab == 'My Diary' &&
         <Accordion
         sections={SECTIONS}
         activeSections={activeSections}
         renderSectionTitle={renderSectionTitle}
         renderHeader={renderHeader}
         renderContent={renderContent}
         onChange={updateSections}
       />
        }

       
{/* {activeTab == 'By Coach' &&
 <Accordion
 sections={SECTIONS_BY_COACH}
 activeSections={activeSectionsByCoach}
 renderSectionTitle={renderSectionTitle}
 renderHeader={renderHeaderByCoach}
 renderContent={renderContentByCoach}
 onChange={updateSectionsByCoach}
/>

} */}
       

    </View>
  )
}