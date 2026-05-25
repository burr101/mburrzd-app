import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useWishlistStore } from '../store/wishlistStore';
import { getProducts } from '../api/shopify';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 2 - theme.spacing.sm) / 2;

export default function WishlistScreen() {
  const navigation = useNavigation<any>();
  const { ids } = useWishlistStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length > 0) {
      getProducts(100).then(setAllProducts);
    }
  }, [ids.length]);

  const wishlisted = allProducts.filter((p) => ids.includes(p.id));

  if (ids.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>WISHLIST</Text>
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={44} color={theme.colors.textMuted} />
          <Text style={styles.emptyLabel}>YOUR WISHLIST IS EMPTY</Text>
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
      <Text style={styles.title}>WISHLIST ({ids.length})</Text>
      <FlatList
        data={wishlisted}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('HomeTab', {
              screen: 'ProductDetail',
              params: { handle: item.handle },
            })}
            style={{ width: CARD_WIDTH }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { color: theme.colors.text, fontSize: 11, letterSpacing: 5, padding: theme.spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md },
  emptyLabel: { color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 3 },
  shopBtn: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 10,
    marginTop: theme.spacing.md,
  },
  shopBtnText: { color: theme.colors.text, fontSize: 10, letterSpacing: 3 },
  grid: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  row: { gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
});
