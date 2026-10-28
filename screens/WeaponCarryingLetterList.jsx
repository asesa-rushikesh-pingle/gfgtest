import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import TitleBar from './components/TitleBar';
import styles from './Style';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../helper/callApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';

function formatDate(value) {
  if (!value) {
    return '--';
  }
  return moment(value).format('DD MMM YYYY');
}

function getApprovalLabel(status) {
  if (Number(status) === 1) {
    return 'Approved';
  }
  return 'Pending';
}

function getApprovalColor(status) {
  if (Number(status) === 1) {
    return '#2BA750';
  }
  return '#E0B519';
}

export default function WeaponCarryingLetterList() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inset = useSafeAreaInsets();
  const nav = useNavigation();
  const isFocused = useIsFocused();
  const listControllerRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      getListFn();
    }
    return () => {
      listControllerRef.current?.abort();
    };
  }, [isFocused]);

  async function getListFn() {
    listControllerRef.current?.abort();
    const controller = new AbortController();
    listControllerRef.current = controller;

    setIsLoading(true);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(
      branch,
      '/athlete/travel-certificate-list',
      { page: 1, limit: 100 },
      controller,
    );
    setIsLoading(false);

    if (respo?.status) {
      setList(respo?.data?.travelCertificateList?.data || []);
    }
  }

  return (
    <View style={styles.parentWrapper}>
      <TitleBar title={'Weapon Carrying Letter'} setSafeAreaHeight={setSafeAreaHeight} />
      <ScrollView
        style={{ paddingTop: safeAreaHeight }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getListFn} tintColor="#EB6925" />
        }
      >
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          {list?.length == 0 && !isLoading && (
            <Text style={stylesNew.emptyTitle}>
              No letters found{'\n'}
              
            </Text>
          )}

          {list?.map((item, index) => {
            const canEdit = Number(item?.approval_status) === 0;
            return (
              <View key={item?.id || index} style={stylesNew.card}>
                <View style={stylesNew.cardTop}>
                  <Text style={stylesNew.refNo} numberOfLines={1}>
                    {item?.ref_no || `Letter #${item?.id}`}
                  </Text>
                  <Text style={[stylesNew.status, { color: getApprovalColor(item?.approval_status) }]}>
                    {getApprovalLabel(item?.approval_status)}
                  </Text>
                </View>

                <Text style={stylesNew.routeText}>
                  {item?.from_location || '--'} → {item?.to_location || '--'}
                </Text>
                <Text style={stylesNew.metaText}>Mode: {item?.travel_mode || '--'}</Text>
                <Text style={stylesNew.metaText}>
                  Travel: {formatDate(item?.start_date)} - {formatDate(item?.end_date)}
                </Text>
                <Text style={stylesNew.metaText}>Purpose: {item?.purpose || '--'}</Text>
                {!!item?.weapons && (
                  <Text style={stylesNew.metaText}>Weapons: {item.weapons}</Text>
                )}
                <Text style={stylesNew.createdText}>
                  Created: {formatDate(item?.created_date)}
                </Text>

                <View style={stylesNew.actionRow}>
                  {!!item?.certificate_url && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(item.certificate_url)}
                      style={stylesNew.actionBtn}
                    >
                      <Text style={stylesNew.actionBtnText}>View PDF</Text>
                    </TouchableOpacity>
                  )}
                  {canEdit && (
                    <TouchableOpacity
                      onPress={() => {
                        nav.navigate('WeaponCarryingLetter', { editItem: item });
                      }}
                      style={[stylesNew.actionBtn, stylesNew.editBtn]}
                    >
                      <Text style={[stylesNew.actionBtnText, stylesNew.editBtnText]}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
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
        <TouchableOpacity onPress={() => nav.navigate('WeaponCarryingLetter', { editItem: null })}>
          <Text style={stylesNew.createBtn}>Request Weapon Carrying Letter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylesNew = StyleSheet.create({
  emptyTitle: {
    color: 'white',
    marginTop: 80,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
  emptySub: {
    color: '#A8A8A8',
    fontSize: 14,
    fontWeight: '400',
  },
  card: {
    padding: 16,
    backgroundColor: '#202020',
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  refNo: {
    flex: 1,
    color: '#EB6925',
    fontSize: 14,
    fontWeight: '700',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaText: {
    color: '#A8A8A8',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  createdText: {
    color: '#656565',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#383838',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  editBtn: {
    backgroundColor: '#EB6925',
  },
  editBtnText: {
    color: '#000',
  },
  createBtn: {
    padding: 10,
    backgroundColor: '#EB6925',
    borderRadius: 10,
    color: 'black',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});
