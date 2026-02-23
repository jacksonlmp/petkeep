import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

const ONBOARDING_KEY = '@petkeep_onboarding_done';

interface Slide {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  gradient: [string, string, string];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'paw',
    iconColor: '#4f46e5',
    iconBg: '#ede9fe',
    title: 'Bem-vindo ao PetKeep',
    subtitle: 'O lugar onde os melhores cuidadores se encontram com quem mais ama seus pets.',
    gradient: ['#e0e7ff', '#faf5ff', '#fce7f3'],
  },
  {
    id: '2',
    icon: 'shield-check',
    iconColor: '#7c3aed',
    iconBg: '#f3e8ff',
    title: 'Cuidadores verificados',
    subtitle: 'Todos os PetSitters da plataforma são avaliados e verificados para garantir a segurança do seu pet.',
    gradient: ['#f3e8ff', '#faf5ff', '#e0e7ff'],
  },
  {
    id: '3',
    icon: 'star-four-points-circle',
    iconColor: '#4f46e5',
    iconBg: '#ede9fe',
    title: 'Serviços para seu pet',
    subtitle: 'KeepSitter, KeepHost e KeepWalk — escolha o serviço ideal para a rotina do seu pet.',
    gradient: ['#fce7f3', '#faf5ff', '#e0e7ff'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const current = SLIDES[activeIndex];

  const finishOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/login');
  };

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <LinearGradient colors={current.gradient} style={styles.container}>
      <View style={styles.slideContent}>
        <View style={[styles.iconContainer, { backgroundColor: current.iconBg }]}>
          <MaterialCommunityIcons
            name={current.icon as any}
            size={72}
            color={current.iconColor}
          />
        </View>
        <Text style={styles.slideTitle}>{current.title}</Text>
        <Text style={styles.slideSubtitle}>{current.subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => setActiveIndex(i)}>
              <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={finishOnboarding} style={styles.skipButton}>
            <Text style={styles.skipText}>Pular</Text>
          </Pressable>

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              styles.nextButton,
              isLast && styles.nextButtonLast,
              pressed && styles.nextButtonPressed,
            ]}
          >
            {isLast ? (
              <Text style={styles.nextText}>Começar</Text>
            ) : (
              <>
                <Text style={styles.nextText}>Próximo</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

export { ONBOARDING_KEY };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    maxWidth: 340,
  },
  slideSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f46e5',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  nextButtonLast: {
    paddingHorizontal: 36,
  },
  nextButtonPressed: {
    backgroundColor: '#4338ca',
    opacity: 0.9,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
