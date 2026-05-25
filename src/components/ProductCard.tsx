import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useWishlistStore } from '../store/wishlistStore';
import { Product } from '../types';

interface Props {
  product: Product;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  showNew?: boolean;
  horizontal?: boolean;
}

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

function getFeatureLine(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('tee') || t.includes('t-shirt')) return '300 GSM cotton • 4-way stretch • Athletic fit';
  if (t.includes('polo')) return 'Luxury knit • Structured collar • Precision fit';
  if (t.includes('hoodie') || t.includes('sweat')) return 'French terry blend • Oversized drape • Garment-dyed';
  if (t.includes('short')) return 'Stretch twill • Reinforced waistband • Athletic taper';
  if (t.includes('pant') || t.includes('trouser')) return 'Structured weave • Tapered silhouette • Comfort waist';
  if (t.includes('jacket') || t.includes('coat') || t.includes('blazer')) return 'Premium outerwear • Structured shoulder • Fully lined';
  if (t.includes('shirt')) return 'Premium woven fabric • Relaxed drape • Refined finish';
  if (t.includes('set') || t.includes('suit')) return 'Matched fabrication • Coordinated fit • Elevated finish';
  return 'Premium construction • Engineered fit • Luxury finish';
}

export default function ProductCard({ product, onPress, style, showNew, horizontal }: Props) {
  const { toggle, isWishlisted } = useWishlistStore();
  const imageUrl = product.images?.edges?.[0]?.node?.url;
  const price = product.priceRange?.minVariantPrice;
  const wishlisted = isWishlisted(product.id);
  const soldOut = product.variants?.edges?.length > 0 &&
    !product.variants.edges.some((e) => e.node.availableForSale);

  const fmt = (amount: string, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));

  return (
    <TouchableOpacity
      style={[styles.card, horizontal && styles.cardHorizontal, style]}
      onPress={onPress}
      activeOpacity={0.94}
    >
      <View style={[styles.imageWrap, horizontal && styles.imageWrapHorizontal]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imageFallback} />
        )}

        {soldOut && (
          <View style={styles.soldOutOverlay}>
            <Text style={styles.soldOutText}>SOLD OUT</Text>
          </View>
        )}

        {showNew && !soldOut && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW IN</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggle(product.id)}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={16}
            color={wishlisted ? '#fff' : 'rgba(255,255,255,0.75)'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.brand}>MBURRZD</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        {!horizontal && (
          <Text style={styles.featureLine} numberOfLines={1}>
            {getFeatureLine(product.title)}
          </Text>
        )}
        <View style={styles.priceRow}>
          {price && (
            <Text style={styles.price}>{fmt(price.amount, price.currencyCode)}</Text>
          )}
          {soldOut && <Text style={styles.soldOutLabel}>Sold Out</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {},
  cardHorizontal: { flexDirection: 'row', alignItems: 'flex-start' },
  imageWrap: {
    aspectRatio: 3 / 4,
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  imageWrapHorizontal: {
    aspectRatio: undefined,
    width: 100,
    height: 130,
  },
  image: { width: '100%', height: '100%' },
  imageFallback: { flex: 1, backgroundColor: '#0f0f0f' },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 8,
    letterSpacing: 3,
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#C9A96E',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  newBadgeText: {
    color: '#000',
    fontSize: 7,
    letterSpacing: 2,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  info: {
    paddingTop: 10,
    gap: 3,
    flex: 1,
  },
  brand: {
    color: '#444',
    fontSize: 8,
    letterSpacing: 3,
  },
  title: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: SERIF,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  featureLine: {
    color: '#3a3a3a',
    fontSize: 9,
    letterSpacing: 0.3,
    marginTop: 3,
    marginBottom: 1,
  },
  price: {
    color: theme.colors.accent,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  soldOutLabel: {
    color: '#555',
    fontSize: 10,
    letterSpacing: 1,
  },
});
