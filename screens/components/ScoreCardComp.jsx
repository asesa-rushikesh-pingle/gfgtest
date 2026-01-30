import { View, Text, Image, TouchableOpacity, Modal, Platform, TextInput, Dimensions, StyleSheet, Alert } from 'react-native';
import React, { useState ,useRef, useEffect} from 'react';
import styles from '../Style';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData,postFormData,postJSONData} from '../../helper/callApi'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';



const { width } = Dimensions.get('window');
export default function ScoreCardComp({selectedDate,athleteCourseId,athleteCompletedCourseId}) {
  const [visible, setVisible] = useState(false);


  const [selected, setSelected] = useState('')
    const [updatingId, setUpdatingId] = useState('')
  

  const navigation = useNavigation();

  const [values, setValues] = useState([{text : ''},{text : ''},{text : ''},{text : ''},{text : ''},{text : ''},{text : ''},{text : ''},{text : ''},{text : ''}]);
  const inputRefs = useRef([]);

  const [focusedIndex, setFocusedIndex] = useState(null);

  const [toggler, setToggler] = useState(false)
  
  const [scoreCardList, setscoreCardList] = useState([])
  const [catList, setCatList] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  const [uploadedUri, setUploadedUri] = useState('')

  const [isLoadinng, setIsLoadinng] = useState(false)

  const handleChange = (text, index) => {
    console.log(values)
    console.log('index is ',index)
    
    setValues(prev => {
      const newValues = [...prev];

      let upValues = newValues?.map((ma,maindex)=>{
        if(maindex == index){
          return {...ma, text : text}
        }else{
          return {...ma, text : ma.text}
        }

      }) 
      // console.log('newValues',newValues)
     
      // console.log('Updated values:', newValues);
      console.log('updaTED',upValues)
      return upValues;
    });
  };

  // Take Photo
const takePhoto = async (inndexx) => {

  try {

    const result = await launchCamera({ mediaType: 'photo' });
  
  if (result.assets && result.assets.length > 0) {
   
    // uploadImage(result.assets[0].uri);
    console.log(result.assets[0].uri)
    setUploadedUri(result.assets[0].uri)

    setValues((prevArr)=>{

      let updated = prevArr?.map((it,itINNDEX)=>{
        if(itINNDEX == inndexx){
          return {...it, uriUploaded : {uri : result.assets[0].uri,  name: 'photo.jpg', type: 'image/jpeg',}}
        }else{
          return {...it}
        }
      })
  
      return updated
    })
  }
    
  } catch (error) {
    Alert.alert('in catch block')
    
  }
  
  


};

     useEffect(() => {
          const controller = new AbortController();
          getCatList(controller)
          return ()=>{
            controller.abort();
          }
        }, [])

          useEffect(() => {
                const controller = new AbortController();
                getScroreCardListFn(controller)
                // Alert.alert(String(athleteCompletedCourseId),'athleteCompletedCourseId')
                return ()=>{
                  controller.abort();
                }
              }, [toggler,selectedDate,athleteCompletedCourseId])

              async function getScroreCardListFn(controller) {
                // let athlete_completed_course_program_id = await AsyncStorage.getItem('athlete_completed_course_program_id')
                // Alert.alert('async ',athlete_completed_course_program_id)
                const branch = await AsyncStorage.getItem('branch_slug')
                const respo = await getData(branch,'/athlete/training/get-score-card-list',{
                  athlete_completed_course_program_id : athleteCompletedCourseId,
                  athlete_course_id : athleteCourseId
                },controller)
                if(respo.status){
                  console.log('scrorecard list',respo)
                  // setNotesList(respo.data.diary_note_list)
                  setscoreCardList(respo.data.scoreCardList)
        
                }
              }

        async function getCatList(controller) {
          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await getData(branch,'/masters/score-card-category/branch/all-list',{},controller)
          if(respo.status){
            console.log('scrore cat  list',respo)
            setCatList(respo.data.list.map((it)=>{
              return {
                label :it.category_name , value : it.id
              }
            }))
  
          }
        }

        async function addScoreFn() {

          if(!athleteCompletedCourseId){
            Alert.alert('You can not perform this action')
            return
          }
          if(!selectedCategoryId){
            Alert.alert('Please choose category!!')
            return
          }

          

          let payoad = values?.map((itt,index)=>{
            return {
              "key": `Round ${index + 1}`,
              "score": itt.text ? Number(itt.text) : null,
              "image" : itt?.uriUploaded || null
            }
          })
          console.log(payoad)
          // uriUploaded

          let formData = new FormData()
          formData.append('score_card_category_id',selectedCategoryId)
          formData.append('athlete_course_id',athleteCourseId)
          formData.append('athlete_completed_course_program_id',athleteCompletedCourseId)
          formData.append('score_card_id',updatingId)

          payoad?.forEach((itm,itmIndex)=>{
            formData.append(`score_card[${itmIndex}][key]`,itm.key)
            formData.append(`score_card[${itmIndex}][score]`,itm.score || 0)
            if(itm?.image){
              formData.append(`score_card[${itmIndex}][image]`,itm.image)
            }
          })

          console.log('formData',formData)



          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await postFormData(branch,`/athlete/training/${updatingId ? 'update-score-card' : 'add-score-card'}`,formData,setIsLoadinng)
          // const respo = await postJSONData(branch,`/athlete/training/${updatingId ? 'update-score-card' : 'add-score-card'}`,{
          //   "athlete_course_id": athleteCourseId,
          //   "score_card_category_id": selectedCategoryId,
          //   "score_card": payoad,
          //   "athlete_completed_course_program_id": athleteCompletedCourseId,
          //   "score_card_id": updatingId
          // })
        
          if(respo.status){
            setVisible(false)
            setToggler(s=>!s)
            setSelectedCategoryId('')
            setValues(Array(10).fill({'text' : ''}))  
            setUpdatingId('')
          }
        }

        async function dltScoreFn(idd) {

       
          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await postJSONData(branch,'/athlete/training/delete-score-card',{
            "score_card_id": idd,
          })
        
          if(respo.status){
            setToggler(s=>!s)
            Alert.alert('Scorecard deleted successfully!')
          }
        }

  return (
    <View style={{ padding: 10, borderRadius: 16, backgroundColor: '#202020' }}>
      <View>
        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            color: '#A8A8A8',
            lineHeight: 30,
          }}
        >
          {' '}
          🗒 {'\n'}To start adding Score, tap to add new
        </Text>
        {scoreCardList?.map((item,index)=>{
          return (
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
              <Text style={styles.staMonthText}>{item?.display_created_date}</Text>
              <View
                style={{
                  backgroundColor: '#A8A8A8',
                  height: 5,
                  width: 5,
                  borderRadius: 5,
                }}
              ></View>
              <Text style={styles.staMonthText}>{item?.created_before_span}</Text>
            </View>

            <TouchableOpacity onPress={()=>{
               Alert.alert(
                              'Choose an action',
                              'Choose and perform Edit / Delete',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', onPress: () => dltScoreFn(item.id) },
                                { text: 'Edit', onPress: () => {
                                  setVisible(true);
                                  setUpdatingId(item.id)
                                  setSelectedCategoryId(item.score_card_category_id)
                                  setValues(item.score_card?.map((element)=>{
                                    if(element.score){
                                      // console.log({...element, text : String(element.score)})
                                      return  {...element, text : String(element.score)}
                                    }else{
                                      // console.log({...element, text : ''})
                                      return {...element, text : ''}
                                    }

                                  }))
                                } },
                                // { text: 'Edit', onPress: () => console.log('Edit Pressed') },
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
            {item?.category_name}
          </Text>
          <View style={{flexDirection : 'row',marginTop : 10, alignItems : 'center', justifyContent : 'flex-start', flexWrap : 'wrap', gap : 12}}>
            {item?.score_card?.map((el,inx)=>{
              return(
                <View key={inx} style={{padding : 5, borderRadius : 5, backgroundColor : '#383838', width : (Dimensions.get('window').width - 100) / 5 }}>
                <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>{el?.key}</Text>
                <Text style={{color : 'white',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>{el?.score || '00'}</Text>
                <Image
               
            //  source={{uri : 'https://vivopune.com/backend/public/products-images/x300-pro-10347361-1764826527_0.webp'}}
             source={{uri : el?.image_url}}
             style={{ width: '100%', height: 45, borderRadius : 10,marginTop : 5 }}
             /> 
                
             {/* <Text>{el?.image_url}</Text> */}
                </View>
              )
            })}
           
           
           
           
          </View>
          <View style={{flexDirection : 'row', alignItems : 'center',justifyContent : 'center', columnGap : 10,padding :5,borderRadius : 6, borderColor : '#383838', borderWidth : 1,marginTop : 10,}}>
          <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Total Score</Text>
            <Text style={{color : 'white',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>{item?.totalScoreCard || '00'            }</Text>
            
          </View>
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

          setVisible(true);
          setSelectedCategoryId('')
          setUpdatingId('')
          setValues(Array(10).fill({text : ''}))
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
              Training / Score Card
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
            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{catList?.find((it)=> it.value == selectedCategoryId)?.label  || 'Choose option'}</Text>
            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../../assets/images/donArrr.png')}/>
        </View>
        </View>



        </RNPickerSelect>


       {/* rounds here  */}
       <View style={{paddingHorizontal : 16, marginTop : 16}}>

       
       <View style={stylesNew.roundSection}>
              {values.map((val, index) => (
                <View  key={`round-${index}`}>

                <TouchableOpacity
                  // key={`round-${index}`}
                  style={[
                    stylesNew.roundClick,
                    focusedIndex === index && stylesNew.activeBorder,
                  ]}
                  onPress={() => inputRefs.current[index]?.focus()}
                >
                  <Text style={stylesNew.roundText}>Round {index + 1}</Text>
                  <TextInput
                    ref={el => (inputRefs.current[index] = el)}
                    style={stylesNew.input}
                    placeholder="00"
                    keyboardType="numeric"
                    placeholderTextColor="#656565"
                    value={val.text}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    onChangeText={text => handleChange(text, index)}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={[stylesNew.uploadbutton,{width : '100%', marginTop : 5}]} onPress={()=>{
                takePhoto(index)
              }}>
                 <Image
                  source={require('../../assets/images/drive_folder_upload.png')}
                  style={{ width: 24, height: 24 }}
                /> 
                
              </TouchableOpacity>
              {val?.uriUploaded?.uri ?
               <Image
               source={{uri : val?.uriUploaded?.uri}}
               style={{ width: '100%', height: 45, borderRadius : 10,marginTop : 5 }}
              />  : val?.image_url ?
              <Image
              source={{uri : val?.image_url}}
              style={{ width: '100%', height: 45, borderRadius : 10,marginTop : 5 }}
              /> : null
                }
             
               {/* <Image
             source={{uri : val?.image_url}}
             style={{ width: '100%', height: 30, borderRadius : 10,marginTop : 5 }}
             /> 
             <Text style={{color : 'pink', width : 40, height : 40}}>{val?.image_url}</Text> */}
             </View>

              ))}
            </View>
            <View style={stylesNew.saveContainer}>
              {/* <TouchableOpacity style={stylesNew.uploadbutton} onPress={()=>{
                // takePhoto()
              }}>
                 <Image
                  source={require('../../assets/images/drive_folder_upload.png')}
                  style={{ width: 24, height: 24 }}
                /> 
                
              </TouchableOpacity> */}
             
              <TouchableOpacity onPress={()=>{
                if(!selectedCategoryId){
                  Alert.alert('Choose category')
                  return
                }
        addScoreFn()
      }} style={{ flex : 1}}>
        {isLoadinng ?
        <Text style={{textAlign : 'center', padding : 12 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}>{'Loading...'}</Text>
        : 
        <Text style={{textAlign : 'center', padding : 12 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}>{updatingId ? 'Update' : 'Save'}</Text>
        }
      </TouchableOpacity>
            </View>
        
            </View>


    


          </View>

        </View>
      </Modal>
    </View>
  );
}



const stylesNew = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000000ff',
    paddingHorizontal: 16,
  },
  modalView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
  },
  trainingText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff',
  },
  buttonClose: {
    height: 32,
    width: 32,
  },
  activeBorder: {
    borderColor: '#EB6925',
    borderWidth: 1,
  },
  roundSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexDirection: 'row',
    rowGap: 12,
    alignItems: 'flex-start',
    marginBottom: 26,
  },
  roundClick: {
    borderRadius: 5,
    backgroundColor: '#202020',
    padding: 5,
    width: (width - 80) / 5,
    alignItems: 'center',
  },
  roundText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },

  input: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff',
  },
  saveContainer: {
    columnGap : 16,
    display: 'flex',
    flexDirection: 'row',
  },
  uploadbutton: {
    borderRadius: 10,
    borderWidth: 0.5,
    backgroundColor: '#2B2B2B',
    borderColor: '#fff',
    width: 94,
    alignItems: 'center',
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: '#EB6925',
    borderRadius: 10,
    flex: 1,
    marginLeft: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
});
