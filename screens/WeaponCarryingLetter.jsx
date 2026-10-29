import { View, Text, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TitleBar from './components/TitleBar';
import styles from './Style';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, postJSONData } from '../helper/callApi'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextInputComp from './components/TextInputComp';
import DatePicker from 'react-native-date-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

function parseDateValue(value) {
  if (!value) {
    return null;
  }
  const parsed = moment(value);
  if (!parsed.isValid()) {
    return null;
  }
  return parsed.toDate();
}

function mapWeaponsFromItem(item) {
  if (Array.isArray(item?.weapons)) {
    return item.weapons.map((weapon) => ({
      caliber: weapon?.caliber || '',
      weapon_number: weapon?.weapon_number || '',
      manufacture: weapon?.manufacture || '',
    }));
  }

  if (typeof item?.weapons === 'string' && item.weapons.trim()) {
    return item.weapons.split(',').map((weaponNumber) => ({
      caliber: '',
      weapon_number: weaponNumber.trim(),
      manufacture: '',
    })).filter((weapon) => weapon.weapon_number);
  }

  return [];
}

export default function WeaponCarryingLetter() {
  const route = useRoute();
  const nav = useNavigation();
  const editItem = route?.params?.editItem || null;
  const isEdit = !!editItem?.id;

  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [travelMode, setTravelMode] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [purpose, setPurpose] = useState('');
  const [pellets, setPellets] = useState('');
  const [ammunitions, setAmmunitions] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [weaponList, setWeaponList] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const inset = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const focusedNode = useRef(null);
  const detailControllerRef = useRef(null);
  const { theme } = useTheme();

  function fillForm(item) {
    setTravelMode(item?.travel_mode || '');
    setFromLocation(item?.from_location || '');
    setToLocation(item?.to_location || '');
    setPurpose(item?.purpose || '');
    setPellets(item?.pellets || '');
    setAmmunitions(item?.ammunitions || '');
    setStartDate(parseDateValue(item?.start_date));
    setEndDate(parseDateValue(item?.end_date));
    setWeaponList(mapWeaponsFromItem(item));
  }

  async function getCertificateDetails(id) {
    detailControllerRef.current?.abort();
    const controller = new AbortController();
    detailControllerRef.current = controller;

    setIsFetching(true);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(
      branch,
      '/athlete/travel-certificate',
      { id },
      controller,
    );
    setIsFetching(false);

    if (respo?.status) {
      fillForm(respo?.data?.travelCertificate || {});
    }
  }

  useEffect(() => {
    if (editItem?.id) {
      getCertificateDetails(editItem.id);
    } else {
      resetForm();
    }
    return () => {
      detailControllerRef.current?.abort();
    };
  }, [editItem?.id]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event?.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      focusedNode.current = null;
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  function scrollFocusedInput(node) {
    if (!node || !scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard) {
      return;
    }
    scrollRef.current.scrollResponderScrollNativeHandleToKeyboard(node, 48, true);
  }

  function onInputFocus(event) {
    focusedNode.current = event?.target;
    setTimeout(() => scrollFocusedInput(event?.target), 80);
  }

  useEffect(() => {
    if (keyboardHeight > 0 && focusedNode.current) {
      const timer = setTimeout(() => {
        scrollFocusedInput(focusedNode.current);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [keyboardHeight]);

  function updateWeapon(index, key, value) {
    const updatedList = [...weaponList];
    updatedList[index] = {
      ...updatedList[index],
      [key]: value,
    };
    setWeaponList(updatedList);
  }

  function resetForm() {
    setTravelMode('');
    setFromLocation('');
    setToLocation('');
    setPurpose('');
    setPellets('');
    setAmmunitions('');
    setStartDate(null);
    setEndDate(null);
    setWeaponList([]);
  }

  function buildPayload() {
    return {
      from_location: fromLocation.trim(),
      to_location: toLocation.trim(),
      travel_mode: travelMode.trim(),
      start_date: moment(startDate).format('YYYY-MM-DD'),
      end_date: moment(endDate).format('YYYY-MM-DD'),
      purpose: purpose.trim(),
      pellets: pellets.trim(),
      ammunitions: ammunitions.trim(),
      weapons: weaponList.map((weapon) => {
        return {
          caliber: weapon.caliber.trim(),
          weapon_number: weapon.weapon_number.trim(),
          manufacture: weapon.manufacture.trim(),
        };
      }),
    };
  }

  function validateForm() {
    if (!fromLocation.trim()) {
      Alert.alert('Enter From Location!');
      return false;
    }
    if (!toLocation.trim()) {
      Alert.alert('Enter To Location!');
      return false;
    }
    if (!travelMode.trim()) {
      Alert.alert('Enter Travel Mode!');
      return false;
    }
    if (!startDate) {
      Alert.alert('Enter Travelling Date!');
      return false;
    }
    if (!endDate) {
      Alert.alert('Enter Returning Date!');
      return false;
    }
    if (!purpose.trim()) {
      Alert.alert('Enter Purpose!');
      return false;
    }
    if (!weaponList.length) {
      Alert.alert('Add at least one weapon!');
      return false;
    }
    const incompleteWeapon = weaponList.some((weapon) => {
      return !weapon?.caliber?.trim() || !weapon?.weapon_number?.trim() || !weapon?.manufacture?.trim();
    });
    if (incompleteWeapon) {
      Alert.alert('Enter caliber, weapon number and manufacture for each weapon!');
      return false;
    }
    return true;
  }

  async function createLetter() {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await postJSONData(
      branch,
      '/athlete/travel-certificate',
      buildPayload()
    );

    setIsLoading(false);

    if (respo?.status) {
      Alert.alert(respo.message || 'Travel certificate request submitted');
      resetForm();
      nav.goBack();
    }
  }

  async function updateLetter() {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await postJSONData(
      branch,
      '/athlete/update-travel-certificate',
      {
        id: editItem.id,
        ...buildPayload(),
      }
    );

    setIsLoading(false);

    if (respo?.status) {
      Alert.alert(respo.message || 'Travel certificate updated');
      nav.goBack();
    }
  }

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar
        title={isEdit ? 'Edit Weapon Carrying Letter' : 'Weapon Carrying Letter'}
        setSafeAreaHeight={setSafeAreaHeight}
      />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, paddingTop: safeAreaHeight }}
        contentContainerStyle={{ paddingBottom: keyboardHeight + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginTop: 16 }}>
            Weapon Carrying Letter Info
          </Text>
          {isFetching && (
            <Text style={{ color: theme.textSecondary, fontSize: 14, fontWeight: '400', marginTop: 8 }}>
              Loading certificate details...
            </Text>
          )}

          <TextInputComp placeholder={'Travel Mode'} state={travelMode} setState={setTravelMode} onFocus={onInputFocus} />
          <TextInputComp placeholder={'From Location'} state={fromLocation} setState={setFromLocation} onFocus={onInputFocus} />
          <TextInputComp placeholder={'To Location'} state={toLocation} setState={setToLocation} onFocus={onInputFocus} />

          <TouchableOpacity
            onPress={() => setOpenStartDatePicker(true)}
            style={{ marginTop: 16, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: theme.card, borderRadius: 10, borderWidth: 1, borderColor: theme.border }}
          >
            <Text style={[styles.dchtegray, { color: theme.textSecondary }]}>Travelling Date</Text>
            <Text style={{ color: startDate ? theme.text : theme.placeholder, fontSize: 16, fontWeight: '500', marginTop: 6 }}>
              {startDate ? moment(startDate).format('DD MMM YYYY') : 'Select travelling date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOpenEndDatePicker(true)}
            style={{ marginTop: 16, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: theme.card, borderRadius: 10, borderWidth: 1, borderColor: theme.border }}
          >
            <Text style={[styles.dchtegray, { color: theme.textSecondary }]}>Returning Date</Text>
            <Text style={{ color: endDate ? theme.text : theme.placeholder, fontSize: 16, fontWeight: '500', marginTop: 6 }}>
              {endDate ? moment(endDate).format('DD MMM YYYY') : 'Select returning date'}
            </Text>
          </TouchableOpacity>

          <TextInputComp placeholder={'Purpose'} state={purpose} setState={setPurpose} onFocus={onInputFocus} />

          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginTop: 24 }}>
            Weapons
          </Text>

          {weaponList.map((weapon, index) => {
            return (
              <View key={index} style={{ marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: theme.cardAlt, borderWidth: 1, borderColor: theme.border }}>
                <TextInputComp
                  placeholder={'Weapon Caliber'}
                  state={weapon?.caliber}
                  setState={(value) => updateWeapon(index, 'caliber', value)}
                  onFocus={onInputFocus}
                />
                <TextInputComp
                  placeholder={'Weapon Number'}
                  state={weapon?.weapon_number}
                  setState={(value) => updateWeapon(index, 'weapon_number', value)}
                  onFocus={onInputFocus}
                />
                <TextInputComp
                  placeholder={'Manufacture'}
                  state={weapon?.manufacture}
                  setState={(value) => updateWeapon(index, 'manufacture', value)}
                  onFocus={onInputFocus}
                />
                <TouchableOpacity
                  onPress={() => {
                    const updatedList = weaponList.filter((_, i) => i !== index);
                    setWeaponList(updatedList);
                  }}
                  style={{ marginTop: 12 }}
                >
                  <Text style={{ color: '#FF0000', fontSize: 14, fontWeight: '600' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity
            onPress={() => {
              setWeaponList([
                ...weaponList,
                {
                  caliber: '',
                  weapon_number: '',
                  manufacture: '',
                },
              ]);
            }}
            style={{ marginTop: 16 }}
          >
            <Text style={{ color: theme.accent, fontSize: 16, fontWeight: '600' }}>+ Add Weapon</Text>
          </TouchableOpacity>

          <TextInputComp placeholder={'Pellets'} state={pellets} setState={setPellets} onFocus={onInputFocus} />
          <TextInputComp placeholder={'Ammunitions'} state={ammunitions} setState={setAmmunitions} onFocus={onInputFocus} />
          <View style={{ height: 300 }}></View>
        </View>
      </ScrollView>

      <DatePicker
        modal
        mode="date"
        open={openStartDatePicker}
        date={startDate || new Date()}
        onConfirm={(date) => {
          setOpenStartDatePicker(false);
          setStartDate(date);
        }}
        onCancel={() => {
          setOpenStartDatePicker(false);
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={openEndDatePicker}
        date={endDate || new Date()}
        onConfirm={(date) => {
          setOpenEndDatePicker(false);
          setEndDate(date);
        }}
        onCancel={() => {
          setOpenEndDatePicker(false);
        }}
      />

      {keyboardHeight === 0 && <View>
        <TouchableOpacity
          onPress={() => {
            if (!isLoading && !isFetching) {
              if (isEdit) {
                updateLetter();
              } else {
                createLetter();
              }
            }
          }}
          style={{ marginTop: 16, paddingHorizontal: 16, marginBottom: inset.bottom + 10 }}
        >
          <Text style={{ textAlign: 'center', padding: 10, backgroundColor: '#EB6925', borderRadius: 10, color: 'black', fontSize: 16, lineHeight: 22, fontWeight: '600' }}>
            {isFetching ? 'Loading...' : isLoading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>}
    </View>
  );
}
