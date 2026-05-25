import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: 'We collect information you provide when creating an account (name, email address, password), making purchases (billing and shipping address, payment details processed securely by Shopify), and taking the Find Your Fit quiz (body measurements, fit preferences). We also collect usage data such as products viewed and wishlist items.',
  },
  {
    title: 'How We Use Your Information',
    body: 'Your information is used to process orders and payments, personalise your shopping experience and fit recommendations, send order confirmations and shipping updates, and improve our products and services. We do not sell your personal data to third parties.',
  },
  {
    title: 'Data Storage & Security',
    body: 'Account data is stored securely using Supabase, a SOC 2 compliant cloud platform. Payment information is processed and stored by Shopify and is never stored on our servers. All data is transmitted using industry-standard TLS encryption.',
  },
  {
    title: 'Third-Party Services',
    body: 'We use Shopify for e-commerce and payment processing, Supabase for account management, and Apple for Sign in with Apple authentication. Each service has its own privacy policy. We encourage you to review them.',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to access, correct, or delete your personal data at any time. To delete your account and all associated data, go to Account → Delete Account. You may also contact us at privacy@mburrzd.com for any data requests.',
  },
  {
    title: 'Account Deletion',
    body: 'You can request account deletion directly in the app under Account → Delete Account. Upon request, your account and all personal data will be permanently deleted within 30 days. Order history required for legal/financial purposes may be retained for up to 7 years in accordance with applicable law.',
  },
  {
    title: 'Cookies & Analytics',
    body: 'The app does not use advertising cookies. We may collect anonymised usage analytics to understand how the app is used and improve the experience. You can opt out of analytics in your device settings.',
  },
  {
    title: 'Children\'s Privacy',
    body: 'Our services are intended for users 13 years of age and older. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us at privacy@mburrzd.com.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. Continued use of the app after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact Us',
    body: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us at privacy@mburrzd.com.',
  },
];

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={20} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: April 2025</Text>
        <Text style={styles.intro}>
          Mburrzd ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use the Mburrzd app.
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  backBtn: { width: 44, alignItems: 'flex-start' },
  headerTitle: { color: '#fff', fontSize: 10, letterSpacing: 4 },
  scroll: { padding: 24 },

  lastUpdated: { color: '#444', fontSize: 10, letterSpacing: 1, marginBottom: 20 },
  intro: { color: '#888', fontSize: 13, lineHeight: 22, marginBottom: 32 },

  section: { marginBottom: 28 },
  sectionTitle: {
    color: '#C9A96E',
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 10,
    fontFamily: undefined,
  },
  sectionBody: { color: '#666', fontSize: 13, lineHeight: 22 },
});
