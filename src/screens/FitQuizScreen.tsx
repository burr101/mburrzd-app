import React, { useState } from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

type BodyType = 'Athletic' | 'Regular' | 'Big & Tall' | 'Portly';
type FitPref = 'Slim' | 'Regular' | 'Relaxed';

interface FitResult {
  size: string;
  fitNotes: string;
  chest: string;
  waist: string;
}

const HEIGHTS = ['5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"', '6\'5"', '6\'6"'];
const WEIGHT_RANGES = ['Under 180 lbs', '180–200 lbs', '201–220 lbs', '221–240 lbs', '241–260 lbs', '261–280 lbs', '281–300 lbs', '300+ lbs'];
const BODY_TYPES: { key: BodyType; desc: string }[] = [
  { key: 'Athletic', desc: 'Broad shoulders, defined build' },
  { key: 'Regular', desc: 'Proportional, standard build' },
  { key: 'Big & Tall', desc: 'Larger frame, height 6\'2"+' },
  { key: 'Portly', desc: 'Fuller midsection, shorter torso' },
];
const FIT_PREFS: { key: FitPref; desc: string }[] = [
  { key: 'Slim', desc: 'Close to the body, modern cut' },
  { key: 'Regular', desc: 'Classic fit, comfortable room' },
  { key: 'Relaxed', desc: 'Loose, easy movement' },
];

function computeResult(height: string, weight: string, body: BodyType, fit: FitPref): FitResult {
  const heightIndex = HEIGHTS.indexOf(height);
  const weightIndex = WEIGHT_RANGES.indexOf(weight);
  const score = weightIndex * 2 + (heightIndex >= 8 ? 1 : 0);

  let baseSize = 'M';
  if (score <= 3) baseSize = 'S';
  else if (score <= 6) baseSize = 'M';
  else if (score <= 9) baseSize = 'L';
  else if (score <= 12) baseSize = 'XL';
  else if (score <= 15) baseSize = '2XL';
  else baseSize = '3XL';

  if (body === 'Big & Tall') {
    baseSize = baseSize + 'T';
  } else if (body === 'Portly') {
    const portlySizes: Record<string, string> = { S: 'M', M: 'L', L: 'XL', XL: '2XL', '2XL': '3XL', '3XL': '4XL' };
    baseSize = portlySizes[baseSize] ?? baseSize;
  }

  const chestMap: Record<string, string> = {
    S: '36–38"', M: '39–41"', L: '42–44"', XL: '45–47"',
    '2XL': '48–50"', '3XL': '51–53"', '4XL': '54–56"',
    ST: '36–38"', MT: '39–41"', LT: '42–44"', XLT: '45–47"',
    '2XLT': '48–50"', '3XLT': '51–53"',
  };
  const waistMap: Record<string, string> = {
    S: '30–32"', M: '33–35"', L: '36–38"', XL: '39–41"',
    '2XL': '42–44"', '3XL': '45–47"', '4XL': '48–50"',
    ST: '30–32"', MT: '33–35"', LT: '36–38"', XLT: '39–41"',
    '2XLT': '42–44"', '3XLT': '45–47"',
  };

  const fitNoteMap: Record<FitPref, string> = {
    Slim: `Our ${baseSize} slim cut sits close to the chest and tapers through the waist. Pair with tailored trousers for a sharp silhouette.`,
    Regular: `Our ${baseSize} regular fit offers a classic, comfortable silhouette with ease through the chest and waist — the versatile everyday choice.`,
    Relaxed: `Our ${baseSize} relaxed fit gives generous room through the chest and body for ease of movement. Ideal for layering or a laid-back aesthetic.`,
  };

  return {
    size: baseSize,
    chest: chestMap[baseSize] ?? '—',
    waist: waistMap[baseSize] ?? '—',
    fitNotes: fitNoteMap[fit],
  };
}

