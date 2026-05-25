import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useCartStore } from '../store/cartStore';
import LuxuryButton from '../components/LuxuryButton';
import { CartLineItem } from '../types';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { items, totalQuantity, totalAmount, currencyCode, updateItem, removeItem } = useCartStore();

  const fmt = (amount: string, currency = currencyCode) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>BAG</Text>
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={44} color={theme.colors.textMuted} />
          <Text style={styles.emptyLabel}>YOUR BAG IS EMPTY</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('ShopTab')}
          >
            <Text style={styles.shopBtnText}>EXPLORE COLLECTION</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BAG ({totalQuantity})</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: CartLineItem }) => (
          <View style={styles.lineItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
            <View style={styles.lineInfo}>
              <Text style={styles.lineLabel}>MBURRZD</Text>
              <Text style={styles.lineName}>{item.productTitle}</Text>
              {item.variantTitle !== 'Default Title' && (
                <Text style={styles.lineVariant}>{item.variantTitle}</Text>
              )}
              <Text style={styles.linePrice}>{fmt(item.price, item.currencyCode)}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() =>
                    item.quantity > 1
                      ? updateItem(item.id, item.quantity - 1)
                      : removeItem(item.id)
                  }
                >
                  <Ionicons name="remove" size={14} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateItem(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={14} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
              <Ionicons name="close" size={15} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>SUBTOTAL</Text>
          <Text style={styles.summaryValue}>{fmt(totalAmount)}</Text>
        </View>
        <Text style={styles.shippingNote}>Shipping calculated at checkout</Text>
        <LuxuryButton
          label="PROCEED TO CHECKOUT"
          onPress={() => navigation.navigate('Checkout')}
          style={{ marginTop: theme.spacing.md }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: {
    color: theme.colors.text,
    fontSize: 11,
    letterSpacing: 5,
    padding: theme.spacing.lg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  emptyLabel: { color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 3 },
  shopBtn: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 10,
    marginTop: theme.spacing.md,
  },
  shopBtnText: { color: theme.colors.text, fontSize: 10, letterSpacing: 3 },
  list: { paddingHorizontal: theme.spacing.lg },
  lineItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  thumb: { width: 88, height: 108, backgroundColor: theme.colors.surfaceElevated },
  lineInfo: { flex: 1, gap: 3 },
  lineLabel: { color: theme.colors.textSecondary, fontSize: 9, letterSpacing: 3 },
  lineName: { color: theme.colors.text, fontSize: 13 },
  lineVariant: { color: theme.colors.textSecondary, fontSize: 12 },
  linePrice: { color: theme.colors.text, fontSize: 13, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginTop: 6 },
  qtyBtn: { borderWidth: 1, borderColor: theme.colors.border, padding: 4 },
  qty: { color: theme.colors.text, fontSize: 13, minWidth: 20, textAlign: 'center' },
  removeBtn: { padding: 4 },
  summary: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: { color: theme.colors.textSecondary, fontSize: 10, letterSpacing: 3 },
  summaryValue: { color: theme.colors.text, fontSize: 14 },
  shippingNote: { color: theme.colors.textMuted, fontSize: 11 },
});
