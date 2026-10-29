import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const themes = {
  dark: {
    mode: 'dark',
    background: '#000000',
    card: '#202020',
    cardAlt: '#161616',
    chip: '#2B2B2B',
    surfaceMuted: '#383838',
    text: '#FFFFFF',
    textSecondary: '#A8A8A8',
    textMuted: '#656565',
    accent: '#EB6925',
    border: '#383838',
    iconInactive: '#959595',
    footerBtnBg: '#383838',
    inputBg: '#202020',
    inputText: '#FFFFFF',
    placeholder: '#656565',
    blurType: 'dark',
    statusBarStyle: 'light-content',
    switchTrackOff: '#383838',
    switchTrackOn: '#EB6925',
    switchThumb: '#FFFFFF',
    danger: '#FF0000',
    success: '#2BA750',
    dropdownBg: '#121210',
  },
  light: {
    mode: 'light',
    background: '#F2F2F2',
    card: '#FFFFFF',
    cardAlt: '#FFFFFF',
    chip: '#EFEFEF',
    surfaceMuted: '#E6E6E6',
    text: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#6F6F6F',
    accent: '#EB6925',
    border: '#E2E2E2',
    iconInactive: '#7A7A7A',
    footerBtnBg: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputText: '#1A1A1A',
    placeholder: '#8A8A8A',
    blurType: 'light',
    statusBarStyle: 'dark-content',
    switchTrackOff: '#D0D0D0',
    switchTrackOn: '#EB6925',
    switchThumb: '#FFFFFF',
    danger: '#D32F2F',
    success: '#2BA750',
    dropdownBg: '#FFFFFF',
  },
};

const ThemeContext = createContext({
  theme: themes.dark,
  isDark: true,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem('app_theme_mode');
        if (saved === 'light' || saved === 'dark') {
          setMode(saved);
        }
      } catch (e) {
        console.log('theme load error', e);
      } finally {
        setReady(true);
      }
    }
    loadTheme();
  }, []);

  async function setThemeMode(nextMode) {
    const value = nextMode === 'light' ? 'light' : 'dark';
    setMode(value);
    try {
      await AsyncStorage.setItem('app_theme_mode', value);
    } catch (e) {
      console.log('theme save error', e);
    }
  }

  function toggleTheme() {
    setThemeMode(mode === 'dark' ? 'light' : 'dark');
  }

  const theme = themes[mode] || themes.dark;

  const value = useMemo(
    () => ({
      theme,
      isDark: mode === 'dark',
      toggleTheme,
      setThemeMode,
      ready,
    }),
    [mode, ready],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
