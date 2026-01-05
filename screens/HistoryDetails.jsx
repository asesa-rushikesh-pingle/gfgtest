import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import TitleBar from './components/TitleBar';
import Footer from './components/Footer';
import DiaryTabs from './components/DiaryTabs';
import styles from './Style';
import { BlurView } from '@react-native-community/blur';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, postJSONData } from '../helper/callApi';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';

const { width } = Dimensions.get('window');
export default function HistoryDetails({ route }) {
  const { dateString } = route.params;
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);

  const [pedingAmount, setPedingAmount] = useState(0);
  const [bookingAmount, setBookingAmount] = useState(0);
  const [coursePrice, setCoursePrice] = useState(0);

  const [courseObj, setCourseObj] = useState('');

  const [historyList, setHistoryList] = useState([]);

  const dropdownRef = useRef(null);

  const [toDate, setToDate] = useState(new Date());

  const [fromDate, setFromDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);

  const nav = useNavigation();

  const inset = useSafeAreaInsets();

  const data = [
    { label: 'This Month', value: '1' },
    { label: 'Last Three Month', value: '2' },
    { label: 'This Year', value: '3' },
  ];

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getCourseInfo(controller);
    return () => {
      controller.abort();
    };
  }, []);

  async function getCourseInfo(controller) {
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(
      branch,
      '/athlete/get-program-by-date',
      {
        date: dateString,
      },
      controller,
    );
    if (respo.status) {
      console.log('history programs athlete/get-program-by-date', respo);
      setHistoryList(respo.data.details);
    }
  }

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.parentWrapper}>
      <View
        onLayout={event => {
          const { height } = event.nativeEvent.layout;
          setSafeAreaHeight(height);
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 192, 203, 0)',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={1}
          // overlayColor="transparent"
          // reducedTransparencyFallbackColor="white"
        />

        <View style={[styles.headComp, { paddingTop: inset.top + 10 }]}>
          <TouchableOpacity
            onPress={() => {
              nav.goBack();
            }}
          >
            <Image
              source={require('../assets/images/backBtn.png')}
              style={{ width: 24, aspectRatio: 1, height: undefined }}
            />
          </TouchableOpacity>
          <Text style={styles.pageBarTitle}>{dateString}</Text>
          <TouchableOpacity
            onPress={() => {
              dropdownRef.current?.open();
            }}
          >
            <Image
              source={require('../assets/images/filterIco.png')}
              style={{
                width: 32,
                aspectRatio: 1,
                height: undefined,
                opacity: 0,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Footer activeIndex={2}/>
      <ScrollView style={{ paddingTop: safeAreaHeight }}>
        <View style={{ paddingHorizontal: 16 }}>
          {historyList?.map((elem,index)=>{
            return(
          <View key={index} style={{borderColor : 'rgba(245, 245, 245, 0.5)',padding : 16,borderRadius : 10, borderWidth : .5, marginBottom : 20}}>
          <View style={[styles.courseContentt, { marginBottom: 10 }]}>
            <Text
              style={[styles.coHeadinggg, { marginTop: 16, marginBottom: 8 }]}
            >
              {elem?.course_name
              }
            </Text>
            <View
              style={{
                marginTop: 8,
                flexDirection: 'row',
                columnGap: 10,
                alignItems: 'center',
              }}
            >
              <Text style={styles.staMonthText}>{elem?.days} Days</Text>
              <View
                style={{
                  backgroundColor: '#A8A8A8',
                  height: 5,
                  width: 5,
                  borderRadius: 5,
                }}
              ></View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  flex: 1,
                }}
              >
                <Text style={styles.staMonthText}>Started {elem?.course_start_date
                }</Text>
                <View
                  style={{
                    // marginTop: 8,
                    display : 'none',
                    flexDirection: 'row',
                    columnGap: 10,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#E0B519',
                      height: 10,
                      width: 10,
                      borderRadius: 10,
                      outlineColor: '#E0B519',
                      outlineWidth: 1,
                      outlineOffset: 2,
                    }}
                  ></View>
                  <Text style={styles.staMonthText}>In Progress</Text>
                </View>
              </View>
            </View>
          </View>
          {/* green box  */}
          {/* <View
       
            style={{
              marginTop: 16,
              padding: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#2BA750',
              backgroundColor: '#2B2B2B',
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  columnGap: 10,
                }}
              >
                <Image
                  source={require('../assets/images/tickk.png')}
                  style={{ width: 35, aspectRatio: 1, height: undefined }}
                />
                <View>
                  <Text
                    style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}
                  >
                    {elem?.program_list?.length} Programs Completed
                  </Text>
                  <Text
                    style={{
                      color: '#656565',
                      fontSize: 12,
                      fontWeight: '400',
                      marginTop: 6,
                    }}
                  >
                    {elem?.display_login_time} - {elem?.display_logout_time || '--'} {elem?.lane_details ? ` ●  ${elem?.lane_details?.name}` : ''}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={{ transform: [{ rotate: '90deg' }] }}
                onPress={() => {}}
              >
                <Image
                  source={require('../assets/images/rrr.png')}
                  style={{ width: 28, aspectRatio: 1, height: undefined }}
                />
              </TouchableOpacity>
            </View>
            {elem?.program_list?.map((program,proINdex)=>{
          return(
            <View
            key={proINdex}
              style={{
                padding: 10,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: '#383838',
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 10,
                }}
              >
               {program?.course_category_name}
              </Text>
              <Text
                style={{
                  color: '#A8A8A8',
                  fontSize: 14,
                  fontWeight: '400',
                  marginBottom: 0,
                }}
              >
                {program?.program_name}
              </Text>
            </View>
              )
            })}

          </View> */}
        

          {/* diary comment by coach  */}
          <View style={{ marginTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  columnGap: 10,
                  paddingVertical: 11,
                }}
              >
                <Image
                  source={require('../assets/images/onetwo.png')}
                  style={{ height: undefined, width: 22, aspectRatio: 1 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    lineHeight: 22,
                    color: 'white',
                  }}
                >
                  General Practice
                </Text>
              </View>
              <Image
                source={require('../assets/images/riarrhere.png')}
                style={{
                  height: undefined,
                  width: 24,
                  aspectRatio: 1,
                  transform: [{ rotate: '0deg' }],
                }}
              />
            </View>
            <View
              style={{
                padding: 10,
                borderRadius: 16,
                borderColor: '#383838',
                borderWidth: 0.5,
              }}
            >
              <View>
                {elem?.notes?.length == 0 && <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#A8A8A8',
                    lineHeight: 30,
                  }}
                >
                  Nothing to show !!
                </Text> }
                {elem?.notes?.map((note,noteINdex)=>{
          return(
                <View key={noteINdex}>
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
                      <Text style={styles.staMonthText}>{note?.display_created_date}</Text>
                      <View
                        style={{
                          backgroundColor: '#A8A8A8',
                          height: 5,
                          width: 5,
                          borderRadius: 5,
                        }}
                      ></View>
                      <Text style={styles.staMonthText}>{note?.edited_before_span}</Text>
                    </View>

                    <TouchableOpacity>
                      <Image
                        source={require('../assets/images/options.png')}
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
                    {note?.category_name}
                  </Text>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      color: '#656565',
                      fontWeight: '400',
                    }}
                  >
                     {note?.note}
                  </Text>


                  {/* children */}
                  {note?.children?.map((commnet,commentIndex)=>{
                    return(
                  <View
                  key={commentIndex}
                    style={{
                      borderRadius: 10,
                      borderColor: '#656565',
                      backgroundColor: '#202020',
                      borderWidth: 1,
                      marginTop: 13,
                      padding: 10,
                    }}
                  >
                    <View
                      style={{
                        transform: [{ rotate: '45deg' }],
                        position: 'absolute',
                        top: -4,
                        zIndex: -1,
                        left: '50%',
                        height: 20,
                        width: 20,
                        borderWidth: 1,
                        borderColor: '#656565',
                        backgroundColor: '#656565',
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        columnGap: 10,
                      }}
                    >
                      <Image
                        source={{uri : commnet?.note_created_by?.profile_image}}
                        style={{
                          width: 36,
                          borderRadius: 50,
                          aspectRatio: 1,
                          height: undefined,
                        }}
                      />
                      <View style={{ flex: 1, paddingRight: 30 }}>
                        <View
                          style={{
                            marginTop: 0,
                            flexDirection: 'row',
                            columnGap: 10,
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={[
                              styles.staMonthText,
                              {
                                color: 'white',
                                fontSize: 14,
                                fontWeight: '500',
                              },
                            ]}
                          >
                           {commnet?.note_created_by?.name}
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#A8A8A8',
                              height: 5,
                              width: 5,
                              borderRadius: 5,
                            }}
                          ></View>
                          <Text style={styles.staMonthText}>{commnet?.note_created_by?.designation}</Text>
                        </View>
                        <Text style={styles.staMonthText}>{commnet?.display_created_time}</Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 16, alignItems: 'flex-start' }}>
                      <Text
                        style={{
                          backgroundColor: '#383838',
                          paddingVertical: 3,
                          paddingHorizontal: 5,
                          borderRadius: 5,
                          color: 'white',
                          fontSize: 12,
                        }}
                      >
                       {commnet?.note}
                      </Text>
                    </View>
                  </View>
                  )
                })}
                
                  <View
                    style={{
                      marginVertical: 10,
                      borderTopColor: '#383838',
                      borderTopWidth: 0.5,
                    }}
                  ></View>
                </View>)
                })}
              </View>
            </View>
          </View>

          {/* score card by coach  */}
          <View style={{ marginTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  columnGap: 10,
                  paddingVertical: 11,
                }}
              >
                <Image
                  source={require('../assets/images/onetwo.png')}
                  style={{ height: undefined, width: 22, aspectRatio: 1 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    lineHeight: 22,
                    color: 'white',
                  }}
                >
                  Training / Score Card
                </Text>
              </View>
              <Image
                source={require('../assets/images/riarrhere.png')}
                style={{
                  height: undefined,
                  width: 24,
                  aspectRatio: 1,
                  transform: [{ rotate: '0deg' }],
                }}
              />
            </View>
            <View
              style={{
                padding: 10,
                borderRadius: 16,
                borderColor: '#383838',
                borderWidth: 0.5,
              }}
            >
              <View>
                {/* <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#A8A8A8',
                    lineHeight: 30,
                  }}
                >
                  Nothing to show !!
                </Text> */}
                {elem?.score_card?.map((score,scoreINdex)=>{
                   return(
                <View key={scoreINdex}>
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
                      <Text style={styles.staMonthText}>{score?.display_created_date}</Text>
                      <View
                        style={{
                          backgroundColor: '#A8A8A8',
                          height: 5,
                          width: 5,
                          borderRadius: 5,
                        }}
                      ></View>
                      <Text style={styles.staMonthText}>{score?.edited_before_span}</Text>
                    </View>

                    <TouchableOpacity>
                      <Image
                        source={require('../assets/images/options.png')}
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
                    {score?.category_name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >

                    {score?.score_card?.map((cardItem,cardIndex)=>{
                        return(
                          <View
                          key={cardIndex}
                            style={{
                              padding: 5,
                              borderRadius: 5,
                              borderWidth: 0.5,
                              borderColor: '#383838',
                              width: (Dimensions.get('window').width - 101) / 5,
                            }}
                          >
                            <Text
                              style={{
                                color: '#A8A8A8',
                                fontSize: 12,
                                fontWeight: '400',
                                textAlign: 'center',
                              }}
                            >
                              {cardItem?.key}
                            </Text>
                            <Text
                              style={{
                                color: '#A8A8A8',
                                marginTop: 2,
                                fontSize: 16,
                                fontWeight: '600',
                                lineHeight: 22,
                                textAlign: 'center',
                              }}
                            >
                              {cardItem?.score || '00'}
                            </Text>
                          </View>
                          )
                        })}
                   
                  
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      columnGap: 10,
                      padding: 5,
                      borderRadius: 6,
                      borderColor: '#383838',
                      borderWidth: 1,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: '#A8A8A8',
                        fontSize: 12,
                        fontWeight: '400',
                        textAlign: 'center',
                      }}
                    >
                      Total Score
                    </Text>
                    <Text
                      style={{
                        color: '#A8A8A8',
                        marginTop: 2,
                        fontSize: 16,
                        fontWeight: '600',
                        lineHeight: 22,
                        textAlign: 'center',
                      }}
                    >
                      {score?.totalScoreCard}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderRadius: 10,
                      borderColor: '#656565',
                      backgroundColor: '#202020',
                      borderWidth: 1,
                      marginTop: 13,
                      padding: 10,
                      display : score?.score_card_comment?.comment ? 'flex' : 'none'
                    }}
                  >
                    <View
                      style={{
                        transform: [{ rotate: '45deg' }],
                        position: 'absolute',
                        top: -4,
                        zIndex: -1,
                        left: '50%',
                        height: 20,
                        width: 20,
                        borderWidth: 1,
                        borderColor: '#656565',
                        backgroundColor: '#656565',
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        columnGap: 10,
                      }}
                    >
                      <Image
                        source={{uri : score?.score_card_comment?.comment_created_by?.profile_image}}
                        style={{
                          width: 36,
                          borderRadius: 50,
                          aspectRatio: 1,
                          height: undefined,
                        }}
                      />
                      <View style={{ flex: 1, paddingRight: 30 }}>
                        <View
                          style={{
                            marginTop: 0,
                            flexDirection: 'row',
                            columnGap: 10,
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={[
                              styles.staMonthText,
                              {
                                color: 'white',
                                fontSize: 14,
                                fontWeight: '500',
                              },
                            ]}
                          >
                            {score?.score_card_comment?.comment_created_by?.name}
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#A8A8A8',
                              height: 5,
                              width: 5,
                              borderRadius: 5,
                            }}
                          ></View>
                          <Text style={styles.staMonthText}> {score?.score_card_comment?.comment_created_by?.designation}</Text>
                        </View>
                        <Text style={styles.staMonthText}>{score?.score_card_comment?.display_created_time}</Text>
                      </View>
                    </View>
                    <View style={{ marginTop: 16, alignItems: 'flex-start' }}>
                      <Text
                        style={{
                          backgroundColor: '#383838',
                          paddingVertical: 3,
                          paddingHorizontal: 5,
                          borderRadius: 5,
                          color: 'white',
                          fontSize: 12,
                        }}
                      >
                        {score?.score_card_comment?.comment}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginVertical: 10,
                      borderTopColor: '#383838',
                      borderTopWidth: 0.5,
                    }}
                  ></View>
                </View>)
                })}
              </View>
            </View>
          </View>
          </View>
             )
            })}
        </View>

        <View style={{ marginBottom: 300 }}></View>
      </ScrollView>
    </View>
  );
}

const stylesdpr = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

const stylesNew = StyleSheet.create({
  billpaySection: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  billingTypesSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
  },
  billingTypes: {
    backgroundColor: '#202020',
    borderRadius: 5,
    padding: 10,
    height: 88,
    display: 'flex',
    width: (width - 52) / 3,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coursepriceText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  coursePrice: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#EB6925',
  },
  bookingAmount: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#A8A8A8',
  },
  totalpendingAmount: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#E0B519',
  },
  paymentPlanssection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salary: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  paymentPlanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  instalmentsText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  updatedjustnowText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  instalmentsDatesection: {
    padding: 10,
    backgroundColor: '#202020',
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 26,
  },
  instalmentStructure: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#383838',
    borderTopWidth: 0.5,
    paddingVertical: 5,
  },
  instalmentsDateText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
  },
  upiText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    paddingTop: 10,
  },
  totalInstalmentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    lineHeight: 22,
  },
  receivedSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  receivedInstalmentSection: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#202020',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewInstalmentdetailssection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 26,
  },
  recivedAmountText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#2A9F4D',
  },
  upirevivedContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  recivedupiText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  receivedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2BA750',
    borderColor: '#2BA750',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  paymnetIdText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A8A8A8',
    paddingTop: 5,
  },
});
