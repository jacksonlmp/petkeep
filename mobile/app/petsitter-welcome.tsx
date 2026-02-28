import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const FEATURES = [
  {
    key: 'flex',
    icon: 'time-outline' as const,
    iconBg: '#3b82f6',
    title: 'Flexibilidade Total',
    description: 'Defina seus próprios horários e trabalhe quando quiser',
  },
  {
    key: 'clients',
    icon: 'location-outline' as const,
    iconBg: '#7c3aed',
    title: 'Clientes Próximos',
    description: 'Conecte-se com clientes da sua região facilmente',
  },
  {
    key: 'community',
    icon: 'heart-outline' as const,
    iconBg: '#ec4899',
    title: 'Apoio à Comunidade',
    description: 'Ajude famílias a cuidarem melhor de seus pets',
  },
];

export default function PetSitterWelcomeScreen() {
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const horizontalPadding = 24;
  const contentWidth = windowWidth - horizontalPadding * 2;
  const carouselWidth = Math.max(260, contentWidth);
  const cardWidth = carouselWidth;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const index = Math.round(offset / cardWidth);
      if (index >= 0 && index < FEATURES.length) setActiveIndex(index);
    },
    [cardWidth]
  );

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, FEATURES.length - 1));
    setActiveIndex(next);
    scrollRef.current?.scrollTo({ x: next * cardWidth, animated: true });
  };

  return (
    <LinearGradient
      colors={['#e0e7ff', '#faf5ff', '#fce7f3']}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: windowHeight },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#374151" />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        <View style={styles.centerWrapper}>
          <View style={styles.header}>
            <Text style={styles.titleLine1}>Faça o que você Ama</Text>
            <Text style={styles.titleLine2}>e Ganhe Dinheiro</Text>
            <Text style={styles.subtitle}>
              Transforme seu amor por animais em uma oportunidade de renda
            </Text>
          </View>

          <View style={styles.carouselSection}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              contentContainerStyle={styles.carouselContent}
              style={[styles.carousel, { width: carouselWidth }]}
              decelerationRate="fast"
              snapToInterval={cardWidth}
              snapToAlignment="center"
            >
              {FEATURES.map((f) => (
                <View key={f.key} style={[styles.card, { width: cardWidth }]}>
                  <View style={[styles.cardIcon, { backgroundColor: f.iconBg }]}>
                    <Ionicons name={f.icon} size={22} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>{f.title}</Text>
                  <Text style={styles.cardDescription}>{f.description}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.carouselNav}>
              <Pressable
                onPress={() => goTo(activeIndex - 1)}
                style={({ pressed }) => [styles.arrowBtn, pressed && styles.arrowBtnPressed]}
                accessibilityLabel="Card anterior"
              >
                <Ionicons name="chevron-back" size={24} color="#7c3aed" />
              </Pressable>
              <View style={styles.dots}>
                {FEATURES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === activeIndex ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
              <Pressable
                onPress={() => goTo(activeIndex + 1)}
                style={({ pressed }) => [styles.arrowBtn, pressed && styles.arrowBtnPressed]}
                accessibilityLabel="Próximo card"
              >
                <Ionicons name="chevron-forward" size={24} color="#7c3aed" />
              </Pressable>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={() => router.push('/signup-petsitter')}
            >
              <LinearGradient
                colors={['#7c3aed', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Quero ser uma PetSitter</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Entrar</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.footer}>
            Cadastro 100% gratuito • Comece a trabalhar imediatamente
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: { fontSize: 16, color: '#374151' },
  centerWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
    paddingHorizontal: 8,
  },
  titleLine1: {
    fontSize: 26,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleLine2: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7c3aed',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  carouselSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
  },
  carousel: {
    marginBottom: 16,
    alignSelf: 'center',
  },
  carouselContent: {
    flexGrow: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  carouselNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBtnPressed: { opacity: 0.8 },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    height: 8,
    backgroundColor: '#7c3aed',
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  ctaButton: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  ctaButtonPressed: { opacity: 0.9 },
  ctaGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  loginText: { fontSize: 14, color: '#6b7280' },
  loginLink: { fontSize: 14, color: '#7c3aed', fontWeight: '600' },
  footer: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    width: '100%',
  },
});
