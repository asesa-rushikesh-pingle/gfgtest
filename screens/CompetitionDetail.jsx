import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import TitleBar from './components/TitleBar';
import styles from './Style';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getCompetitionById, getLevelColor } from '../constants/competitions';

function formatDate(value) {
  if (!value) {
    return '--';
  }
  return moment(value).format('DD MMM YYYY');
}

export default function CompetitionDetail() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [applied, setApplied] = useState(false);
  const route = useRoute();
  const inset = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  const competition = useMemo(() => {
    return getCompetitionById(route?.params?.competitionId);
  }, [route?.params?.competitionId]);

  if (!competition) {
    return (
      <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
        <TitleBar title={'Competition'} setSafeAreaHeight={setSafeAreaHeight} />
        <View style={{ flex: 1, paddingTop: safeAreaHeight, justifyContent: 'center' }}>
          <Text style={{ color: theme.text, textAlign: 'center', fontSize: 16 }}>
            Competition not found
          </Text>
        </View>
      </View>
    );
  }

  const levelColor = getLevelColor(competition.level);

  function onApply() {
    if (applied) {
      Alert.alert('Already Applied', 'You have already applied to this competition.');
      return;
    }
    setApplied(true);
    Alert.alert(
      'Application Submitted',
      `Your application for ${competition.name} has been recorded.`,
    );
  }

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar title={'Competition Details'} setSafeAreaHeight={setSafeAreaHeight} />

      <ScrollView
        style={{ paddingTop: safeAreaHeight }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <View
            style={[
              localStyles.headerCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                localStyles.levelChip,
                {
                  backgroundColor: isDark ? `${levelColor}22` : `${levelColor}18`,
                  borderColor: `${levelColor}55`,
                  alignSelf: 'flex-start',
                },
              ]}
            >
              <View style={[localStyles.levelDot, { backgroundColor: levelColor }]} />
              <Text style={[localStyles.levelText, { color: levelColor }]}>
                {competition.level} Level
              </Text>
            </View>

            <Text style={[localStyles.title, { color: theme.text }]}>
              {competition.name}
            </Text>
            <Text style={[localStyles.description, { color: theme.textSecondary }]}>
              {competition.description}
            </Text>

            <View style={localStyles.dateRow}>
              <View
                style={[
                  localStyles.infoBox,
                  { backgroundColor: theme.chip, borderColor: theme.border },
                ]}
              >
                <Text style={[localStyles.infoLabel, { color: theme.textMuted }]}>
                  From Date
                </Text>
                <Text style={[localStyles.infoValue, { color: theme.text }]}>
                  {formatDate(competition.from_date)}
                </Text>
              </View>
              <View
                style={[
                  localStyles.infoBox,
                  { backgroundColor: theme.chip, borderColor: theme.border },
                ]}
              >
                <Text style={[localStyles.infoLabel, { color: theme.textMuted }]}>
                  To Date
                </Text>
                <Text style={[localStyles.infoValue, { color: theme.text }]}>
                  {formatDate(competition.to_date)}
                </Text>
              </View>
            </View>

            <View
              style={[
                localStyles.venueBox,
                {
                  backgroundColor: isDark ? '#1B1B1B' : '#F7F7F7',
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[localStyles.infoLabel, { color: theme.textMuted }]}>
                Venue
              </Text>
              <Text style={[localStyles.venueText, { color: theme.text }]}>
                {competition.venue}
              </Text>
            </View>
          </View>

          <View style={localStyles.sectionHeader}>
            <Text style={[localStyles.sectionTitle, { color: theme.text }]}>
              Events
            </Text>
            <Text style={[localStyles.sectionCount, { color: theme.accent }]}>
              {competition.events?.length || 0}
            </Text>
          </View>

          {(competition.events || []).map((event, index) => (
            <View
              key={event.id}
              style={[
                localStyles.eventCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={localStyles.eventTop}>
                <View
                  style={[
                    localStyles.eventIndex,
                    {
                      backgroundColor: isDark ? '#3A1F10' : '#FFF1E8',
                    },
                  ]}
                >
                  <Text style={{ color: theme.accent, fontWeight: '700', fontSize: 13 }}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[localStyles.eventName, { color: theme.text }]}>
                    {event.name}
                  </Text>
                  <Text style={[localStyles.eventDate, { color: theme.textSecondary }]}>
                    {formatDate(event.date)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  localStyles.scoringBox,
                  {
                    backgroundColor: theme.chip,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[localStyles.scoringLabel, { color: theme.textMuted }]}>
                  Scoring
                </Text>
                <Text style={[localStyles.scoringValue, { color: theme.text }]}>
                  {event.scoring}
                </Text>
              </View>
            </View>
          ))}

          <View style={{height : 100}}></View>
        </View>
      </ScrollView>

      <View
        style={[
          localStyles.applyBar,
          {
            paddingBottom: inset.bottom + 12,
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onApply}
          style={[
            localStyles.applyBtn,
            {
              backgroundColor: applied ? theme.surfaceMuted : theme.accent,
            },
          ]}
        >
          <Text
            style={[
              localStyles.applyText,
              { color: applied ? theme.textSecondary : '#000000' },
            ]}
          >
            {applied ? 'Applied' : 'Apply to this Competition'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  infoBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  venueBox: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  venueText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  eventTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  eventIndex: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  eventDate: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  scoringBox: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  scoringLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 3,
  },
  scoringValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  applyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  applyBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
