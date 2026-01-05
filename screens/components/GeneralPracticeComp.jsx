import { View, Text, Image, TouchableOpacity, Modal, Platform, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../Style';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData,postJSONData} from '../../helper/callApi'


export default function GeneralPracticeComp({selectedDate,athleteCourseId,athleteCompletedCourseId}) {
  const [visible, setVisible] = useState(false);

  const [message, setMessage] = useState('')

  const [toggler, setToggler] = useState(false)

  const [notesList, setNotesList] = useState([])
  const [catList, setCatList] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const [updatingId, setUpdatingId] = useState('')

  const navigation = useNavigation();

    useEffect(() => {
        const controller = new AbortController();
        getCatList(controller)
        return ()=>{
          controller.abort();
        }
      }, [])
    useEffect(() => {
        const controller = new AbortController();
        getNotsListFn(controller)
        return ()=>{
          controller.abort();
        }
      }, [toggler,selectedDate,athleteCompletedCourseId])

      async function getNotsListFn(controller) {
        const branch = await AsyncStorage.getItem('branch_slug')
        const respo = await getData(branch,'/athlete/diary/note-list',{
          "athlete_course_id" : athleteCourseId,
          "athlete_completed_course_program_id" : athleteCompletedCourseId
        },controller)
        if(respo.status){
          console.log('ntes list',respo)
          setNotesList(respo.data.diary_note_list)

        }
      }
      async function getCatList(controller) {
        const branch = await AsyncStorage.getItem('branch_slug')
        const respo = await getData(branch,'/masters/general-practice-category/branch/all-list',{},controller)
        if(respo.status){
          console.log('cat list',respo)
          setCatList(respo.data.list.map((it)=>{
            return {
              label :it.category_name , value : it.id
            }
          }))

        }
      }

     
      async function addnoteFn() {

        if(!athleteCompletedCourseId){
          Alert.alert('You can not perform this action')
          return
        }
        if(!selectedCategoryId){
          Alert.alert('Please choose category!!')
          return
        }
        const branch = await AsyncStorage.getItem('branch_slug')
        const respo = await postJSONData(branch,`/athlete/diary/${updatingId ? 'update-note' : 'add-note' }`,{
          "athlete_course_id": athleteCourseId,
          "general_practice_category_id": selectedCategoryId,
          "note":message,
          "athlete_completed_course_program_id": athleteCompletedCourseId,
          "diary_note_id" : updatingId,

        })
      
        if(respo.status){
          setVisible(false)
          setToggler(s=>!s)
          setSelectedCategoryId('')
          setMessage('')
        }
      }
      async function dltNoteFn(idd) {

       
        const branch = await AsyncStorage.getItem('branch_slug')
        const respo = await postJSONData(branch,'/athlete/diary/delete-note',{
          "diary_note_id": idd,
        })
      
        if(respo.status){
          setToggler(s=>!s)
          Alert.alert('Note deleted successfully!')
        }
      }

  return (
    <View style={{ padding: 16, borderRadius: 16, backgroundColor: '#202020' }}>
      <View>
        {notesList?.length == 0 &&
          <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            color: '#A8A8A8',
            lineHeight: 30,
          }}
        >
          {' '}
          🗒 {'\n'}To start adding note, tap to add new
        </Text>
        }
        

        {notesList?.map((itm,index)=>{
          return(
        <View key={index}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                marginTop: 0,
                flexDirection: 'row',
                columnGap: 10,
                alignItems: 'center',
              }}
            >
              <Text style={styles.staMonthText}>{itm?.display_created_date}</Text>
              <View
                style={{
                  backgroundColor: '#A8A8A8',
                  height: 5,
                  width: 5,
                  borderRadius: 5,
                }}
              ></View>
              <Text style={styles.staMonthText}>{itm?.edited_before_span}</Text>
            </View>

            <TouchableOpacity onPress={()=>{
               Alert.alert(
                'Choose an action',
                'Choose and perform Edit / Delete',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', onPress: () => dltNoteFn(itm.id) },
                  { text: 'Edit', onPress: () => {
                    setVisible(true);
                    setUpdatingId(itm.id)
                    setSelectedCategoryId(itm.general_practice_category_id)
                    setMessage(itm.note)
                  } },
                ],
                { cancelable: true }
              );
            }}>
              <Image
                source={require('../../assets/images/options.png')}
                style={{ width: 24, aspectRatio: 1, height: undefined }}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: 'white',
              fontWeight: '600',
            }}
          >
           {itm?.category_name}
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 14,
              color: '#A8A8A8',
              fontWeight: '400',
            }}
          >
            {itm?.note}
          </Text>
          <View
            style={{
              marginVertical: 10,
              borderTopColor: '#383838',
              borderTopWidth: 0.5,
            }}
          ></View>
        </View>
        )
      })}
       
      </View>

      <TouchableOpacity
        onPress={() => {
          setUpdatingId('')
          setSelectedCategoryId('')
          setMessage('')
          setVisible(true);
          return;
          navigation.navigate('Home');
        }}
        style={[styles.moreInfoBtn,{paddingVertical : 10}]}
      >
        <Text style={styles.btnTextt}>Add New</Text>
      </TouchableOpacity>

      {/* add new modal  */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        

        <View style={{ flex: 1 }}>
            <View style={{marginTop : 100}}></View>
          <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={1}
            // overlayColor="transparent"
            // reducedTransparencyFallbackColor="white"
          />
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
              General Practice
            </Text>
            <TouchableOpacity onPress={()=>{setVisible(false)}}
              style={{ position: 'absolute', top: '50%', right: 16 }}
            >
              <Image
                style={{ height: undefined, width: 32, aspectRatio: 1 }}
                source={require('../../assets/images/cll.png')}
              />
            </TouchableOpacity>
          </View>
          <RNPickerSelect
      onValueChange={(value) => setSelectedCategoryId(value)}
      useNativeAndroidPickerStyle={false}
      items={catList}
    >
      <View style={{paddingHorizontal : 16, }}>
        <View style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 16, backgroundColor : '#202020', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{catList?.find((it)=> it.value == selectedCategoryId)?.label || 'Choose option'}</Text>
            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../../assets/images/donArrr.png')}/>
        </View>
        </View>



        </RNPickerSelect>


        <TextInput
         multiline={true}                // important
         numberOfLines={5} 
         textAlignVertical="top" 
        style={{marginTop : 16, marginHorizontal : 16,paddingVertical : 12, paddingHorizontal : 20, borderRadius : 16, backgroundColor : '#202020',minHeight : 200,color : 'white'}}
        placeholder="Type here..."
        value={message} // <-- bind value
        onChangeText={text => setMessage(text)} // <-- update state
      />

      <TouchableOpacity onPress={()=>{
        if(message && selectedCategoryId){
          addnoteFn()
        }else{
          Alert.alert('Please enter details')
        }
        
      }} style={{marginTop : 16, paddingHorizontal : 16}}>
        <Text style={{textAlign : 'center', padding : 10 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}>{updatingId ? 'Update' : 'Save'}</Text>
      </TouchableOpacity>


          </View>

        </View>
      </Modal>
    </View>
  );
}
