import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import TitleBar from './components/TitleBar';
import styles from './Style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, postFormData } from '../helper/callApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pick, types } from '@react-native-documents/picker';
import TextInputComp from './components/TextInputComp';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

const STATIC_QUERIES = [
  {
    id: 1,
    subject: 'Range timing clarification',
    query_text:
      'Can you confirm the pistol range availability for Saturday morning practice session?',
    coach_name: 'Rahul Sharma',
    created_at: '24 Aug 2026',
    file: null,
  },
  {
    id: 2,
    subject: 'Ammunition request',
    query_text:
      'I need additional .22 ammunition for this week’s training. Please let me know the process.',
    coach_name: 'Anjali Mehta',
    created_at: '22 Aug 2026',
    file: {
      name: 'ammunition-request.pdf',
      type: 'application/pdf',
    },
  },
  {
    id: 3,
    subject: 'Scorecard review',
    query_text:
      'Could you please review my last three scorecards and share feedback on trigger control?',
    coach_name: 'Vikram Singh',
    created_at: '18 Aug 2026',
    file: {
      name: 'scorecard.jpg',
      type: 'image/jpeg',
    },
  },
];

function shortText(text = '', max = 90) {
  const t = String(text || '').trim();
  if (!t) {
    return '';
  }
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, max).trim()}...`;
}

function mapCoach(coach, role, index) {
  const id = coach?.user_id || coach?.id || coach?.coach_id;
  const name =
    coach?.coach_name ||
    `${coach?.first_name || ''} ${coach?.last_name || ''}`.trim() ||
    'User';
  return {
    label: role ? `${name} (${role})` : name,
    value: id || `${role}-${index}`,
    name,
  };
}

function mapUsersFromCourse(course) {
  const heads = (course?.coaches?.head_coaches || []).map((coach, index) =>
    mapCoach(coach, 'Head Coach', index),
  );
  const assistants = (course?.coaches?.assistant_coaches || []).map(
    (coach, index) => mapCoach(coach, 'Assistant Coach', index),
  );
  const seen = new Set();

  return [...heads, ...assistants].filter(user => {
    const key = String(user.value);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export default function Queries() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [visible, setVisible] = useState(false);
  const [queryList, setQueryList] = useState(STATIC_QUERIES);
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [subject, setSubject] = useState('');
  const [queryText, setQueryText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inset = useSafeAreaInsets();
  const nav = useNavigation();

  useEffect(() => {
    const controller = new AbortController();
    getUsersFn(controller);
    return () => {
      controller.abort();
    };
  }, []);

  async function getUsersFn(controller) {
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(branch, '/athlete/course', {}, controller);
    if (respo?.status) {
      setUserList(mapUsersFromCourse(respo.data.course));
    }
  }

  const pickFile = async () => {
    try {
      const result = await pick({
        allowMultiSelection: false,
        mode: 'open',
        type: [types.images, types.pdf],
      });

      if (result && result.length > 0) {
        const file = result[0];
        console.log('Picked File:', file);
        setSelectedFile(file);
      }
    } catch (e) {
      if (e.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User cancelled');
        return;
      }
      console.log('Error:', e);
    }
  };

  function resetForm() {
    setSelectedUserId(null);
    setSubject('');
    setQueryText('');
    setSelectedFile(null);
  }

  function openGenerateModal() {
    resetForm();
    setVisible(true);
  }

  async function submitQueryFn() {
    if (!selectedUserId) {
      Alert.alert('Please select user');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Please enter subject');
      return;
    }
    if (!queryText.trim()) {
      Alert.alert('Please enter query text');
      return;
    }

    Keyboard.dismiss();
    const branch = await AsyncStorage.getItem('branch_slug');
    const formData = new FormData();
    formData.append('user_id', selectedUserId);
    formData.append('subject', subject.trim());
    formData.append('query_text', queryText.trim());
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const respo = await postFormData(
      branch,
      '/athlete/query/add',
      formData,
      setIsLoading,
    );

    if (respo?.status) {
      const selectedUser = userList.find(user => user.value == selectedUserId);
      setQueryList(prev => [
        {
          id: Date.now(),
          subject: subject.trim(),
          query_text: queryText.trim(),
          coach_name: selectedUser?.name || selectedUser?.label || '—',
          created_at: 'Just now',
          file: selectedFile
            ? {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.type,
              }
            : null,
        },
        ...prev,
      ]);
      setVisible(false);
      resetForm();
      Alert.alert('Query submitted successfully');
    }
  }

  return (
    <View style={styles.parentWrapper}>
      <TitleBar title={'Queries'} setSafeAreaHeight={setSafeAreaHeight} />
      <ScrollView style={{ paddingTop: safeAreaHeight }}>
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          {queryList?.length == 0 && (
            <Text
              style={{
                color: 'white',
                marginTop: 80,
                fontSize: 16,
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: 22,
              }}
            >
              No queries found{'\n'}
              <Text style={{ color: '#A8A8A8', fontSize: 14, fontWeight: '400' }}>
                Tap Submit Query to generate a new one
              </Text>
            </Text>
          )}

          {queryList?.map((item, index) => {
            return (
              <TouchableOpacity
                key={item?.id || index}
                activeOpacity={0.8}
                onPress={() => {
                  nav.navigate('QueryChat', { query: item });
                }}
                style={stylesNew.queryCard}
              >
                <View style={stylesNew.queryCardTop}>
                  <Text style={stylesNew.querySubject} numberOfLines={1}>
                    {item?.subject || 'No subject'}
                  </Text>
                  {!!item?.created_at && (
                    <Text style={stylesNew.queryDate}>{item.created_at}</Text>
                  )}
                </View>
                <Text style={stylesNew.queryBody} numberOfLines={2}>
                  {shortText(item?.query_text, 110) || 'No query text'}
                </Text>
                <View style={stylesNew.coachRow}>
                  <Image
                    source={require('../assets/images/user.png')}
                    style={stylesNew.coachImage}
                  />
                  <View>
                    <Text style={stylesNew.coachLabel}>Coach</Text>
                    <Text style={stylesNew.coachName}>
                      {item?.coach_name || '—'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ marginBottom: 180 }} />
      </ScrollView>

      <View
        style={{
          padding: 16,
          paddingBottom: 25,
          marginBottom: inset.bottom,
        }}
      >
        <TouchableOpacity onPress={openGenerateModal}>
          <Text style={stylesNew.submitBtn}>Submit Query</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: 'black' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{ paddingTop: inset.top }}>
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
                Generate Query
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{ position: 'absolute', top: '50%', right: 16 }}
              >
                <Image
                  style={{ height: undefined, width: 32, aspectRatio: 1 }}
                  source={require('../assets/images/cll.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={stylesNew.fieldLabel}>select user</Text>
              <Dropdown
                search
                data={userList}
                searchPlaceholder="Search user"
                labelField="label"
                valueField="value"
                placeholder="Select user"
                value={selectedUserId}
                onChange={item => {
                  setSelectedUserId(item.value);
                }}
                style={stylesNew.dropdown}
                placeholderStyle={stylesNew.dropdownPlaceholder}
                selectedTextStyle={stylesNew.dropdownSelected}
                inputSearchStyle={stylesNew.dropdownSearch}
                containerStyle={stylesNew.dropdownContainer}
                itemContainerStyle={stylesNew.dropdownItem}
                itemTextStyle={stylesNew.dropdownItemText}
                activeColor="#2B2B2B"
                maxHeight={300}
                renderRightIcon={() => (
                  <Image
                    style={{ width: 24, height: undefined, aspectRatio: 1 }}
                    source={require('../assets/images/donArrr.png')}
                  />
                )}
              />

              <Text style={[stylesNew.fieldLabel, { marginTop: 20 }]}>Subject</Text>
              <TextInputComp
                placeholder={'Enter subject'}
                state={subject}
                setState={setSubject}
              />

              <Text style={[stylesNew.fieldLabel, { marginTop: 20 }]}>Query text</Text>
              <TextInput
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
                style={stylesNew.queryInput}
                placeholder="Type your query here..."
                placeholderTextColor={'#656565'}
                value={queryText}
                onChangeText={setQueryText}
              />

              <View style={[styles.moodTitleBox, { marginTop: 20 }]}>
                <Image
                  source={require('../assets/images/mood.png')}
                  style={{ width: 24, aspectRatio: 1, height: undefined }}
                />
                <Text style={styles.moodLable}>Upload Document</Text>
              </View>

              <View style={stylesNew.uploaderBox}>
                <View style={{ alignItems: 'center' }}>
                  <View style={stylesNew.uploaderIconWrap}>
                    <Image
                      source={require('../assets/icons/upVector.png')}
                      style={{ width: 24, aspectRatio: 1, height: undefined }}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 10,
                      color: '#A8A8A8',
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                  >
                    Upload Document
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 2,
                      color: '#A8A8A8',
                      fontSize: 10,
                      fontWeight: '400',
                    }}
                  >
                    Tap to browse files from your device
                  </Text>
                  <TouchableOpacity onPress={pickFile}>
                    <Text style={stylesNew.browseBtn}>Browse File</Text>
                  </TouchableOpacity>
                  {selectedFile && (
                    <Text
                      style={{
                        marginTop: 10,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}
                    >
                      {selectedFile?.name || 'File selected'}
                    </Text>
                  )}
                </View>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: '#656565',
                  fontSize: 13,
                  fontWeight: '400',
                }}
              >
                File upload size must be under 2mb
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              if (!isLoading) {
                submitQueryFn();
              }
            }}
            style={{
              marginTop: 16,
              paddingHorizontal: 16,
              marginBottom: inset.bottom + 10,
            }}
          >
            <Text style={stylesNew.submitBtn}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const stylesNew = StyleSheet.create({
  queryCard: {
    padding: 16,
    backgroundColor: '#202020',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 0.25,
    borderColor: '#383838',
  },
  queryCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 10,
  },
  querySubject: {
    flex: 1,
    color: '#EB6925',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  queryDate: {
    color: '#A8A8A8',
    fontSize: 12,
    fontWeight: '400',
  },
  queryBody: {
    marginTop: 8,
    color: '#A8A8A8',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  coachRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  coachImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2B2B2B',
  },
  coachLabel: {
    color: '#A8A8A8',
    fontSize: 10,
    fontWeight: '400',
  },
  coachName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  submitBtn: {
    padding: 10,
    backgroundColor: '#EB6925',
    textAlign: 'center',
    color: '#121212',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    borderRadius: 10,
  },
  fieldLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  dropdown: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#202020',
    borderRadius: 16,
  },
  dropdownPlaceholder: {
    color: '#656565',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownSelected: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownSearch: {
    color: 'white',
    backgroundColor: '#202020',
    borderRadius: 8,
    height: 40,
    fontSize: 14,
    borderColor: '#383838',
  },
  dropdownContainer: {
    backgroundColor: '#121210',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#383838',
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownItem: {
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  queryInput: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#202020',
    minHeight: 140,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  uploaderBox: {
    marginTop: 10,
    backgroundColor: '#202020',
    borderRadius: 10,
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'white',
    borderStyle: 'dashed',
  },
  uploaderIconWrap: {
    height: 55,
    width: 55,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b2b2b',
  },
  browseBtn: {
    padding: 6,
    backgroundColor: '#481D07',
    borderRadius: 6,
    color: '#EB6925',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
