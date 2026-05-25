import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme';
import { getProduct } from '../api/shopify';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { Product, ProductVariant } from '../types';

const { width, height } = Dimensions.get('window');
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const IMAGE_HEIGHT = width * 1.2;

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { handle } = route.params as { handle: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();

  useEffect(() => {
    getProduct(handle)
      .then((p) => {
        setProduct(p);
        setSelectedVariant(p?.variants.edges[0]?.node ?? null);
      })
      .finally(() => setLoading(false));
  }, [handle]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const fmt = (amount: string, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));

  const handleAdd = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addItem(selectedVariant.id);
      Alert.alert('Added to Bag', product!.title, [
        { text: 'Continue Shopping' },
        { text: 'View Bag', onPress: () => navigation.navigate('CartTab') },
      ]);
    } catch {
      Alert.alert('Error', 'Could not add to bag. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" size="small" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Product not found.</Text>
      </View>
    );
  }

  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);
  const sizes = [
    ...new Set(
      variants
        .map((v) => v.selectedOptions.find((o) => o.name.toLowerCase() === 'size')?.value)
        .filter(Boolean)
    ),
  ] as string[];

  const colors = [
    ...new Set(
      variants
        .map((v) => v.selectedOptions.find((o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour')?.value)
        .filter(Boolean)
    ),
  ] as string[];

  const COLOR_MAP: Record<string, string> = {
    black: '#1a1a1a', white: '#f5f5f5', navy: '#1b2a4a', grey: '#888',
    gray: '#888', charcoal: '#333', brown: '#6b4226', tan: '#d2b48c',
    beige: '#e8d5b0', cream: '#fffdd0', olive: '#6b6b2a', khaki: '#c3b091',
    red: '#8b0000', burgundy: '#800020', green: '#2d4a2d', blue: '#1a3a5c',
    camel: '#c19a6b', stone: '#b0a090', sand: '#d4c5a0', ivory: '#fffff0',
  };

  const selectedColor = selectedVariant?.selectedOptions.find(
    (o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour'
  )?.value ?? null;

  const wishlisted = isWishlisted(product.id);
  const selectedAvailable = selectedVariant?.availableForSale !== false;
  const anyAvailable = variants.some((v) => v.availableForSale);

  const getKeyFeatures = (title: string): string[] => {
    const t = title.toLowerCase();
    if (t.includes('tee') || t.includes('t-shirt')) return [
      '300 GSM premium cotton for structure and softness',
      '4-way stretch for unrestricted movement',
      'Engineered fit for broader frames',
      'Fade-resistant and shape-retaining fabric',
    ];
    if (t.includes('polo')) return [
      'Breathable luxury knit for all-day comfort',
      'Structured collar with precision stitching',
      'Moisture-wicking inner lining',
      'Reinforced placket for lasting form',
    ];
    if (t.includes('hoodie') || t.includes('sweat')) return [
      'French terry blend for premium weight and drape',
      'Garment-dyed for a rich, lasting colour',
      'Oversized silhouette with clean seam lines',
      'Double-lined hood for structure',
    ];
    if (t.includes('pant') || t.includes('trouser') || t.includes('short')) return [
      'Structured weave for a polished drape',
      'Tapered silhouette through the thigh and knee',
      'Elasticated comfort waistband with internal drawcord',
      'Reinforced stitching at high-stress points',
    ];
    return [
      'Premium fabrication selected for quality and longevity',
      'Precision-cut pattern for an engineered fit',
      'Reinforced construction at all stress points',
      'Designed and fit-tested for broader frames',
    ];
  };

  const keyFeatures = getKeyFeatures(product.title);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Sticky mini-header on scroll */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.stickyBack}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.stickyTitle} numberOfLines={1}>{product.title}</Text>
        <TouchableOpacity onPress={() => toggle(product.id)} style={styles.stickyWish}>
          <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={18} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Floating back/wish buttons (over image) */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity style={styles.floatBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatBtn} onPress={() => toggle(product.id)}>
          <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={18} color={wishlisted ? '#fff' : '#fff'} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Image gallery */}
        <FlatList
          data={images}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) =>
            setImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" />
          )}
        />

        {/* Line indicators */}
        {images.length > 1 && (
          <View style={styles.indicators}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.indicator, i === imageIndex && styles.indicatorActive]}
              />
            ))}
          </View>
        )}

        {/* Product info */}
        <View style={styles.info}>
          {/* Brand + title */}
          <View style={styles.titleSection}>
            <Text style={styles.brand}>MBURRZD</Text>
            <Text style={styles.productName}>{product.title}</Text>
            <Text style={styles.price}>
              {selectedVariant
                ? fmt(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                : fmt(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
            </Text>
          </View>

          {/* Availability */}
          <View style={styles.availabilityRow}>
            <View style={[styles.availDot, anyAvailable ? styles.availDotGreen : styles.availDotRed]} />
            <Text style={styles.availText}>
              {anyAvailable ? 'In Stock' : 'Sold Out'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Color selector */}
          {colors.length > 0 && (
            <View style={styles.colorSection}>
              <View style={styles.sizeLabelRow}>
                <Text style={styles.sectionLabel}>
                  COLOR{selectedColor ? ` — ${selectedColor.toUpperCase()}` : ''}
                </Text>
              </View>
              <View style={styles.colorGrid}>
                {colors.map((color) => {
                  const hex = COLOR_MAP[color.toLowerCase()] ?? '#555';
                  const isLight = ['white', 'cream', 'ivory', 'beige', 'sand', 'stone'].includes(color.toLowerCase());
                  const v = variants.find((va) =>
                    va.selectedOptions.some(
                      (o) => (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') && o.value === color
                    )
                  );
                  const active = selectedColor === color;
                  const available = v?.availableForSale ?? false;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorSwatch, { backgroundColor: hex }, active && styles.colorSwatchActive, !available && styles.colorSwatchUnavailable]}
                      onPress={() => v && available && setSelectedVariant(v)}
                      disabled={!available}
                    >
                      {active && (
                        <View style={[styles.colorSwatchCheck, { borderColor: isLight ? '#000' : '#fff' }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {colors.length > 0 && sizes.length > 0 && <View style={styles.divider} />}

          {/* Size selector */}
          {sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <View style={styles.sizeLabelRow}>
                <Text style={styles.sectionLabel}>SELECT SIZE</Text>
                <TouchableOpacity>
                  <Text style={styles.sizeGuide}>Size Guide →</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sizeGrid}>
                {sizes.map((size) => {
                  const v = variants.find((va) =>
                    va.selectedOptions.some(
                      (o) => o.name.toLowerCase() === 'size' && o.value === size
                    )
                  );
                  const active = selectedVariant?.selectedOptions.some(
                    (o) => o.name.toLowerCase() === 'size' && o.value === size
                  );
                  const available = v?.availableForSale ?? false;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeBox,
                        active && styles.sizeBoxActive,
                        !available && styles.sizeBoxUnavailable,
                      ]}
                      onPress={() => v && available && setSelectedVariant(v)}
                      disabled={!available}
                    >
                      <Text style={[styles.sizeText, active && styles.sizeTextActive, !available && styles.sizeTextUnavailable]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Details accordion */}
          {product.description ? (
            <TouchableOpacity
              style={styles.accordion}
              onPress={() => setDescOpen((v) => !v)}
            >
              <Text style={styles.accordionLabel}>PRODUCT DETAILS</Text>
              <Ionicons
                name={descOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#555"
              />
            </TouchableOpacity>
          ) : null}
          {descOpen && product.description && (
            <Text style={styles.desc}>{product.description}</Text>
          )}

          <View style={styles.divider} />

          {/* Shipping accordion */}
          <TouchableOpacity
            style={styles.accordion}
            onPress={() => setShippingOpen((v) => !v)}
          >
            <Text style={styles.accordionLabel}>SHIPPING & RETURNS</Text>
            <Ionicons
              name={shippingOpen ? 'chevron-up' : 'chevron-down'}
              size={14}
              color="#555"
            />
          </TouchableOpacity>
          {shippingOpen && (
            <View style={styles.shippingContent}>
              <Text style={styles.shippingLine}>• Free standard shipping on orders over $150</Text>
              <Text style={styles.shippingLine}>• Express delivery available at checkout</Text>
              <Text style={styles.shippingLine}>• Free returns within 30 days</Text>
              <Text style={styles.shippingLine}>• Items must be unworn with original tags</Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Key Features */}
          <View style={styles.keyFeaturesSection}>
            <Text style={styles.keyFeaturesTitle}>CRAFTED FOR PRECISION</Text>
            <View style={styles.keyFeaturesDivider} />
            {keyFeatures.map((f, i) => (
              <View key={i} style={styles.keyFeatureRow}>
                <View style={styles.keyFeatureDot} />
                <Text style={styles.keyFeatureText}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Trust badges */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#444" />
              <Text style={styles.trustText}>Authenticated</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="refresh-outline" size={16} color="#444" />
              <Text style={styles.trustText}>30-Day Returns</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="cube-outline" size={16} color="#444" />
              <Text style={styles.trustText}>Secure Checkout</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Sticky Add to Bag */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity
          style={[styles.addBtn, (!selectedAvailable || adding) && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={!selectedAvailable || adding}
          activeOpacity={0.85}
        >
          {adding ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.addBtnText}>
              {!anyAvailable ? 'SOLD OUT' : !selectedAvailable ? 'UNAVAILABLE' : 'ADD TO BAG'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
  notFound: { color: '#555', fontSize: 13, letterSpacing: 1 },

  // Sticky header
  stickyHeader: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  stickyBack: { padding: 4 },
  stickyTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: SERIF,
  },
  stickyWish: { padding: 4 },

  // Floating buttons
  floatingButtons: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  floatBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },

  // Image
  image: { width, height: IMAGE_HEIGHT },

  // Indicators (lines)
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  indicator: {
    height: 2,
    width: 20,
    backgroundColor: '#222',
  },
  indicatorActive: {
    backgroundColor: '#fff',
    width: 32,
  },

  // Info section
  info: { paddingHorizontal: 20 },

  titleSection: { paddingTop: 4, paddingBottom: 16 },
  brand: { color: '#333', fontSize: 8, letterSpacing: 3, marginBottom: 8 },
  productName: {
    color: '#fff',
    fontSize: 26,
    fontFamily: SERIF,
    lineHeight: 34,
    marginBottom: 10,
  },
  price: { color: '#C9A96E', fontSize: 20, fontWeight: '300', letterSpacing: 0.5 },

  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  availDot: { width: 6, height: 6, borderRadius: 3 },
  availDotGreen: { backgroundColor: '#3a7' },
  availDotRed: { backgroundColor: '#933' },
  availText: { color: '#666', fontSize: 11, letterSpacing: 1 },

  divider: { height: 1, backgroundColor: '#141414', marginVertical: 4 },

  // Colors
  colorSection: { paddingVertical: 16 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchActive: {
    borderWidth: 2,
    borderColor: '#C9A96E',
  },
  colorSwatchUnavailable: { opacity: 0.25 },
  colorSwatchCheck: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },

  // Sizes
  sizeSection: { paddingVertical: 16 },
  sizeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: { color: '#888', fontSize: 9, letterSpacing: 3 },
  sizeGuide: { color: '#555', fontSize: 10, letterSpacing: 1 },
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeBox: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 52,
    alignItems: 'center',
  },
  sizeBoxActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  sizeBoxUnavailable: { opacity: 0.3 },
  sizeText: { color: '#fff', fontSize: 13 },
  sizeTextActive: { color: '#000' },
  sizeTextUnavailable: { textDecorationLine: 'line-through' },

  // Accordion
  accordion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  accordionLabel: { color: '#999', fontSize: 9, letterSpacing: 3 },
  desc: { color: '#666', fontSize: 14, lineHeight: 22, paddingBottom: 16 },
  shippingContent: { paddingBottom: 16, gap: 8 },
  shippingLine: { color: '#555', fontSize: 13, lineHeight: 20 },

  // Key Features
  keyFeaturesSection: { paddingVertical: 20 },
  keyFeaturesTitle: { color: '#C9A96E', fontSize: 8, letterSpacing: 3, marginBottom: 12 },
  keyFeaturesDivider: { width: 20, height: 1, backgroundColor: '#C9A96E', opacity: 0.4, marginBottom: 16 },
  keyFeatureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  keyFeatureDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#C9A96E', marginTop: 6 },
  keyFeatureText: { color: '#666', fontSize: 13, lineHeight: 20, flex: 1 },

  // Trust badges
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  trustItem: { alignItems: 'center', gap: 6 },
  trustText: { color: '#444', fontSize: 9, letterSpacing: 1 },

  // Sticky CTA
  stickyBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#141414',
  },
  addBtn: {
    backgroundColor: '#C9A96E',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: '#1a1a1a' },
  addBtnText: {
    color: '#000',
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: '600',
  },
});
