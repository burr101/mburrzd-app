import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useCartStore } from '../store/cartStore';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const checkoutUrl = useCartStore((s) => s.checkoutUrl);

  if (!checkoutUrl) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.text }}>No checkout session available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>CHECKOUT</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>
      <WebView
        source={{ uri: checkoutUrl }}
        style={styles.webview}
        startInLoadingState
        allowsInlineMediaPlayback
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  closeBtn: { padding: 8 },
  title: { color: theme.colors.text, fontSize: 11, letterSpacing: 4 },
  webview: { flex: 1 },
});
