import React, { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { theme } from '../theme';
import { useAuthStore } from '../store/authStore';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const PERKS = [
  'Early access to new drops',
  'Exclusive member pricing',
  'Seamless order tracking',
  'Saved wishlist & preferences',
];

interface SavedFit {
  size: string;
  bodyType: string;
  fitPref: string;
}

function LoggedInView({ navigation }: { navigation: any }) {
  const { user, signOut, requestAccountDeletion } = useAuthStore();
  const savedFit = null as SavedFit | null;

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: async () => {
            await requestAccountDeletion();
            Alert.alert('Account Deleted', 'Your account and all associated data have been permanently deleted.');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'heart-outline' as const,
      label: 'Wishlist',
      sub: 'Your saved pieces',
      onPress: () => navigation.navigate('WishlistTab'),
    },
    {
      icon: 'body-outline' as const,
      label: 'Find Your Fit',
      sub: 'Update your size profile',
      onPress: () => navigation.navigate('HomeTab', { screen: 'FitQuiz' }),
    },
    {
      icon: 'document-text-outline' as const,
      label: 'Privacy Policy',
      sub: 'How we handle your data',
      onPress: () => navigation.navigate('AccountTab', { screen: 'PrivacyPolicy' }),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.firstName ?? 'M').charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.profileName}>{user?.firstName}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <View style={styles.memberBadge}>
          <Ionicons name="diamond-outline" size={10} color="#C9A96E" />
          <Text style={styles.memberBadgeText}>MBURRZD MEMBER</Text>
        </View>
      </View>

      {/* Saved Fit */}
      <View style={styles.fitCard}>
        <View style={styles.fitCardHeader}>
          <Text style={styles.fitCardLabel}>YOUR SAVED FIT</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HomeTab', { screen: 'FitQuiz' })}>
            <Text style={styles.fitCardEdit}>{savedFit ? 'EDIT' : 'TAKE QUIZ →'}</Text>
          </TouchableOpacity>
        </View>
        {savedFit ? (
          <View style={styles.fitDetails}>
            <Text style={styles.fitSize}>{savedFit.size}</Text>
            <Text style={styles.fitMeta}>{savedFit.bodyType} · {savedFit.fitPref} Fit</Text>
          </View>
        ) : (
          <Text style={styles.fitEmpty}>
            Take the Find Your Fit quiz to save your size profile and get personalised recommendations.
          </Text>
        )}
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
            onPress={item.onPress}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon} size={18} color="#666" />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#333" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Text style={styles.signOutText}>SIGN OUT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>DELETE ACCOUNT</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export default function AccountScreen() {
  const navigation = useNavigation<any>();
  const { user, loading, error, signIn, signUp, signInWithApple, clearError, initialize } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Authentication Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter your email', 'Please enter your email address above, then tap Forgot Password.');
      return;
    }
    const { supabase } = require('../lib/supabase');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Check your email', 'A password reset link has been sent to ' + email);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) return;
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, firstName, lastName);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        await signInWithApple(credential.identityToken, credential.fullName);
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Sign In Error', 'Apple Sign In failed. Please try again.');
      }
    }
  };

  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ACCOUNT</Text>
        </View>
        <LoggedInView navigation={navigation} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.headerTitle}>ACCOUNT</Text>

          {/* Sign in with Apple — iOS only */}
          {Platform.OS === 'ios' && (
            <View style={styles.appleSection}>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={0}
                style={styles.appleBtn}
                onPress={handleAppleSignIn}
              />
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabs}>
            {(['SIGN IN', 'REGISTER'] as const).map((tab, i) => {
              const active = isLogin ? i === 0 : i === 1;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, active && styles.tabActive]}
                  onPress={() => setIsLogin(i === 0)}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>FIRST NAME</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>LAST NAME</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>
            )}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            <TouchableOpacity
              style={[styles.authBtn, loading && { opacity: 0.6 }]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.authBtnText}>{isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</Text>
              )}
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Member perks */}
          <View style={styles.perks}>
            <Text style={styles.perksTitle}>MEMBER PERKS</Text>
            {PERKS.map((p) => (
              <View key={p} style={styles.perkRow}>
                <View style={styles.perkDot} />
                <Text style={styles.perk}>{p}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.privacyLink}
            onPress={() => navigation.navigate('AccountTab', { screen: 'PrivacyPolicy' })}
          >
            <Text style={styles.privacyLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  headerTitle: { color: '#fff', fontSize: 11, letterSpacing: 5 },
  scroll: { padding: 20 },

  // Apple sign in
  appleSection: { marginTop: 20 },
  appleBtn: { width: '100%', height: 48 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1a1a1a' },
  dividerText: { color: '#444', fontSize: 9, letterSpacing: 2 },

  // Logged in
  profileHeader: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#C9A96E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: { color: '#C9A96E', fontSize: 24, fontFamily: SERIF },
  profileName: { color: '#fff', fontSize: 18, fontFamily: SERIF, marginBottom: 4 },
  profileEmail: { color: '#555', fontSize: 11, letterSpacing: 0.5, marginBottom: 12 },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#C9A96E',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  memberBadgeText: { color: '#C9A96E', fontSize: 8, letterSpacing: 2 },

  fitCard: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(201,169,110,0.04)',
  },
  fitCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  fitCardLabel: { color: '#555', fontSize: 8, letterSpacing: 3 },
  fitCardEdit: { color: '#C9A96E', fontSize: 9, letterSpacing: 2 },
  fitDetails: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  fitSize: { color: '#C9A96E', fontSize: 36, fontFamily: SERIF },
  fitMeta: { color: '#666', fontSize: 12 },
  fitEmpty: { color: '#555', fontSize: 12, lineHeight: 20 },

  menu: {
    borderWidth: 1,
    borderColor: '#1a1a1a',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  menuIcon: { width: 36 },
  menuText: { flex: 1 },
  menuLabel: { color: '#ccc', fontSize: 13, marginBottom: 2 },
  menuSub: { color: '#444', fontSize: 10, letterSpacing: 0.3 },

  signOutBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  signOutText: { color: '#555', fontSize: 9, letterSpacing: 3 },

  deleteBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: { color: '#3a1a1a', fontSize: 9, letterSpacing: 3 },

  // Auth form
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#1a1a1a',
    marginBottom: 28,
    marginTop: 8,
  },
  tab: { flex: 1, paddingBottom: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 1, borderColor: '#C9A96E' },
  tabText: { color: '#444', fontSize: 10, letterSpacing: 3 },
  tabTextActive: { color: '#C9A96E' },

  form: { gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  inputGroup: { gap: 8 },
  label: { color: '#555', fontSize: 9, letterSpacing: 3 },
  input: {
    borderWidth: 1,
    borderColor: '#1a1a1a',
    color: '#fff',
    padding: 14,
    fontSize: 14,
  },
  authBtn: {
    backgroundColor: '#C9A96E',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  authBtnText: { color: '#000', fontSize: 10, letterSpacing: 4, fontWeight: '600' },
  forgotBtn: { alignItems: 'center', paddingTop: 4 },
  forgotText: { color: '#444', fontSize: 10, letterSpacing: 2 },

  perks: {
    marginTop: 40,
    paddingTop: 28,
    borderTopWidth: 1,
    borderColor: '#141414',
    gap: 10,
  },
  perksTitle: { color: '#fff', fontSize: 10, letterSpacing: 4, marginBottom: 8 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#C9A96E' },
  perk: { color: '#666', fontSize: 13, lineHeight: 22 },

  privacyLink: { alignItems: 'center', paddingVertical: 20 },
  privacyLinkText: { color: '#333', fontSize: 11, letterSpacing: 1 },
});
