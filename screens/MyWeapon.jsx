import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Alert,
  Keyboard,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import TitleBar from './components/TitleBar';
import Footer from './components/Footer';
import DiaryTabs from './components/DiaryTabs';
import styles from './Style';
import { BlurView } from '@react-native-community/blur';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import TextInputComp from '../screens/components/TextInputComp'
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData,postJSONData} from '../helper/callApi'
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function MyWeapon() {
  
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
    const [visible, setVisible] = useState(false);
      const [selectedCategoryId, setSelectedCategoryId] = useState('')
      const [weaponNumber, setWeaponNumber] = useState('')
      const [weaponMake, setWeaponMake] = useState('')
      const [caliber, setCaliber] = useState('')
      const [model, setModel] = useState('')
        const [toggler, setToggler] = useState(false)

        const inset = useSafeAreaInsets()
      
    
  const [weapnCats, setWeapnCats] = useState([])
  const [weaponList, setWeaponList] = useState([])
  const [rentedList, setRentedList] = useState([])
 
  const [activeTab, setActiveTab] = useState('own');

  const today = moment();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.format('MMMM YYYY'));



  const handleDateSelected = date => {
    setSelectedDate(date);
    setCurrentMonth(date.format('MMMM YYYY'));
  };


  

      useEffect(() => {
          const controller = new AbortController();
          getWeaponsList(controller)
          return ()=>{
            controller.abort();
          }
        }, [])

      useEffect(() => {
          const controller = new AbortController();
          getRentedWeapns(controller)
          return ()=>{
            controller.abort();
          }
        }, [])

      useEffect(() => {
          const controller = new AbortController();
          getAllWeaponList(controller)
          return ()=>{
            controller.abort();
          }
      }, [toggler])

        async function getAllWeaponList(controller) {
          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await getData(branch,'/athlete/weapon/list',{},controller)
          if(respo.status){
            console.log('all weapon  listt',respo)
            setWeaponList(respo.data?.weapons?.weapons || []) 
   
          }
        }
        async function getWeaponsList(controller) {
          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await getData(branch,'/admin/athlete/weapon-all-list',{},controller)
          if(respo.status){
            console.log('weapons listt',respo)
            setWeapnCats(respo.data.map((it)=>{
              return {
                label :it.weapon_name , value : it.id
              }
            }))
   
          }
        }
        async function getRentedWeapns(controller) {
          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await getData(branch,'/athlete/weapon/get-assigned-products',{},controller)
          if(respo.status){
            console.log('rented listt',respo)

           setRentedList(respo.data.assigned_products)
            
   
          }
        }

        async function saveWeapon() {

         
         
          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await postJSONData(branch,`/athlete/weapon/add`,{
            "weapons": [
                {
                    "weapon_type_id": selectedCategoryId,
                    "number": weaponNumber,
                    "make": weaponMake,
                    "caliber": caliber,
                    "model": model
                }
            ]
        })
        
          if(respo.status){
            setVisible(false)
            setToggler(s=>!s)
            setSelectedCategoryId('')
            setWeaponMake('')
            setWeaponNumber('')
            setCaliber('')
            setModel('')
            Alert.alert('Weapon added')
          }
        }

        async function dltWeaponFn(idd) {

       
          const branch = await AsyncStorage.getItem('branch_slug')
          const respo = await postJSONData(branch,'/athlete/weapon/delete',{
            "weapon_id": idd,
          })
        
          if(respo.status){
            setToggler(s=>!s)
            Alert.alert('Weapon deleted successfully!')
          }
        }

  return (
    <View style={styles.parentWrapper}>
      <TitleBar title="My Weapon" setSafeAreaHeight={setSafeAreaHeight} />
      {/* <Footer/> */}
      <ScrollView style={{ paddingTop: safeAreaHeight }}>
      <View
          style={{
            flexDirection: 'row',
            padding: 2,
            backgroundColor: '#202020',
            borderRadius: 8,
            marginBottom: 25,
            marginHorizontal  : 16,
            marginTop : 25
          }}
        >
          <TouchableOpacity
            style={{ width: (Dimensions.get('window').width - 32) / 2 }}
            onPress={() => {
              setActiveTab('own');
            }}
          >
            <Text
              style={{
                backgroundColor: activeTab == 'own' ? '#636366' : 'transparent',
                textAlign: 'center',
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 7,
                color: 'white',
                fontSize: 13,
                lineHeight: 20,
                fontWeight: '400',
              }}
            >
              Own a gun
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: (Dimensions.get('window').width - 32) / 2 }}
            onPress={() => {
              setActiveTab('rent');
            }}
          >
            <Text
              style={{
                backgroundColor:
                  activeTab == 'rent' ? '#636366' : 'transparent',
                textAlign: 'center',
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 7,
                color: 'white',
                fontSize: 13,
                lineHeight: 20,
                fontWeight: '400',
              }}
            >
              Rent a gun
            </Text>
          </TouchableOpacity>
        </View>
        {(activeTab == 'own') 
        ? 
        <View style={{ paddingHorizontal: 16 }}>
        
        

        {/* <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 10, }}>
          <Image source={require('../assets/images/imgIco.png')} style={{height : undefined, width : 18, aspectRatio : 1}} />
          <Text style={{color : 'white', fontSize : 16, fontWeight : '600',lineHeight : 22 }}>
          Choose Weapon
          </Text>
        </View> */}
         {weaponList?.length == 0 && 
         <Text style={{color : 'white',marginTop : 80, fontSize : 16,textAlign : 'center', fontWeight : '600',lineHeight : 22 }}>
         Weapon not found
        </Text>
         }

        <View style={{ display : 'none', flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 16,marginTop : 16 }}>
          <View style={{padding : 10,backgroundColor : '#202020', borderRadius : 10, width : (Dimensions.get('window').width - 64 )/3  }}  > 
          <View style={{alignItems : 'center'}}>
          <Image source={require('../assets/images/rif.png')} style={{height : undefined, width : 30, aspectRatio : 1}} />


          </View>

          <View style={{columnGap : 10, alignItems : 'center', flexDirection :'row',justifyContent : 'center',marginTop  : 10}}>
          {/* <Image source={require('../assets/images/checked.png')} style={{height : undefined, width : 18, aspectRatio : 1}} /> */}
          <Image source={require('../assets/images/unchecked.png')} style={{height : undefined, width : 18, aspectRatio : 1}} />
                <Text style={{color : '#A8A8A8', fontSize : 16, fontWeight : '600', lineHeight : 22}}>Rifle</Text>
          </View>

          </View>
          <View style={{padding : 10,backgroundColor : '#202020', borderRadius : 10, width : (Dimensions.get('window').width - 64 )/3  }}  > 
          <View style={{alignItems : 'center'}}>
          <Image source={require('../assets/images/pis.png')} style={{height : undefined, width : 30,objectFit : 'contain', aspectRatio : 1}} />


          </View>

          <View style={{columnGap : 10, alignItems : 'center', flexDirection :'row',justifyContent : 'center',marginTop  : 10}}>
          {/* <Image source={require('../assets/images/checked.png')} style={{height : undefined, width : 18, aspectRatio : 1}} /> */}
          <Image source={require('../assets/images/unchecked.png')} style={{height : undefined, width : 18, aspectRatio : 1}} />
                <Text style={{color : '#A8A8A8', fontSize : 16, fontWeight : '600', lineHeight : 22}}>Pistol</Text>
          </View>

          </View>
          <View style={{padding : 10,backgroundColor : '#202020', borderRadius : 10, width : (Dimensions.get('window').width - 64 )/3  }}  > 
          <View style={{alignItems : 'center'}}>
          <Image source={require('../assets/images/sho.png')} style={{height : undefined, width : 30, aspectRatio : 1}} />


          </View>

          <View style={{columnGap : 10, alignItems : 'center', flexDirection :'row',justifyContent : 'center',marginTop  : 10}}>
          {/* <Image source={require('../assets/images/checked.png')} style={{height : undefined, width : 18, aspectRatio : 1}} /> */}
          <Image source={require('../assets/images/unchecked.png')} style={{height : undefined, width : 18, aspectRatio : 1}} />
                <Text style={{color : '#A8A8A8', fontSize : 16, fontWeight : '600', lineHeight : 22}}>Shotgun</Text>
          </View>

          </View>

        </View>


      {weaponList?.map((itt,index)=>{
        return(
          <View key={index}>
          <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between', marginTop : 16 }}>
          <View style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', columnGap : 10, }}>
            <Image source={require('../assets/images/imgIco.png')} style={{height : undefined, width : 18, aspectRatio : 1}} />
            <Text style={{color : 'white', fontSize : 16, fontWeight : '600',lineHeight : 22 }}>
            Weapon {index + 1} Info
            </Text>
          </View>
          <TouchableOpacity onPress={()=>{
            Alert.alert(
             'Delete Weapon',
             'Are you sure you want to delete it ?',
              [
              { text: 'Cancel', style: 'cancel' },
               { text: 'Delete', onPress: () => dltWeaponFn(itt.id) },
               ],
               { cancelable: true }
               );
          }}>
          <Image source={require('../assets/images/delete.png')} style={{height : undefined, width : 24, aspectRatio : 1}} />
          </TouchableOpacity>
          </View>
  
          <Text
             style={{paddingVertical : 12, paddingHorizontal : 16 , backgroundColor : '#202020', borderRadius : 10, color : 'white', fontSize : 16, fontWeight : '500', marginTop : 16}}
             placeholderTextColor={'#656565'}
             > <Text style={{color : 'gray'}}>Type:</Text>  {itt?.weapon_type_name}</Text>
          <Text
             style={{paddingVertical : 12, paddingHorizontal : 16 , backgroundColor : '#202020', borderRadius : 10, color : 'white', fontSize : 16, fontWeight : '500', marginTop : 16}}
             placeholderTextColor={'#656565'}
             ><Text style={{color : 'gray'}}>Weapon Number:</Text> {itt?.number}</Text>
          <Text
             style={{paddingVertical : 12, paddingHorizontal : 16 , backgroundColor : '#202020', borderRadius : 10, color : 'white', fontSize : 16, fontWeight : '500', marginTop : 16}}
             placeholderTextColor={'#656565'}
             ><Text style={{color : 'gray'}}>Weapon Make:</Text> {itt?.make}</Text>
          <Text
             style={{paddingVertical : 12, paddingHorizontal : 16 , backgroundColor : '#202020', borderRadius : 10, color : 'white', fontSize : 16, fontWeight : '500', marginTop : 16}}
             placeholderTextColor={'#656565'}
             ><Text style={{color : 'gray'}}>Weapon Caliber:</Text> {itt?.caliber}</Text>
              <Text
             style={{paddingVertical : 12, paddingHorizontal : 16 , backgroundColor : '#202020', borderRadius : 10, color : 'white', fontSize : 16, fontWeight : '500', marginTop : 16}}
             placeholderTextColor={'#656565'}
             ><Text style={{color : 'gray'}}>Weapon Model:</Text> {itt?.model}</Text>
         </View>
        )
      })}
       

     

        </View>
        : 
        <View style={{padding : 16}}>
       {rentedList?.length == 0 && <Text style={{color : 'white',marginTop : 80, fontSize : 16,textAlign : 'center', fontWeight : '600',lineHeight : 22 }}>Rented weapon not found </Text> 
        }


          {rentedList?.map((rentWeap,indexxwe)=>{
            return (
              <View
                key={indexxwe}
                style={[
                  stylesNew.rentGunContainer,
                  indexxwe === 0 && { borderTopWidth: 0 },
                ]}
              >
                <Image
                  source={{uri : rentWeap?.product_image_url}}
                  style={{ width: 84, height: 49, }}
                />
                <View>
                  <Text style={stylesNew.rentgunName}>{rentWeap?.product_name}</Text>
                  <Text style={stylesNew.serialNoText}>
                    Serial Number : {rentWeap?.serial_no}
                  </Text>
                  <View style={stylesNew.walterSection}>
                    <Text style={stylesNew.walterText}>{rentWeap?.brand} </Text>
                    <View style={stylesNew.dot}></View>
                    <Text style={stylesNew.rifileText}>{rentWeap?.top_categories?.join(',')}</Text>
                   {rentWeap?.size && <View style={stylesNew.dot}></View>} 
                    <Text style={stylesNew.rifileText}>{rentWeap?.size}</Text>
                  </View>
                </View>
               
              </View>
            )
          })}
        </View>
        } 

        {/* add new modal  */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        

        <View style={{ flexGrow : 1, backgroundColor : 'black' }}>
            {/* <View style={{marginTop : 100}}></View> */}
          {/* <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={1}
          /> */}
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
              Add new weapon
            </Text>
            <TouchableOpacity onPress={()=>{setVisible(false)}}
              style={{ position: 'absolute', top: '50%', right: 16 }}
            >
              <Image
                style={{ height: undefined, width: 32, aspectRatio: 1 }}
                source={require('../assets/images/cll.png')}
              />
            </TouchableOpacity>
          </View>

          <RNPickerSelect
      onValueChange={(value) => setSelectedCategoryId(value)}
      useNativeAndroidPickerStyle={false}
      items={weapnCats}
    >
      <View style={{paddingHorizontal : 16, }}>
        <View style={{paddingVertical : 12, paddingHorizontal : 16, borderRadius : 16, backgroundColor : '#202020', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between'}}>
            <Text style={{color : 'white', fontWeight : '500', fontSize : 16}}>{weapnCats?.find((it)=> it.value == selectedCategoryId)?.label || 'Choose option'}</Text>
            <Image style={{width : 24, height : undefined , aspectRatio : 1}} source={require('../assets/images/donArrr.png')}/>
        </View>
        </View>



          </RNPickerSelect>
  

        <View style={{paddingHorizontal : 16}}>
        <TextInputComp placeholder={'Weapon Number'} state={weaponNumber} setState={setWeaponNumber}/>
        <TextInputComp placeholder={'Weapon Make'} state={weaponMake} setState={setWeaponMake}/>
        <TextInputComp placeholder={'Caliber'} state={caliber} setState={setCaliber}/>
        <TextInputComp placeholder={'Model'} state={model} setState={setModel}/>
        </View>
       
 
     




       

      <TouchableOpacity onPress={()=>{
        if(selectedCategoryId && weaponMake && weaponNumber && caliber && model){
          saveWeapon()
        }else{
          Alert.alert('Please enter details')
        }
        
      }} style={{marginTop : 16, paddingHorizontal : 16}}>
        <Text style={{textAlign : 'center', padding : 10 , backgroundColor : '#EB6925', borderRadius : 10, color : 'black', fontSize : 16 , lineHeight : 22, fontWeight : '600'}}>Save</Text>
      </TouchableOpacity>


          </View>
 
        </View>
      </Modal>
       

        <View style={{ marginBottom: 300 }}></View>
      </ScrollView>

      {activeTab == 'own' && <View style={{ padding: 16, paddingBottom: 25, marginBottom : inset.bottom  }}>
        <TouchableOpacity onPress={() => {
          setVisible(true)
          setSelectedCategoryId('')
          setModel('')
          setCaliber('')
          setWeaponMake('')
          setWeaponNumber('')
        }}>
          <Text
            style={{
              padding: 10,
              backgroundColor: '#EB6925',
              textAlign: 'center',
              color: '#121212',
              fontSize: 16,
              fontWeight: '700',
              lineHeight: 22,
              borderRadius: 10,
            }}
          >
            Add New
          </Text>
        </TouchableOpacity>
      </View> }
    </View>
  );
}





const stylesNew = StyleSheet.create({
  weaponSection: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  rentedWeaponsTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 16,
  },
  rentGunContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap : 16,
    paddingVertical: 16,
    borderTopColor: '#383838',
    borderTopWidth: 0.5,
  },
  rentedWeaponsText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#fff',
  },
  walterSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walterText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
  },
  rifileText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  dot: {
    height: 3,
    width: 3,
    backgroundColor: '#A8A8A8',
  },
  rentgunName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    color: '#fff',
    paddingBottom: 4,
  },
  serialNoText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#A8A8A8',
    paddingBottom: 10,
  },
});
