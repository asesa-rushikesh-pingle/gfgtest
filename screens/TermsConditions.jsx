import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import TitleBar from './components/TitleBar';
import styles from './Style';
import { useTheme } from '../context/ThemeContext';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By accessing and using the Gun for Glory website www.gunforglory.in you agree to be bound by these Terms and Conditions. If you do not agree with these Terms, please do not use the Website.',
  },
  {
    title: '2. Use of Website',
    body:
      'You agree to use the Website for lawful purposes only and not engage in any activity that violates applicable laws or regulations.',
  },
  {
    title: '3. Intellectual Property',
    body:
      'a. All content on the Website, including but not limited to text, images, graphics, videos, and logos, is protected by intellectual property rights owned by Gun for Glory or its affiliates.\n\nb. You may not reproduce, distribute, modify, or create derivative works based on the content from the Website without explicit permission.',
  },
  {
    title: '4. User Accounts',
    body:
      'a. You may need to create a user account to access certain features of the Website.\n\nb. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.',
  },
  {
    title: '5. Privacy',
    body:
      'a. Gun for Glory’s Privacy Policy governs the collection, use, and sharing of personal information you provide through the Website. By using the Website, you consent to the practices described in the Privacy Policy.',
  },
  {
    title: '6. User-Generated Content',
    body:
      'a. You may submit content such as comments, reviews, or testimonials to the Website.\n\nb. By submitting content, you grant Gun for Glory a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, adapt, publish, and display the content.',
  },
  {
    title: '7. Prohibited Activities',
    body:
      'You agree not to:\na. Use the Website for any illegal or unauthorized purpose.\nb. Post or transmit any content that is unlawful, defamatory, obscene, harmful, or violates the rights of others.\nc. Interfere with the proper functioning of the Website or any related networks or systems.\nd. Attempt to gain unauthorized access to any part of the Website or any user accounts.',
  },
  {
    title: '8. Limitation of Liability',
    body:
      'a. Gun for Glory is not responsible for any content posted by users on the Website.\n\nb. Gun for Glory does not guarantee the accuracy, completeness, or reliability of any content on the Website.\n\nc. Gun for Glory shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with your use of the Website.',
  },
  {
    title: '9. Modification and Termination',
    body:
      'Gun for Glory reserves the right to modify, suspend, or terminate the Website or these Terms at any time, for any reason, without notice.',
  },
  {
    title: '10. Contact Information',
    body:
      'For any questions or concerns regarding these Terms, please contact us at info@gunforglory.in.\n\nBy using the Gun for Glory Website, you acknowledge that you have read, understood, and agree to these Terms and Conditions.',
  },
];

export default function TermsConditions() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const { theme } = useTheme();

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar title={'Terms & Conditions'} setSafeAreaHeight={setSafeAreaHeight} />
      <ScrollView style={{ paddingTop: safeAreaHeight }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}>
          <Text style={[localStyles.heading, { color: theme.text }]}>Terms & Conditions</Text>
          {SECTIONS.map((section) => (
            <View key={section.title} style={{ marginTop: 22 }}>
              <Text style={[localStyles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
              <Text style={[localStyles.body, { color: theme.textSecondary }]}>{section.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});
