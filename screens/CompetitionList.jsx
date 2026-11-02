import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import TitleBar from './components/TitleBar';
import Footer from './components/Footer';
import styles from './Style';
import moment from 'moment';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getLevelColor } from '../constants/competitions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../helper/callApi';

function formatDate(value) {
  if (!value) {
    return '--';
  }
  return moment(value).format('DD MMM YYYY');
}

function mapCompetitionListItem(item) {
  if (!item) {
    return null;
  }

  return {
    id: item.competition_id,
    host_branch_id: item.host_branch_id,
    name: item.competition_name,
    from_date: item.from_date,
    to_date: item.to_date,
    display_date_from_date: item.display_date_from_date,
    display_date_to_date: item.display_date_to_date,
    level: item.competition_level_name,
    venue: item.city || item.host_branch_name || '--',
    competition_flag: item.competition_flag,
    no_of_events: item.no_of_events || 0,
    host_branch_name: item.host_branch_name,
    is_internal: item.is_internal,
    is_own_branch: item.is_own_branch,
    description: item.competition_flag
      ? `${item.competition_flag} competition hosted by ${item.host_branch_name || 'academy'}`
      : 'Open competition. Tap to view details and apply.',
    events: [],
  };
}

export default function CompetitionList() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [competitions, setCompetitions] = useState([]);
  const [upcomingDays, setUpcomingDays] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigation();
  const isFocused = useIsFocused();
  const listControllerRef = useRef(null);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    if (isFocused) {
      getCompetitionListFn();
    }
    return () => {
      listControllerRef.current?.abort();
    };
  }, [isFocused]);

  async function getCompetitionListFn() {
    listControllerRef.current?.abort();
    const controller = new AbortController();
    listControllerRef.current = controller;

    setIsLoading(true);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(
      branch,
      '/athlete/competition/open-list',
      { upcoming_days: 30 },
      controller,
    );
    setIsLoading(false);

    if (respo?.status) {
      const mapped = (respo?.data?.competitionList || [])
        .map(mapCompetitionListItem)
        .filter(Boolean);
      setCompetitions(mapped);
      setUpcomingDays(respo?.data?.upcomingDays || 30);
    } else {
      setCompetitions([]);
    }
  }

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar title={'Competitions'} setSafeAreaHeight={setSafeAreaHeight} />
      <Footer activeIndex={4} />

      <ScrollView
        style={{ paddingTop: safeAreaHeight }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getCompetitionListFn}
            tintColor={theme.accent}
          />
        }
      >
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <View
            style={[
              localStyles.heroCard,
              {
                backgroundColor: isDark ? '#2A150B' : '#FFF4EC',
                borderColor: isDark ? '#4A2A16' : '#F2D2BC',
              },
            ]}
          >
            <Text style={[localStyles.heroEyebrow, { color: theme.accent }]}>
              Upcoming Matches
            </Text>
            <Text style={[localStyles.heroTitle, { color: theme.text }]}>
              Explore competitions and apply for events
            </Text>
            <Text style={[localStyles.heroSub, { color: theme.textSecondary }]}>
              {competitions.length} competition
              {competitions.length === 1 ? '' : 's'} open in the next {upcomingDays} days
            </Text>
          </View>

          {competitions.length === 0 && !isLoading && (
            <Text
              style={{
                color: theme.textSecondary,
                textAlign: 'center',
                marginTop: 40,
                fontSize: 15,
                fontWeight: '600',
              }}
            >
              No open competitions found
            </Text>
          )}

          {competitions.map((item) => {
            const levelColor = getLevelColor(item.level);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() =>
                  nav.navigate('CompetitionDetail', {
                    competitionId: item.id,
                    hostBranchId: item.host_branch_id,
                  })
                }
                style={[
                  localStyles.card,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={localStyles.cardTop}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View
                      style={[
                        localStyles.levelChip,
                        {
                          backgroundColor: isDark ? `${levelColor}22` : `${levelColor}18`,
                          borderColor: `${levelColor}55`,
                        },
                      ]}
                    >
                      <View
                        style={[localStyles.levelDot, { backgroundColor: levelColor }]}
                      />
                      <Text style={[localStyles.levelText, { color: levelColor }]}>
                        {item.level}
                      </Text>
                    </View>
                    {!!item.competition_flag && (
                      <View
                        style={[
                          localStyles.flagChip,
                          {
                            backgroundColor: theme.chip,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Text style={[localStyles.flagText, { color: theme.textSecondary }]}>
                          {item.competition_flag}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Image
                    source={require('../assets/icons/expand.png')}
                    style={{
                      width: 22,
                      height: 22,
                      tintColor: theme.textSecondary,
                    }}
                  />
                </View>

                <Text style={[localStyles.name, { color: theme.text }]} numberOfLines={2}>
                  {item.name}
                </Text>

                {(item.venue || item.host_branch_name) && (
                  <Text
                    style={[localStyles.venueText, { color: theme.textMuted }]}
                    numberOfLines={1}
                  >
                    {[item.venue, item.host_branch_name ? `Host: ${item.host_branch_name}` : null]
                      .filter(Boolean)
                      .join('  ·  ')}
                  </Text>
                )}

                <View style={localStyles.metaRow}>
                  <View
                    style={[
                      localStyles.dateBox,
                      {
                        backgroundColor: theme.chip,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={[localStyles.dateLabel, { color: theme.textMuted }]}>
                      From
                    </Text>
                    <Text style={[localStyles.dateValue, { color: theme.text }]}>
                      {item.display_date_from_date || formatDate(item.from_date)}
                    </Text>
                  </View>
                  <View
                    style={[
                      localStyles.dateBox,
                      {
                        backgroundColor: theme.chip,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={[localStyles.dateLabel, { color: theme.textMuted }]}>
                      To
                    </Text>
                    <Text style={[localStyles.dateValue, { color: theme.text }]}>
                      {item.display_date_to_date || formatDate(item.to_date)}
                    </Text>
                  </View>
                </View>

                <View style={localStyles.footerRow}>
                  <Text style={[localStyles.eventCount, { color: theme.textSecondary }]}>
                    {item.no_of_events} Event{item.no_of_events === 1 ? '' : 's'}
                  </Text>
                  <Text style={[localStyles.viewDetails, { color: theme.accent }]}>
                    View details
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 100 }} />

        <View style={{ marginBottom: 180 }} />
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  heroCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 18,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  heroSub: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  flagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  flagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 6,
  },
  venueText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  viewDetails: {
    fontSize: 13,
    fontWeight: '700',
  },
});
