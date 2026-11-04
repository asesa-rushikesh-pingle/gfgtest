import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import TitleBar from './components/TitleBar';
import styles from './Style';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getLevelColor } from '../constants/competitions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, postJSONData } from '../helper/callApi';

function formatDate(value) {
  if (!value) {
    return '--';
  }
  return moment(value).format('DD MMM YYYY');
}

function getApplyStatusMeta(applyStatus) {
  switch (Number(applyStatus)) {
    case 0:
      return { label: 'Pending', color: '#E0B519' };
    case 1:
      return { label: 'Approved', color: '#2BA750' };
    case 2:
      return { label: 'Rejected', color: '#E53935' };
    default:
      return null;
  }
}

function toInputValue(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  return String(value);
}

function mapCompetitionDetail(apiCompetition) {
  if (!apiCompetition) {
    return null;
  }

  const venue = [
    apiCompetition.address_line_1,
    apiCompetition.address_line_2,
    apiCompetition.city,
    apiCompetition.country,
    apiCompetition.pin_code ? `PIN ${apiCompetition.pin_code}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    id: apiCompetition.id,
    host_branch_id: apiCompetition.host_branch_id,
    name: apiCompetition.competition_name,
    from_date: apiCompetition.from_date,
    to_date: apiCompetition.to_date,
    display_date_from_date: apiCompetition.display_date_from_date,
    display_date_to_date: apiCompetition.display_date_to_date,
    level: apiCompetition.competition_level_name,
    venue: venue || '--',
    scoring: apiCompetition.scoring,
    is_internal: apiCompetition.is_internal,
    competition_pic_url: apiCompetition.competition_pic_url,
    description: apiCompetition.is_internal
      ? 'Internal competition'
      : 'Open competition',
    events: (apiCompetition.events || []).map(event => ({
      id: event.id,
      name: event.event_name,
      date: event.event_date,
      display_date: event.display_date_event_date,
      start_time: event.display_start_time || event.start_time,
      end_time: event.display_end_time || event.end_time,
      scoring: apiCompetition.scoring || '--',
      can_apply: !!event.can_apply,
      can_update_score: !!event.can_update_score,
      apply_status: event.apply_status,
      score: event.score,
      rank: event.rank,
    })),
  };
}

export default function CompetitionDetail() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [competition, setCompetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingEventId, setApplyingEventId] = useState(null);
  const [savingScoreEventId, setSavingScoreEventId] = useState(null);
  const [scoreForms, setScoreForms] = useState({});
  const route = useRoute();
  const inset = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const controllerRef = useRef(null);

  const competitionId =
    route?.params?.competitionId || route?.params?.competition?.id;
  const hostBranchId =
    route?.params?.hostBranchId ||
    route?.params?.competition?.host_branch_id;

  useEffect(() => {
    getCompetitionDetailFn();
    return () => {
      controllerRef.current?.abort();
    };
  }, [competitionId, hostBranchId]);

  function syncScoreForms(events = []) {
    const nextForms = {};
    events.forEach(event => {
      nextForms[event.id] = {
        score: toInputValue(event.score),
        rank: toInputValue(event.rank),
      };
    });
    setScoreForms(nextForms);
  }

  function updateScoreForm(eventId, field, value) {
    const sanitized =
      field === 'rank'
        ? value.replace(/[^0-9]/g, '')
        : value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    setScoreForms(prev => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || { score: '', rank: '' }),
        [field]: sanitized,
      },
    }));
  }

  async function getCompetitionDetailFn() {
    if (!competitionId || !hostBranchId) {
      setCompetition(null);
      setIsLoading(false);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await getData(
      branch,
      '/athlete/competition/get',
      {
        host_branch_id: hostBranchId,
        competition_id: competitionId,
      },
      controller,
    );
    setIsLoading(false);

    if (respo?.status && respo?.data?.competition) {
      const mapped = mapCompetitionDetail(respo.data.competition);
      setCompetition(mapped);
      syncScoreForms(mapped.events);
    } else {
      setCompetition(null);
      setScoreForms({});
    }
  }

  function confirmApplyEvent(event) {
    if (!event?.can_apply || applyingEventId) {
      return;
    }

    Alert.alert(
      'Confirm Apply',
      `Do you want to apply for "${event.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => onApplyEvent(event),
        },
      ],
    );
  }

  async function onApplyEvent(event) {
    if (!event?.can_apply || applyingEventId) {
      return;
    }

    setApplyingEventId(event.id);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await postJSONData(branch, '/athlete/competition/request', {
      host_branch_id: Number(hostBranchId),
      competition_id: Number(competitionId),
      competition_event_id: Number(event.id),
    });
    setApplyingEventId(null);

    if (respo?.status) {
      Alert.alert('Success', respo.message || 'Participation request sent');
      getCompetitionDetailFn();
    }
  }

  function confirmSaveScore(event) {
    if (!event?.can_update_score || savingScoreEventId) {
      return;
    }

    const form = scoreForms[event.id] || { score: '', rank: '' };
    const score = Number(form.score);
    const rank = Number(form.rank);

    if (form.score === '' || Number.isNaN(score)) {
      Alert.alert('Invalid score', 'Please enter a valid score.');
      return;
    }
    if (form.rank === '' || Number.isNaN(rank) || !Number.isInteger(rank) || rank < 1) {
      Alert.alert('Invalid rank', 'Please enter a valid rank.');
      return;
    }

    Alert.alert(
      'Confirm Save',
      `Save score ${score} and rank ${rank} for "${event.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => onSaveScore(event, score, rank),
        },
      ],
    );
  }

  async function onSaveScore(event, score, rank) {
    if (!event?.can_update_score || savingScoreEventId) {
      return;
    }

    setSavingScoreEventId(event.id);
    const branch = await AsyncStorage.getItem('branch_slug');
    const respo = await postJSONData(branch, '/athlete/competition/score', {
      host_branch_id: Number(hostBranchId),
      competition_id: Number(competitionId),
      competition_event_id: Number(event.id),
      score,
      rank,
    });
    setSavingScoreEventId(null);

    if (respo?.status) {
      Alert.alert('Success', respo.message || 'Score and rank saved');
      getCompetitionDetailFn();
    }
  }

  const levelColor = getLevelColor(competition?.level);

  if (isLoading && !competition) {
    return (
      <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
        <TitleBar title={'Competition Details'} setSafeAreaHeight={setSafeAreaHeight} />
        <View style={{ flex: 1, paddingTop: safeAreaHeight, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      </View>
    );
  }

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

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar title={'Competition Details'} setSafeAreaHeight={setSafeAreaHeight} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        style={{ flex: 1, paddingTop: safeAreaHeight }}
        contentContainerStyle={{ paddingBottom: inset.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getCompetitionDetailFn}
            tintColor={theme.accent}
          />
        }
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
              {competition.scoring
                ? `  ·  Scoring: ${String(competition.scoring).toUpperCase()}`
                : ''}
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
                  {competition.display_date_from_date || formatDate(competition.from_date)}
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
                  {competition.display_date_to_date || formatDate(competition.to_date)}
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

          {(competition.events || []).length === 0 && (
            <Text style={{ color: theme.textSecondary, marginBottom: 12 }}>
              No events available
            </Text>
          )}

          {(competition.events || []).map((event, index) => {
            const statusMeta = getApplyStatusMeta(event.apply_status);
            const isApplying = applyingEventId === event.id;
            const isSavingScore = savingScoreEventId === event.id;
            const scoreForm = scoreForms[event.id] || { score: '', rank: '' };
            const showSavedScore =
              !event.can_update_score &&
              ((event.score !== null && event.score !== undefined) ||
                (event.rank !== null && event.rank !== undefined));

            return (
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
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <Text style={[localStyles.eventName, { color: theme.text, flex: 1 }]}>
                        {event.name}
                      </Text>
                      {!event.can_apply && statusMeta && (
                        <View
                          style={[
                            localStyles.statusChip,
                            {
                              backgroundColor: isDark
                                ? `${statusMeta.color}22`
                                : `${statusMeta.color}18`,
                              borderColor: `${statusMeta.color}55`,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '700',
                              color: statusMeta.color,
                            }}
                          >
                            {statusMeta.label}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[localStyles.eventDate, { color: theme.textSecondary }]}>
                      {event.display_date || formatDate(event.date)}
                    </Text>
                    {(event.start_time || event.end_time) && (
                      <Text style={[localStyles.eventDate, { color: theme.textMuted }]}>
                        {[event.start_time, event.end_time].filter(Boolean).join(' - ')}
                      </Text>
                    )}
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
                    {String(event.scoring || '--').toUpperCase()}
                  </Text>
                </View>

                {showSavedScore && (
                  <View style={localStyles.resultRow}>
                    <View
                      style={[
                        localStyles.resultBox,
                        { backgroundColor: theme.chip, borderColor: theme.border },
                      ]}
                    >
                      <Text style={[localStyles.scoringLabel, { color: theme.textMuted }]}>
                        Score
                      </Text>
                      <Text style={[localStyles.scoringValue, { color: theme.text }]}>
                        {event.score ?? '--'}
                      </Text>
                    </View>
                    <View
                      style={[
                        localStyles.resultBox,
                        { backgroundColor: theme.chip, borderColor: theme.border },
                      ]}
                    >
                      <Text style={[localStyles.scoringLabel, { color: theme.textMuted }]}>
                        Rank
                      </Text>
                      <Text style={[localStyles.scoringValue, { color: theme.text }]}>
                        {event.rank ?? '--'}
                      </Text>
                    </View>
                  </View>
                )}

                {event.can_update_score && (
                  <View style={{ marginTop: 12 }}>
                    <View style={localStyles.resultRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[localStyles.scoringLabel, { color: theme.textMuted }]}>
                          Score
                        </Text>
                        <TextInput
                          value={scoreForm.score}
                          onChangeText={val => updateScoreForm(event.id, 'score', val)}
                          keyboardType="decimal-pad"
                          placeholder="Enter score"
                          placeholderTextColor={theme.textMuted}
                          style={[
                            localStyles.input,
                            {
                              color: theme.text,
                              backgroundColor: theme.chip,
                              borderColor: theme.border,
                            },
                          ]}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[localStyles.scoringLabel, { color: theme.textMuted }]}>
                          Rank
                        </Text>
                        <TextInput
                          value={scoreForm.rank}
                          onChangeText={val => updateScoreForm(event.id, 'rank', val)}
                          keyboardType="number-pad"
                          placeholder="Enter rank"
                          placeholderTextColor={theme.textMuted}
                          style={[
                            localStyles.input,
                            {
                              color: theme.text,
                              backgroundColor: theme.chip,
                              borderColor: theme.border,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled={!!savingScoreEventId}
                      onPress={() => confirmSaveScore(event)}
                      style={[
                        localStyles.applyBtn,
                        {
                          backgroundColor: isSavingScore
                            ? theme.surfaceMuted
                            : theme.accent,
                        },
                      ]}
                    >
                      {isSavingScore ? (
                        <ActivityIndicator size="small" color={theme.textSecondary} />
                      ) : (
                        <Text style={localStyles.applyText}>Save Score & Rank</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {event.can_apply && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={!!applyingEventId}
                    onPress={() => confirmApplyEvent(event)}
                    style={[
                      localStyles.applyBtn,
                      {
                        backgroundColor: isApplying
                          ? theme.surfaceMuted
                          : theme.accent,
                      },
                    ]}
                  >
                    {isApplying ? (
                      <ActivityIndicator size="small" color={theme.textSecondary} />
                    ) : (
                      <Text style={localStyles.applyText}>Apply to Event</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
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
  resultRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  resultBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  input: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  applyBtn: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
});
