import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import React, { useState } from 'react';
import TitleBar from './components/TitleBar';
import Footer from './components/Footer';
import styles from './Style';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const nav = useNavigation();
  const { theme, isDark, setThemeMode } = useTheme();

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar title={'Settings'} setSafeAreaHeight={setSafeAreaHeight} />
      <Footer activeIndex={5} />
      <ScrollView style={{ paddingTop: safeAreaHeight }}>
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[stylesNew.sectionTitle, { color: theme.text }]}>Appearance</Text>
          <View style={[stylesNew.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[stylesNew.rowTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[stylesNew.rowSub, { color: theme.textSecondary }]}>
                {isDark ? 'Using dark theme' : 'Using light theme'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(enabled) => setThemeMode(enabled ? 'dark' : 'light')}
              trackColor={{ false: theme.switchTrackOff, true: theme.switchTrackOn }}
              thumbColor={theme.switchThumb}
            />
          </View>

          <Text style={[stylesNew.sectionTitle, { color: theme.text, marginTop: 24 }]}>
            Legal
          </Text>

          <TouchableOpacity
            style={[stylesNew.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => nav.navigate('PrivacyPolicy')}
          >
            <View style={stylesNew.rowLeft}>
              <Image
                source={require('../assets/icons/policy.png')}
                style={stylesNew.rowIcon}
              />
              <View>
                <Text style={[stylesNew.rowTitle, { color: theme.text }]}>Privacy Policy</Text>
                <Text style={[stylesNew.rowSub, { color: theme.textSecondary }]}>
                  How your personal data is handled
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={[stylesNew.chevron, { tintColor: theme.textSecondary }]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[stylesNew.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => nav.navigate('TermsConditions')}
          >
            <View style={stylesNew.rowLeft}>
              <Image
                source={require('../assets/icons/terms-and-conditions.png')}
                style={stylesNew.rowIcon}
              />
              <View>
                <Text style={[stylesNew.rowTitle, { color: theme.text }]}>
                  Terms & Conditions
                </Text>
                <Text style={[stylesNew.rowSub, { color: theme.textSecondary }]}>
                  Rules for using Gun for Glory
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/icons/expand.png')}
              style={[stylesNew.chevron, { tintColor: theme.textSecondary }]}
            />
          </TouchableOpacity>

          <Text style={[stylesNew.sectionTitle, { color: theme.text, marginTop: 24 }]}>
            App
          </Text>
          <View style={[stylesNew.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View>
              <Text style={[stylesNew.rowTitle, { color: theme.text }]}>App Version</Text>
              <Text style={[stylesNew.rowSub, { color: theme.textSecondary }]}>1.0</Text>
            </View>
          </View>

          <Text style={[stylesNew.footerNote, { color: theme.textMuted }]}>
            Gun For Glory Shooting Academy
          </Text>
        </View>
        <View style={{ marginBottom: 180 }} />
      </ScrollView>
    </View>
  );
}

const stylesNew = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  rowCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    paddingRight: 10,
  },
  rowIcon: {
    height: 24,
    width: 24,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  rowSub: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    marginTop: 2,
  },
  chevron: {
    height: 24,
    width: 24,
  },
  footerNote: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});
