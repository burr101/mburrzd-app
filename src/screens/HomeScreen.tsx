import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { getCollections, getProducts } from '../api/shopify';
import ProductCard from '../components/ProductCard';
import { Collection, Product } from '../types';

const { width, height } = Dimensions.get('window');
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const LIFESTYLE_BLOCKS = [
  {
    headline: 'For men who move differently',
    sub: 'Not made for the crowd. Built for those who define their own standard.',
  },
  {
    headline: 'Built for presence, not attention',
    sub: 'Every piece is designed to command a room — without saying a word.',
  },
  {
    headline: 'Luxury that fits you — not the other way around',
    sub: 'Engineered for real proportions. Tailored for confidence.',
  },
];

const TESTIMONIALS = [
  { quote: 'This is the best fitting tee I\'ve ever owned. You can feel the quality instantly.', name: 'Marcus D.' },
  { quote: 'The fabric, the fit, the presence… Mburrzd is different.', name: 'James K.' },
  { quote: 'Finally a brand that understands big and tall doesn\'t mean sacrificing style.', name: 'Devon R.' },
];

const WORN_BY = [
  { handle: '@mburrzd_', label: 'Signature Polo', localImage: require('../../assets/wornby1.jpg') },
];

function LifestyleBlock({ headline, sub, delay }: { headline: string; sub: string; delay: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.lifestyleBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.lifestyleHeadline}>{headline}</Text>
      <Text style={styles.lifestyleSub}>{sub}</Text>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialFade = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Promise.all([getProducts(20), getCollections()])
      .then(([p, c]) => { setProducts(p); setCollections(c); })
      .catch((e) => setError(e.message ?? 'Failed to load'));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(testimonialFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
        setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length);
        Animated.timing(testimonialFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, height * 0.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const t = TESTIMONIALS[testimonialIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Sticky floating header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <SafeAreaView style={styles.headerInner}>
          <Image source={require('../../assets/logoo.png')} style={styles.logoImg} resizeMode="contain" />
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('ShopTab')} style={styles.icon}>
              <Ionicons name="search-outline" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CartTab')} style={styles.icon}>
              <Ionicons name="bag-outline" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* ── HERO ── */}
        <View style={styles.hero}>
          <Image source={require('../../assets/hero1.png')} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)', '#000']}
            locations={[0, 0.3, 0.7, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <SafeAreaView style={styles.heroTop}>
            <Image source={require('../../assets/logoo.png')} style={styles.logoImg} resizeMode="contain" />
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => navigation.navigate('ShopTab')} style={styles.icon}>
                <Ionicons name="search-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('CartTab')} style={styles.icon}>
                <Ionicons name="bag-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>NEW SEASON · SS26</Text>
            <Text style={styles.heroHeadline}>The Art of{'\n'}Refined Dressing</Text>
            <TouchableOpacity style={styles.heroCta} onPress={() => navigation.navigate('ShopTab')}>
              <Text style={styles.heroCtaText}>EXPLORE COLLECTION</Text>
              <Ionicons name="arrow-forward" size={12} color="#000" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── LIFESTYLE / BRAND POSITIONING ── */}
        <View style={styles.lifestyleSection}>
          {LIFESTYLE_BLOCKS.map((block, i) => (
            <View key={i}>
              <LifestyleBlock headline={block.headline} sub={block.sub} delay={i * 250} />
              {i < LIFESTYLE_BLOCKS.length - 1 && <View style={styles.goldDivider} />}
            </View>
          ))}
        </View>

        {/* ── COLLECTIONS ── */}
        {collections.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.eyebrow}>COLLECTIONS</Text>
              <View style={styles.rule} />
            </View>
            <FlatList
              data={collections}
              keyExtractor={(c) => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.collectionRow}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.collectionCard}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('HomeTab', { screen: 'Collection', params: { handle: item.handle, title: item.title } })}
                >
                  {item.image?.url ? (
                    <Image source={{ uri: item.image.url }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                  ) : (
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#111' }]} />
                  )}
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFillObject} />
                  <View style={styles.collectionCardContent}>
                    <Text style={styles.collectionCardTitle}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.collectionCardCta}>SHOP NOW →</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── NEW ARRIVALS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.eyebrow}>NEW ARRIVALS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ShopTab')}>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products.slice(0, 8)}
            keyExtractor={(p) => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item, index }) => (
              <ProductCard
                product={item}
                showNew={index < 4}
                onPress={() => navigation.navigate('ProductDetail', { handle: item.handle })}
                style={{ width: width * 0.52, marginRight: 12 }}
              />
            )}
          />
        </View>

        {/* ── EDITORIAL STRIP ── */}
        <View style={styles.editorial}>
          <Text style={styles.editorialQuote}>
            "Crafted to endure.{'\n'}Designed with intent."
          </Text>
          <Text style={styles.editorialSub}>— MBURRZD, EST. 2024</Text>
          <View style={styles.editorialDivider} />
        </View>

        {/* ── THE EDIT (grid) ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.eyebrow}>THE EDIT</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ShopTab')}>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {products.slice(0, 6).map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                showNew={index < 2}
                onPress={() => navigation.navigate('ProductDetail', { handle: item.handle })}
                style={styles.gridItem}
              />
            ))}
          </View>
        </View>

        {/* ── WORN BY ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.eyebrow}>WORN BY</Text>
            <View style={styles.rule} />
          </View>
          <Text style={styles.wornByTitle}>Worn By Those Who{'\n'}Set the Standard</Text>
          <FlatList
            data={WORN_BY.map((w, i) => ({ product: products[i] ?? null, ...w }))}
            keyExtractor={(_, i) => String(i)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wornByRow}
            renderItem={({ item }) => {
              const imgUrl = item.product?.images?.edges?.[0]?.node?.url;
              return (
                <TouchableOpacity
                  style={styles.wornByCard}
                  activeOpacity={0.9}
                  onPress={() => item.product && navigation.navigate('ProductDetail', { handle: item.product.handle })}
                >
                  {item.localImage ? (
                    <Image source={item.localImage} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                  ) : imgUrl ? (
                    <Image source={{ uri: imgUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                  ) : (
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0f0f0f' }]} />
                  )}
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={StyleSheet.absoluteFillObject} />
                  <View style={styles.wornByCardContent}>
                    <Text style={styles.wornByHandle}>{item.handle}</Text>
                    <Text style={styles.wornByLabel}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* ── TESTIMONIALS ── */}
        <View style={styles.testimonialSection}>
          <Text style={styles.testimonialEyebrow}>WHAT OUR CLIENTS SAY</Text>
          <View style={styles.testimonialDivider} />
          <Animated.View style={[styles.testimonialCard, { opacity: testimonialFade }]}>
            <Text style={styles.testimonialQuoteMark}>"</Text>
            <Text style={styles.testimonialQuote}>{t.quote}</Text>
            <Text style={styles.testimonialName}>— {t.name}</Text>
          </Animated.View>
          <View style={styles.testimonialDots}>
            {TESTIMONIALS.map((_, i) => (
              <View key={i} style={[styles.testimonialDot, i === testimonialIndex && styles.testimonialDotActive]} />
            ))}
          </View>
        </View>

        {/* ── FIND YOUR FIT — LUXURY CONCIERGE ── */}
        <View style={styles.fitConcierge}>
          <View style={styles.fitConciergeInner}>
            <Text style={styles.fitConciergeEyebrow}>PERSONALIZED SIZING</Text>
            <View style={styles.fitConciergeDivider} />
            <Ionicons name="body-outline" size={28} color="#C9A96E" style={{ marginBottom: 20 }} />
            <Text style={styles.fitConciergeHeadline}>Find Your{'\n'}Perfect Fit</Text>
            <Text style={styles.fitConciergeTagline}>Tailored precision. No guessing. No compromises.</Text>
            <Text style={styles.fitConciergeBody}>
              Our guided fit experience matches you with the exact cut, feel, and silhouette your frame deserves.
            </Text>
            <TouchableOpacity
              style={styles.fitConciergeBtn}
              onPress={() => navigation.navigate('HomeTab', { screen: 'FitQuiz' })}
              activeOpacity={0.85}
            >
              <Text style={styles.fitConciergeBtnText}>START YOUR FIT EXPERIENCE</Text>
            </TouchableOpacity>
            <Text style={styles.fitConciergeNote}>Takes less than 60 seconds</Text>
          </View>
        </View>

        {/* ── THE CIRCLE ── */}
        <View style={styles.circleSection}>
          <Text style={styles.circleEyebrow}>EXCLUSIVE ACCESS</Text>
          <Text style={styles.circleHeadline}>The MBURRZD Circle</Text>
          <Text style={styles.circleSub}>
            Early access to new drops, private sales,{'\n'}and member-only collections.
          </Text>
          <TouchableOpacity style={styles.circleCta}>
            <Text style={styles.circleCtaText}>JOIN NOW</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Failed to load: {error}</Text>
        </View>
      )}
    </View>
  );
}