export default function FitQuizScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [height, setHeight] = useState<string | null>(null);
  const [weight, setWeight] = useState<string | null>(null);
  const [bodyType, setBodyType] = useState<BodyType | null>(null);
  const [fitPref, setFitPref] = useState<FitPref | null>(null);
  const [result, setResult] = useState<FitResult | null>(null);

  const steps = ['HEIGHT', 'WEIGHT', 'BODY TYPE', 'FIT PREFERENCE'];
  const progress = (step / steps.length) * 100;

  const canNext = [
    !!height,
    !!weight,
    !!bodyType,
    !!fitPref,
  ][step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setResult(computeResult(height!, weight!, bodyType!, fitPref!));
      setStep(steps.length);
    }
  };

  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.resultHeader}>
            <Text style={styles.eyebrow}>YOUR RECOMMENDED FIT</Text>
            <Text style={styles.resultSize}>{result.size}</Text>
            <Text style={styles.resultSub}>MBURRZD SIZE</Text>
          </View>

          <View style={styles.measureRow}>
            <View style={styles.measureBox}>
              <Text style={styles.measureLabel}>CHEST</Text>
              <Text style={styles.measureValue}>{result.chest}</Text>
            </View>
            <View style={styles.measureDivider} />
            <View style={styles.measureBox}>
              <Text style={styles.measureLabel}>WAIST</Text>
              <Text style={styles.measureValue}>{result.waist}</Text>
            </View>
          </View>

          <View style={styles.fitNotesBox}>
            <Text style={styles.fitNotesLabel}>FIT NOTES</Text>
            <Text style={styles.fitNotesText}>{result.fitNotes}</Text>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate('ShopTab')}
            >
              <Text style={styles.shopBtnText}>SHOP YOUR SIZE</Text>
              <Ionicons name="arrow-forward" size={12} color="#000" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.retakeBtn}
              onPress={() => { setStep(0); setResult(null); setHeight(null); setWeight(null); setBodyType(null); setFitPref(null); }}
            >
              <Text style={styles.retakeBtnText}>RETAKE QUIZ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FIND YOUR FIT</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepLabel}>STEP {step + 1} OF {steps.length}</Text>
        <Text style={styles.question}>
          {['What is your height?', 'What is your weight?', 'How would you describe your body type?', 'What is your fit preference?'][step]}
        </Text>

        {/* Height */}
        {step === 0 && (
          <View style={styles.optionGrid}>
            {HEIGHTS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.chip, height === h && styles.chipActive]}
                onPress={() => setHeight(h)}
              >
                <Text style={[styles.chipText, height === h && styles.chipTextActive]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Weight */}
        {step === 1 && (
          <View style={styles.optionList}>
            {WEIGHT_RANGES.map((w) => (
              <TouchableOpacity
                key={w}
                style={[styles.listOption, weight === w && styles.listOptionActive]}
                onPress={() => setWeight(w)}
              >
                <Text style={[styles.listOptionText, weight === w && styles.listOptionTextActive]}>{w}</Text>
                {weight === w && <Ionicons name="checkmark" size={14} color="#000" />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Body type */}
        {step === 2 && (
          <View style={styles.optionList}>
            {BODY_TYPES.map(({ key, desc }) => (
              <TouchableOpacity
                key={key}
                style={[styles.cardOption, bodyType === key && styles.cardOptionActive]}
                onPress={() => setBodyType(key)}
              >
                <View style={styles.cardOptionInner}>
                  <Text style={[styles.cardOptionTitle, bodyType === key && styles.cardOptionTitleActive]}>{key}</Text>
                  <Text style={[styles.cardOptionDesc, bodyType === key && styles.cardOptionDescActive]}>{desc}</Text>
                </View>
                {bodyType === key && <Ionicons name="checkmark-circle" size={18} color="#C9A96E" />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Fit preference */}
        {step === 3 && (
          <View style={styles.optionList}>
            {FIT_PREFS.map(({ key, desc }) => (
              <TouchableOpacity
                key={key}
                style={[styles.cardOption, fitPref === key && styles.cardOptionActive]}
                onPress={() => setFitPref(key)}
              >
                <View style={styles.cardOptionInner}>
                  <Text style={[styles.cardOptionTitle, fitPref === key && styles.cardOptionTitleActive]}>{key}</Text>
                  <Text style={[styles.cardOptionDesc, fitPref === key && styles.cardOptionDescActive]}>{desc}</Text>
                </View>
                {fitPref === key && <Ionicons name="checkmark-circle" size={18} color="#C9A96E" />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !canNext && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canNext}
        >
          <Text style={styles.nextBtnText}>
            {step === steps.length - 1 ? 'GET MY SIZE' : 'CONTINUE'}
          </Text>
          <Ionicons name="arrow-forward" size={13} color="#000" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#141414',
  },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 10, letterSpacing: 4 },
  closeBtn: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },

  progressTrack: { height: 2, backgroundColor: '#1a1a1a' },
  progressFill: { height: 2, backgroundColor: '#C9A96E' },

  stepLabel: { color: '#444', fontSize: 9, letterSpacing: 3, marginTop: 24, marginBottom: 8 },
  question: {
    color: '#fff',
    fontSize: 22,
    fontFamily: SERIF,
    lineHeight: 32,
    marginBottom: 28,
  },

  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  chipText: { color: '#888', fontSize: 13 },
  chipTextActive: { color: '#000', fontWeight: '600' },

  optionList: { gap: 10 },
  listOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  listOptionActive: { backgroundColor: '#C9A96E', borderColor: '#C9A96E' },
  listOptionText: { color: '#888', fontSize: 14 },
  listOptionTextActive: { color: '#000', fontWeight: '600' },

  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 16,
  },
  cardOptionActive: { borderColor: '#C9A96E', backgroundColor: 'rgba(201,169,110,0.06)' },
  cardOptionInner: { flex: 1 },
  cardOptionTitle: { color: '#888', fontSize: 14, marginBottom: 3 },
  cardOptionTitleActive: { color: '#C9A96E', fontWeight: '600' },
  cardOptionDesc: { color: '#444', fontSize: 11, letterSpacing: 0.3 },
  cardOptionDescActive: { color: '#8a7050' },

  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#141414',
  },
  nextBtn: {
    backgroundColor: '#C9A96E',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#1a1a1a' },
  nextBtnText: { color: '#000', fontSize: 10, letterSpacing: 4, fontWeight: '600' },

  // Result screen
  resultHeader: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
  eyebrow: { color: '#555', fontSize: 9, letterSpacing: 3, marginBottom: 16 },
  resultSize: {
    color: '#C9A96E',
    fontSize: 72,
    fontFamily: SERIF,
    lineHeight: 80,
  },
  resultSub: { color: '#444', fontSize: 9, letterSpacing: 3, marginTop: 4 },

  measureRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1e1e1e',
    marginBottom: 20,
  },
  measureBox: { flex: 1, alignItems: 'center', paddingVertical: 20 },
  measureDivider: { width: 1, backgroundColor: '#1e1e1e' },
  measureLabel: { color: '#444', fontSize: 8, letterSpacing: 3, marginBottom: 8 },
  measureValue: { color: '#fff', fontSize: 18, fontFamily: SERIF },

  fitNotesBox: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 20,
    marginBottom: 28,
    backgroundColor: 'rgba(201,169,110,0.04)',
  },
  fitNotesLabel: { color: '#C9A96E', fontSize: 8, letterSpacing: 3, marginBottom: 12 },
  fitNotesText: { color: '#888', fontSize: 14, lineHeight: 22 },

  resultActions: { gap: 12 },
  shopBtn: {
    backgroundColor: '#C9A96E',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopBtnText: { color: '#000', fontSize: 10, letterSpacing: 4, fontWeight: '600' },
  retakeBtn: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    paddingVertical: 14,
    alignItems: 'center',
  },
  retakeBtnText: { color: '#555', fontSize: 10, letterSpacing: 3 },
});
