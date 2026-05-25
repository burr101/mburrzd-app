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
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme';
import { getProducts } from '../api/shopify';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 2 - theme.spacing.sm) / 2;

export default function CollectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { handle, title } = route.params as { handle: string; title: string };
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(50, handle).then(setProducts);
  }, [handle]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{title?.toUpperCase()}</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { handle: item.handle })}
            style={{ width: CARD_WIDTH }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  title: { color: theme.colors.text, fontSize: 11, letterSpacing: 4 },
  grid: { padding: theme.spacing.lg },
  row: { gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
});
