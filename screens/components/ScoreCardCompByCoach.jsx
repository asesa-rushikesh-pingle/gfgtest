import { View, Text, Image, TouchableOpacity, Modal, Platform, TextInput, Dimensions, StyleSheet } from 'react-native';
import React, { useState ,useRef} from 'react';
import styles from '../Style';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';


const { width } = Dimensions.get('window');
export default function ScoreCardCompByCoach() {
  const [visible, setVisible] = useState(false);


  const [selected, setSelected] = useState('')
  const [message, setMessage] = useState('')

  const navigation = useNavigation();

  const [values, setValues] = useState(Array(10).fill(''));
  const inputRefs = useRef([]);

  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChange = (text, index) => {
    setValues(prev => {
      const newValues = [...prev];
      newValues[index] = text;
      console.log('Updated values:', newValues);
      return newValues;
    });
  };

  return (
    <View style={{ padding: 10, borderRadius: 16, borderColor  : '#383838', borderWidth : .5 }}>
      <View>
        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            color: '#A8A8A8',
            lineHeight: 30,
          }}
        >
          Nothing to show !!
        </Text>
        <View>
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
              <Text style={styles.staMonthText}>Jan 15, 2024</Text>
              <View
                style={{
                  backgroundColor: '#A8A8A8',
                  height: 5,
                  width: 5,
                  borderRadius: 5,
                }}
              ></View>
              <Text style={styles.staMonthText}>10 min ago</Text>
            </View>

            <TouchableOpacity>
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
              color: '#A8A8A8',
              fontWeight: '600',
            }}
          >
            Season 1
          </Text>
          <View style={{flexDirection : 'row',marginTop : 10, alignItems : 'center', justifyContent : 'flex-start', flexWrap : 'wrap', gap : 12}}>
            <View style={{padding : 5, borderRadius : 5, borderWidth : .5, borderColor : '#383838', width : (Dimensions.get('window').width - 101) / 5 }}>
            <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Round 1</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>08</Text>
            </View>
            <View style={{padding : 5, borderRadius : 5, borderWidth : .5, borderColor : '#383838', width : (Dimensions.get('window').width - 101) / 5 }}>
            <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Round 1</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>08</Text>
            </View>
            <View style={{padding : 5, borderRadius : 5, borderWidth : .5, borderColor : '#383838', width : (Dimensions.get('window').width - 101) / 5 }}>
            <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Round 1</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>08</Text>
            </View>
            <View style={{padding : 5, borderRadius : 5, borderWidth : .5, borderColor : '#383838', width : (Dimensions.get('window').width - 101) / 5 }}>
            <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Round 1</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>08</Text>
            </View>
            <View style={{padding : 5, borderRadius : 5, borderWidth : .5, borderColor : '#383838', width : (Dimensions.get('window').width - 101) / 5 }}>
            <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Round 1</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>08</Text>
            </View>
            <View style={{padding : 5, borderRadius : 5, borderWidth : .5, borderColor : '#383838', width : (Dimensions.get('window').width - 101) / 5 }}>
            <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Round 1</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>08</Text>
            </View>
            <View style={{padding : 5, borderRadius : 5, borderWidth : .5, borderColor : '#383838', width : (Dimensions.get('window').width - 101) / 5 }}>
            <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Round 1</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>08</Text>
            </View>
           
          </View>
          <View style={{flexDirection : 'row', alignItems : 'center',justifyContent : 'center', columnGap : 10,padding :5,borderRadius : 6, borderColor : '#383838', borderWidth : 1,marginTop : 10,}}>
          <Text style={{color : '#A8A8A8', fontSize : 12, fontWeight : '400',textAlign : 'center'}}>Total Score</Text>
            <Text style={{color : '#A8A8A8',marginTop : 2, fontSize : 16, fontWeight : '600',lineHeight : 22,textAlign : 'center'}}>40</Text>
          </View>

          <View style={{borderRadius : 10, borderColor : '#656565',backgroundColor : '#202020', borderWidth : 1, marginTop : 13, padding : 10, }}>
            <View style={{transform : [{rotate: '45deg'}],position : 'absolute', top  : -4,zIndex : -1, left  : '50%' , height : 20, width : 20, borderWidth : 1, borderColor : '#656565',backgroundColor : '#656565'}}>

            </View>
            <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 10, }}>
            <Image
                source={require('../../assets/images/uuser.png')}
                style={{ width: 36,borderRadius : 50,  aspectRatio: 1, height: undefined }}
              />
              <View style={{flex : 1,paddingRight : 30}} > 
              <View
              style={{
                marginTop: 0,
                flexDirection: 'row',
                columnGap: 10,
                alignItems: 'center',
              }}
            >
              <Text style={[styles.staMonthText,{color : 'white', fontSize : 14, fontWeight : '500'}]}>Rodrigo Anderson</Text>
              <View
                style={{
                  backgroundColor: '#A8A8A8',
                  height: 5,
                  width: 5,
                  borderRadius: 5,
                }}
              ></View>
              <Text style={styles.staMonthText}>Senior Coach</Text>
            </View>
            <Text style={styles.staMonthText}>Jan 15, 2024</Text>

              </View>

              

            </View>
            <View style={{marginTop :16,alignItems : 'flex-start'}}>

                <Text style={{backgroundColor :'#383838',paddingVertical : 3, paddingHorizontal : 5, borderRadius : 5, color : 'white', fontSize : 12, }}>Keep It Up</Text>
              </View>
          </View>
          <View
            style={{
              marginVertical: 10,
              borderTopColor: '#383838',
              borderTopWidth: 0.5,
            }}
          ></View>
        </View>
       
        
      </View>

      <TouchableOpacity
        onPress={() => {
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
      onValueChange={(value) => setSelected(value)}
      useNativeAndroidPickerStyle={false}
      items={[
        { label: 'Training Season 1', value: 'Training Season 1' },
        { label: 'Training Season 2', value: 'Training Season 2' },
        { label: 'Training Season 3', value: 'Training Season 3' },
        { label: 'Training Season 4', value: 'Training Season 4' },
        { label: 'Training Season 5', value: 'Training Season 5' },
      ]}
    >
      <View style={{paddingHorizontal : 16, }}>
        <View style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 16, backgroundColor : '#202020', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{selected || 'Choose option'}</Text>
            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../../assets/images/donArrr.png')}/>
        </View>
        </View>



        </RNPickerSelect>


       {/* rounds here  */}
       <View style={{paddingHorizontal : 16, marginTop : 16}}>

       
       <View style={stylesNew.roundSection}>
              {values.map((val, index) => (
                <TouchableOpacity
                  key={`round-${index}`}
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
                    value={val}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    onChangeText={text => handleChange(text, index)}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={stylesNew.saveContainer}>
              <TouchableOpacity style={stylesNew.uploadbutton}>
                <Image
                  source={require('../../assets/images/drive_folder_upload.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
        setVisible(false)
      }} style={{ flex : 1}}>
        <Text style={{textAlign : 'center', padding : 12 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}>Save</Text>
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
    alignItems: 'center',
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
