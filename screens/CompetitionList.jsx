import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import TitleBar from './components/TitleBar';
import Footer from './components/Footer';
import styles from './Style';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { competitions, getLevelColor } from '../constants/competitions';

function formatDate(value) {
  if (!value) {
    return '--';
  }
  return moment(value).format('DD MMM YYYY');
}

export default function CompetitionList() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const nav = useNavigation();
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar title={'Competitions'} setSafeAreaHeight={setSafeAreaHeight} />
      <Footer activeIndex={4} />

      <ScrollView
        style={{ paddingTop: safeAreaHeight }}
        showsVerticalScrollIndicator={false}
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
              {competitions.length} competitions available across academy to international levels
            </Text>
          </View>

          {competitions.map((item) => {
            const levelColor = getLevelColor(item.level);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() =>
                  nav.navigate('CompetitionDetail', { competitionId: item.id })
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
                      {formatDate(item.from_date)}
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
                      {formatDate(item.to_date)}
                    </Text>
                  </View>
                </View>

                <View style={localStyles.footerRow}>
                  <Text style={[localStyles.eventCount, { color: theme.textSecondary }]}>
                    {item.events?.length || 0} Events
                  </Text>
                  <Text style={[localStyles.viewDetails, { color: theme.accent }]}>
                    View details
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{height : 100}}></View>


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
  name: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
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
