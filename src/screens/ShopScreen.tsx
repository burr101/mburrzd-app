import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { getCollections, getProducts } from '../api/shopify';
import ProductCard from '../components/ProductCard';
import { Collection, Product } from '../types';

const { width } = Dimensions.get('window');
const GAP = 10;
const CARD_WIDTH = (width - 32 - GAP) / 2;

type SortKey = 'default' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { label: string; key: SortKey }[] = [
  { label: 'Featured', key: 'default' },
  { label: 'Price: Low to High', key: 'price-asc' },
  { label: 'Price: High to Low', key: 'price-desc' },
];

export default function ShopScreen() {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('default');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    getCollections().then(setCollections);
  }, []);

  useEffect(() => {
    getProducts(50, activeCollection ?? undefined).then(setProducts);
  }, [activeCollection]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc')
      return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
    if (sort === 'price-desc')
      return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
    return 0;
  });

  const displayed = search.trim()
    ? sorted.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : sorted;

  const allCollections = [{ id: '__all', title: 'All', handle: null as any }, ...collections];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>THE EDIT</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => { setSearchOpen((v) => !v); }}
            >
              <Ionicons name={searchOpen ? 'close' : 'search-outline'} size={19} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setSortOpen((v) => !v)}
            >
              <Ionicons name="options-outline" size={19} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {searchOpen && (
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={14} color="#555" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search pieces..."
              placeholderTextColor="#444"
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={14} color="#555" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Sort dropdown */}
        {sortOpen && (
          <View style={styles.sortDropdown}>
            {SORT_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.key}
                style={styles.sortOption}
                onPress={() => { setSort(o.key); setSortOpen(false); }}
              >
                <Text style={[styles.sortOptionText, sort === o.key && styles.sortOptionActive]}>
                  {o.label}
                </Text>
                {sort === o.key && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Collection filters */}
      <FlatList
        data={allCollections}
        keyExtractor={(c) => c.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        renderItem={({ item }) => {
          const active = activeCollection === item.handle;
          return (
            <TouchableOpacity
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setActiveCollection(item.handle)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {item.title.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{displayed.length} PIECES</Text>
        <Text style={styles.sortLabel}>
          {SORT_OPTIONS.find((o) => o.key === sort)?.label.toUpperCase()}
        </Text>
      </View>

      {/* Grid */}
      <FlatList
        data={displayed}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            showNew={index < 6}
            onPress={() => navigation.navigate('ProductDetail', { handle: item.handle })}
            style={{ width: CARD_WIDTH }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No pieces found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 11,
    letterSpacing: 5,
    fontWeight: '400',
  },
  headerActions: { flexDirection: 'row', gap: 16 },
  actionBtn: { padding: 2 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 13 },

  sortDropdown: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    marginBottom: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  sortOptionText: { color: '#666', fontSize: 12, letterSpacing: 0.5 },
  sortOptionActive: { color: '#fff' },

  filters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  filterText: { color: '#555', fontSize: 8, letterSpacing: 2 },
  filterTextActive: { color: '#000' },

  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  countText: { color: '#333', fontSize: 9, letterSpacing: 2 },
  sortLabel: { color: '#333', fontSize: 9, letterSpacing: 1 },

  grid: { paddingHorizontal: 16, paddingBottom: 40 },
  row: { gap: GAP, marginBottom: GAP },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: '#333', fontSize: 12, letterSpacing: 2 },
});
