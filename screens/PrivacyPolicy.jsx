import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import TitleBar from './components/TitleBar';
import styles from './Style';
import { useTheme } from '../context/ThemeContext';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    blocks: [
      {
        subtitle: '1.1 Personal Information',
        body:
          'We may collect personal information from you when you visit our website, register for an account, or interact with our services. The types of personal information we may collect include:\n\n– Full name\n– Contact information (e.g., email address, phone number, postal address)\n– Course information (e.g., Foundation Course, Bull’s eye)\n– Center information (e.g., Gachibowli, Trimulgherry, Bangalore)',
      },
      {
        subtitle: '1.2 Usage Data',
        body:
          'We also collect non-personal information about your interactions with our website and services. This includes:\n\n– Internet Protocol (IP) address\n– Browser type and version\n– Operating system\n– Referral source\n– Pages visited\n– Time and date of visit\n– Clickstream data\n– Other usage statistics',
      },
    ],
  },
  {
    title: '2. Use of Information',
    blocks: [
      {
        subtitle: '2.1 Provide Services',
        body:
          'We use the collected information to provide you with the requested services, including facilitating your participation in shooting sport disciplines, managing your account, processing payments, and responding to your inquiries.',
      },
      {
        subtitle: '2.2 Communication',
        body:
          'We may use your personal information to communicate with you, including sending transactional emails, service-related announcements, and promotional offers. You can opt out of receiving promotional communications by following the instructions provided in the emails.',
      },
      {
        subtitle: '2.3 Personalization',
        body:
          'We may personalize your experience on our website and tailor our services to better suit your preferences. This includes recommending relevant shooting sport disciplines, providing customized content, and offering personalized promotions.',
      },
      {
        subtitle: '2.4 Legal Obligations',
        body:
          'We may use or disclose your personal information to comply with legal obligations, enforce our terms and conditions, protect our rights, and respond to requests from public and governmental authorities.',
      },
    ],
  },
  {
    title: '3. Information Sharing',
    blocks: [
      {
        subtitle: '3.1 Service Providers',
        body:
          'If we undergo a merger, acquisition, or sale of all or a portion of our assets, your personal information may be transferred as part of the transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or the use of your personal information.',
      },
      {
        subtitle: '3.2 Business Transfers',
        body:
          'We may share your personal information with trusted third-party service providers who assist us in operating our website, conducting business, and providing services to you. These service providers have access to your personal information only to perform specific tasks on our behalf and are obligated to maintain its confidentiality.',
      },
      {
        subtitle: '3.3 Legal Requirements',
        body:
          'We may disclose your personal information if required to do so by law or if we believe in good faith that such action is necessary to comply with legal obligations, protect our rights, investigate fraud, or respond to a court order or governmental request.',
      },
    ],
  },
  {
    title: '4. Data Security',
    blocks: [
      {
        body:
          'We employ reasonable security measures to protect the personal information we collect from unauthorized access, disclosure, alteration, and destruction. However, please be aware that no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security of your information.',
      },
    ],
  },
  {
    title: '5. Data Retention',
    blocks: [
      {
        body:
          'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law. We will securely delete or anonymize your personal information when it is no longer needed for these purposes.',
      },
    ],
  },
  {
    title: '6. Your Rights',
    blocks: [
      {
        body:
          'You have the right to access, correct, update, or delete your personal information. If you would like to exercise any of these rights or have any questions or concerns about our privacy practices, please contact us using the contact details provided below.',
      },
    ],
  },
  {
    title: '7. Changes to this Privacy Policy',
    blocks: [
      {
        body:
          'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated Privacy Policy on our website with a new effective date. We encourage you to review this Privacy Policy periodically for any updates.',
      },
    ],
  },
  {
    title: '8. Contact Us',
    blocks: [
      {
        body:
          'If you have any questions, comments, or concerns about this Privacy Policy or our privacy practices, please contact us at:\n\nGun For Glory Shooting Academy\nShiv Chhatrapati Complex, 50M Shooting Range,\nBaner – Mahalunge Rd, Mahalunge, Pune, Maharashtra 411045\nEmail: info@gunforglory.in\nPhone: +91 7276044666\n\nBy using our website and services, you signify your acceptance of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use our website or provide us with your personal information.',
      },
    ],
  },
];

export default function PrivacyPolicy() {
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const { theme } = useTheme();

  return (
    <View style={[styles.parentWrapper, { backgroundColor: theme.background }]}>
      <TitleBar title={'Privacy Policy'} setSafeAreaHeight={setSafeAreaHeight} />
      <ScrollView style={{ paddingTop: safeAreaHeight }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}>
          <Text style={[localStyles.heading, { color: theme.text }]}>Privacy Policy</Text>
          <Text style={[localStyles.label, { color: theme.accent }]}>Effective Date</Text>
          <Text style={[localStyles.body, { color: theme.textSecondary }]}>
            This Privacy Policy describes how Gun For Glory Shooting Academy (“we,” “us,” or “our”)
            collects, uses, discloses, and protects your personal information when you visit our
            website and use our services. We are committed to protecting your privacy and ensuring
            the security of your personal information. By accessing or using our website, you agree
            to the terms of this Privacy Policy.
          </Text>

          {SECTIONS.map((section) => (
            <View key={section.title} style={{ marginTop: 22 }}>
              <Text style={[localStyles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
              {section.blocks.map((block, index) => (
                <View key={`${section.title}-${index}`} style={{ marginTop: 12 }}>
                  {!!block.subtitle && (
                    <Text style={[localStyles.subTitle, { color: theme.text }]}>
                      {block.subtitle}
                    </Text>
                  )}
                  <Text style={[localStyles.body, { color: theme.textSecondary }]}>{block.body}</Text>
                </View>
              ))}
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
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});
