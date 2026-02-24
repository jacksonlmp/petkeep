import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand } from '@/constants/theme';
import type { PetSitter } from '@/services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS: [string, string][] = [
  ['#6D28D9', '#8B5CF6'],
  ['#0369A1', '#0EA5E9'],
  ['#065F46', '#10B981'],
  ['#92400E', '#F59E0B'],
  ['#9D174D', '#EC4899'],
];

function avatarColors(name: string): [string, string] {
  const idx =
    name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function initials(name: string): string {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const ANIMAL_EMOJI: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  chicken: '🐓',
  hamster: '🐹',
  other: '🐾',
};

const SERVICE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  keepwalk:   'walk-outline',
  keepsitter: 'home-outline',
  keephost:   'bed-outline',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  petsitter: PetSitter | null;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PetSitterDetailModal({ petsitter, onClose }: Props) {
  const insets = useSafeAreaInsets();

  if (!petsitter) return null;

  const [start, end] = avatarColors(petsitter.full_name);

  const handleSchedule = () => {
    Alert.alert('Em breve', 'Agendamento disponível na próxima versão.');
  };

  const handleMessage = () => {
    Alert.alert('Em breve', 'Mensagens disponíveis na próxima versão.');
  };

  return (
    <Modal
      visible={!!petsitter}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* ── Header bar ── */}
        <View style={styles.handleWrap}>
          <View style={styles.handleSpacer} />
          <View style={styles.handle} />
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="close" size={20} color={Brand.textSecondary} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces>
          {/* ── Avatar banner ── */}
          <LinearGradient colors={[start, end]} style={styles.banner}>
            <Text style={styles.bannerInitials}>{initials(petsitter.full_name)}</Text>
            {petsitter.is_active && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={14} color={Brand.white} />
                <Text style={styles.verifiedText}>Verificado</Text>
              </View>
            )}
          </LinearGradient>

          {/* ── Header info ── */}
          <View style={styles.section}>
            <Text style={styles.name}>{petsitter.full_name}</Text>

            {Boolean(petsitter.location) && (
              <View style={styles.row}>
                <Ionicons name="location-outline" size={14} color={Brand.textSecondary} />
                <Text style={styles.location}>{petsitter.location}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* ── Sobre ── */}
          {Boolean(petsitter.about) && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sobre</Text>
                <Text style={styles.aboutText}>{petsitter.about}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* ── Animais que cuido ── */}
          {petsitter.animal_types.length > 0 && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Animais que cuido</Text>
                <View style={styles.pillRow}>
                  {petsitter.animal_types.map((a) => (
                    <View key={a.id} style={styles.pill}>
                      <Text style={styles.pillEmoji}>
                        {ANIMAL_EMOJI[a.animal_type] ?? '🐾'}
                      </Text>
                      <Text style={styles.pillText}>{a.display_name}</Text>
                    </View>
                  ))}
                  {Boolean(petsitter.other_animals) && (
                    <View style={styles.pill}>
                      <Text style={styles.pillEmoji}>🐾</Text>
                      <Text style={styles.pillText}>{petsitter.other_animals}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* ── Serviços oferecidos ── */}
          {petsitter.service_types.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>
              <View style={styles.serviceList}>
                {petsitter.service_types.map((s) => (
                  <View key={s.id} style={styles.serviceRow}>
                    <View style={styles.serviceIconWrap}>
                      <Ionicons
                        name={SERVICE_ICON[s.service_type] ?? 'paw-outline'}
                        size={18}
                        color={Brand.primary}
                      />
                    </View>
                    <Text style={styles.serviceName}>{s.display_name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Bottom spacer so scroll doesn't sit under the sticky footer */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── Sticky footer ── */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.btnOutline, pressed && styles.btnPressed]}
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble-outline" size={18} color={Brand.primary} />
            <Text style={styles.btnOutlineText}>Mensagem</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnFilled, pressed && styles.btnPressed]}
            onPress={handleSchedule}
          >
            <Ionicons name="calendar-outline" size={18} color={Brand.white} />
            <Text style={styles.btnFilledText}>Agendar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.white,
  },
  handleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },
  handleSpacer: {
    width: 32,
  },
  handle: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Banner
  banner: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInitials: {
    fontSize: 64,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Brand.success,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.white,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
    marginBottom: 12,
  },

  // Header info
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.text,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: Brand.textSecondary,
  },

  // About
  aboutText: {
    fontSize: 14,
    color: Brand.textSecondary,
    lineHeight: 22,
  },

  // Animal pills
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Brand.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillEmoji: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primary,
  },

  // Services
  serviceList: {
    gap: 10,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Brand.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  serviceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
    flex: 1,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Brand.white,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Brand.primary,
  },
  btnFilled: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    backgroundColor: Brand.primary,
  },
  btnPressed: {
    opacity: 0.75,
  },
  btnOutlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.primary,
  },
  btnFilledText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.white,
  },
});