const GRID_GAP = 10;
const GRID_ITEM_WIDTH = (width - 32 - GRID_GAP) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Floating header
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.94)',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 4,
  },
  logoImg: { width: 90, height: 36 },
  headerIcons: { flexDirection: 'row', gap: 16 },
  icon: { padding: 2 },

  // Hero
  hero: { width, height: height * 0.78, justifyContent: 'space-between', backgroundColor: '#0a0a0a' },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  heroContent: { padding: 24, paddingBottom: 36 },
  heroEyebrow: { color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: 4, marginBottom: 12 },
  heroHeadline: {
    color: '#fff', fontSize: 38, fontFamily: SERIF,
    fontWeight: '400', lineHeight: 48, marginBottom: 28,
  },
  heroCta: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#C9A96E', alignSelf: 'flex-start',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  heroCtaText: { color: '#000', fontSize: 9, letterSpacing: 3, fontWeight: '600' },

  // Lifestyle section
  lifestyleSection: {
    backgroundColor: '#000',
    paddingHorizontal: 28,
    paddingVertical: 80,
  },
  lifestyleBlock: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  lifestyleHeadline: {
    color: '#fff',
    fontSize: 26,
    fontFamily: SERIF,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  lifestyleSub: {
    color: '#555',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
    maxWidth: 280,
  },
  goldDivider: {
    height: 1,
    backgroundColor: '#C9A96E',
    opacity: 0.25,
    marginHorizontal: 40,
  },

  // Sections
  section: { marginTop: 48 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  eyebrow: { color: theme.colors.text, fontSize: 9, letterSpacing: 4 },
  rule: { flex: 1, height: 1, backgroundColor: '#1e1e1e', marginHorizontal: 16 },
  viewAll: { color: '#555', fontSize: 9, letterSpacing: 2 },

  // Collections
  collectionRow: { paddingHorizontal: 20, gap: 10 },
  collectionCard: {
    width: 160, height: 210, backgroundColor: '#111',
    overflow: 'hidden', marginRight: 10, justifyContent: 'flex-end',
  },
  collectionCardContent: { padding: 14 },
  collectionCardTitle: { color: '#fff', fontSize: 10, letterSpacing: 2.5, lineHeight: 15, fontWeight: '500' },
  collectionCardCta: { color: 'rgba(255,255,255,0.45)', fontSize: 8, letterSpacing: 1.5, marginTop: 4 },

  // Horizontal list
  horizontalList: { paddingHorizontal: 20 },

  // Editorial strip
  editorial: {
    marginTop: 56,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1a1a1a',
  },
  editorialQuote: {
    color: '#fff', fontSize: 22, fontFamily: SERIF,
    fontStyle: 'italic', textAlign: 'center', lineHeight: 34,
  },
  editorialSub: { color: '#444', fontSize: 9, letterSpacing: 3, marginTop: 16 },
  editorialDivider: { width: 32, height: 1, backgroundColor: '#333', marginTop: 20 },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: GRID_GAP },
  gridItem: { width: GRID_ITEM_WIDTH },

  // Worn By
  wornByTitle: {
    color: '#fff',
    fontSize: 22,
    fontFamily: SERIF,
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 32,
    marginBottom: 20,
  },
  wornByRow: { paddingHorizontal: 20, gap: 12 },
  wornByCard: {
    width: 150, height: 200,
    backgroundColor: '#111',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  wornByCardContent: { padding: 12 },
  wornByHandle: { color: '#C9A96E', fontSize: 9, letterSpacing: 1.5, marginBottom: 3 },
  wornByLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 0.5 },

  // Testimonials
  testimonialSection: {
    marginTop: 64,
    paddingHorizontal: 28,
    paddingVertical: 56,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  testimonialEyebrow: { color: '#444', fontSize: 8, letterSpacing: 4, marginBottom: 16 },
  testimonialDivider: { width: 24, height: 1, backgroundColor: '#C9A96E', marginBottom: 32 },
  testimonialCard: { alignItems: 'center', minHeight: 140 },
  testimonialQuoteMark: {
    color: '#C9A96E', fontSize: 60, fontFamily: SERIF,
    lineHeight: 50, marginBottom: 8,
  },
  testimonialQuote: {
    color: '#ccc', fontSize: 17, fontFamily: SERIF,
    fontStyle: 'italic', textAlign: 'center',
    lineHeight: 28, letterSpacing: 0.3, marginBottom: 20,
  },
  testimonialName: { color: '#555', fontSize: 10, letterSpacing: 3 },
  testimonialDots: { flexDirection: 'row', gap: 8, marginTop: 28 },
  testimonialDot: { width: 20, height: 1, backgroundColor: '#2a2a2a' },
  testimonialDotActive: { backgroundColor: '#C9A96E', width: 32 },

  // Fit Concierge
  fitConcierge: { marginTop: 64, paddingHorizontal: 20 },
  fitConciergeInner: {
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.3)',
    padding: 36,
    alignItems: 'center',
    backgroundColor: 'rgba(201,169,110,0.02)',
  },
  fitConciergeEyebrow: { color: '#C9A96E', fontSize: 8, letterSpacing: 4, marginBottom: 16 },
  fitConciergeDivider: { width: 24, height: 1, backgroundColor: '#C9A96E', marginBottom: 28, opacity: 0.5 },
  fitConciergeHeadline: {
    color: '#fff', fontSize: 30, fontFamily: SERIF,
    textAlign: 'center', lineHeight: 40, marginBottom: 16,
  },
  fitConciergeTagline: {
    color: '#888', fontSize: 12, textAlign: 'center',
    letterSpacing: 0.5, marginBottom: 16, fontStyle: 'italic',
  },
  fitConciergeBody: {
    color: '#555', fontSize: 13, textAlign: 'center',
    lineHeight: 22, marginBottom: 32, maxWidth: 280,
  },
  fitConciergeBtn: {
    backgroundColor: '#C9A96E',
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginBottom: 14,
  },
  fitConciergeBtnText: { color: '#000', fontSize: 9, letterSpacing: 3, fontWeight: '700' },
  fitConciergeNote: { color: '#444', fontSize: 10, letterSpacing: 1 },

  // The Circle
  circleSection: {
    margin: 20,
    marginTop: 64,
    padding: 36,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    alignItems: 'center',
  },
  circleEyebrow: { color: '#444', fontSize: 8, letterSpacing: 4, marginBottom: 12 },
  circleHeadline: { color: '#fff', fontSize: 22, fontFamily: SERIF, marginBottom: 12, textAlign: 'center' },
  circleSub: { color: '#555', fontSize: 13, lineHeight: 21, textAlign: 'center', marginBottom: 24 },
  circleCta: { borderWidth: 1, borderColor: '#C9A96E', paddingHorizontal: 28, paddingVertical: 12 },
  circleCtaText: { color: '#C9A96E', fontSize: 9, letterSpacing: 3 },

  // Error
  errorBanner: {
    position: 'absolute', bottom: 80, left: 16, right: 16,
    backgroundColor: '#5a0000', padding: 12, borderRadius: 4,
  },
  errorText: { color: '#fff', fontSize: 11 },
});
