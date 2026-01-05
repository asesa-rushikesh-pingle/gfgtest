import { View, Text, Image, TouchableOpacity, Modal, Platform, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import styles from '../Style';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';


export default function MentailTrainingComp() {
  const [visible, setVisible] = useState(false);

  const [selected, setSelected] = useState('')
  const [message, setMessage] = useState('')

  const [timeArr, setTimeArr] = useState(['30 min','1 hour','1 hour 30 min','2 hours'])

  const [selectedTime, setSelectedTime] = useState('30 min')

  const navigation = useNavigation();
  return (
    <View style={{ padding: 16, borderRadius: 16, backgroundColor: '#202020' }}>
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
          🗒 {'\n'}To start adding courses, tap to add new
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
          <View style={{flexDirection : 'row', alignItems : 'center', justifyContent :'space-between', columnGap : 5,marginTop : 10}}>

          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: 'white',
              fontWeight: '600',
            }}
          >
            Meditation
          </Text>
          <View style={{ width : 120,  paddingVertical : 5, paddingHorizontal : 10, backgroundColor : '#383838', borderRadius : 5, }}>
          <Text style={styles.staMonthText}>10 min ago</Text>
          <Text style={{marginTop : 16 , color : 'white', fontSize : 20, fontWeight : '700', lineHeight : 22}}>30 min</Text>


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
          <View style={{flexDirection : 'row', alignItems : 'center', justifyContent :'space-between', columnGap : 5,marginTop : 10}}>

          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: 'white',
              fontWeight: '600',
              width : Dimensions.get('window').width - 200
            }}
          >
            Hand and Eye Cordination
          </Text>
          <View style={{ width : 120,  paddingVertical : 5, paddingHorizontal : 10, backgroundColor : '#383838', borderRadius : 5, }}>
          <Text style={styles.staMonthText}>10 min ago</Text>
          <Text style={{marginTop : 16 , color : 'white', fontSize : 20, fontWeight : '700', lineHeight : 22}}>30 min</Text>


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
              Mental Training
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
        { label: 'Course 1', value: 'Course 1' },
        { label: 'Course 2', value: 'Course 2' },
        { label: 'Course 3', value: 'Course 3' },
        { label: 'Course 4', value: 'Course 4' },
        { label: 'Course 5', value: 'Course 5' },
      ]}
    >
      <View style={{paddingHorizontal : 16, }}>
        <View style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 16, backgroundColor : '#202020', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{selected || 'Choose option'}</Text>
            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../../assets/images/donArrr.png')}/>
        </View>
        </View>



        </RNPickerSelect>


<View style={{paddingHorizontal : 16, marginTop : 10}}>
       <Text style={{color : 'white', fontWeight : '500',fontSize : 16}}>Duration</Text>
       {timeArr?.map((item,index)=>{
        return (
          <TouchableOpacity onPress={()=>{setSelectedTime(item)}} key={index} style={{ borderColor : '#EB6925', borderWidth : item == selectedTime ? 1 : 0, height : 70, justifyContent : 'center', alignItems : 'center', marginTop : 10, borderRadius : 16 , backgroundColor : '#202020', }}>
          <Text style={{fontSize : 24, fontWeight : '300', color : 'white'}}>{item}</Text>
         </TouchableOpacity>
        )
       })}
      
       
</View>

      <TouchableOpacity onPress={()=>{
        setVisible(false)
      }} style={{marginTop : 16, paddingHorizontal : 16}}>
        <Text style={{textAlign : 'center', padding : 10 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}>Save</Text>
      </TouchableOpacity>


          </View>

        </View>
      </Modal>
    </View>
  );
}
