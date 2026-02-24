import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterModal, { FilterValues } from '@/components/filter-modal';
import PetSitterDetailModal from '@/components/petsitter-detail-modal';
import { Brand } from '@/constants/theme';
import { api, PetSitter } from '@/services/api';

const LIST_PADDING = 12;
const CARD_GAP = 10;

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
  dog: '🐶', cat: '🐱', bird: '🐦',
  rabbit: '🐰', chicken: '🐓', hamster: '🐹', other: '🐾',
};

const SERVICE_LABEL: Record<string, string> = {
  keepsitter: 'KeepSitter',
  keephost:   'KeepHost',
  keepwalk:   'KeepWalk',
};

// ─── PetSitter Card ───────────────────────────────────────────────────────────

function PetSitterCard({ item, cardW, onPress }: { item: PetSitter; cardW: number; onPress: () => void }) {
  const [start, end] = avatarColors(item.full_name);
  const avatarH = Math.round(cardW * 0.72);
  const MAX_ANIMALS = 3;
  const MAX_SERVICES = 2;
  const extraAnimals = item.animal_types.length - MAX_ANIMALS;
  const extraServices = item.service_types.length - MAX_SERVICES;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { width: cardW }, pressed && styles.cardPressed]}
    >
      {/* Avatar */}
      <LinearGradient colors={[start, end]} style={[styles.cardAvatar, { height: avatarH }]}>
        <Text style={styles.cardAvatarText}>{initials(item.full_name)}</Text>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color={Brand.white} />
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{item.full_name}</Text>

        {Boolean(item.location) && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={11} color={Brand.textSecondary} />
            <Text style={styles.cardLocation} numberOfLines={1}>{item.location}</Text>
          </View>
        )}

        {item.animal_types.length > 0 && (
          <View style={[styles.row, { marginTop: 5 }]}>
            {item.animal_types.slice(0, MAX_ANIMALS).map((a) => (
              <Text key={a.id} style={styles.animalEmoji}>
                {ANIMAL_EMOJI[a.animal_type] ?? '🐾'}
              </Text>
            ))}
            {extraAnimals > 0 && (
              <Text style={styles.extraText}>+{extraAnimals}</Text>
            )}
          </View>
        )}

        {item.service_types.length > 0 && (
          <View style={[styles.row, styles.chipRow]}>
            {item.service_types.slice(0, MAX_SERVICES).map((s) => (
              <View key={s.id} style={styles.chip}>
                <Text style={styles.chipText} numberOfLines={1}>
                  {SERVICE_LABEL[s.service_type] ?? s.display_name}
                </Text>
              </View>
            ))}
            {extraServices > 0 && (
              <View style={[styles.chip, styles.chipExtra]}>
                <Text style={styles.chipText}>+{extraServices}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  // Clamp to phone width on web so cards don't grow huge
  const effectiveW = Math.min(screenW, 480);
  const cardW = Math.floor((effectiveW - LIST_PADDING * 2 - CARD_GAP) / 2);

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FilterValues>({ animalTypes: [], serviceTypes: [] });
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedPetsitter, setSelectedPetsitter] = useState<PetSitter | null>(null);
  const [petsitters, setPetsitters] = useState<PetSitter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPetsitters = useCallback(
    async (search: string, activeFilters: FilterValues, silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const data = await api.petsitters.list({
          search: search || undefined,
          animal_type: activeFilters.animalTypes.join(',') || undefined,
          service_type: activeFilters.serviceTypes.join(',') || undefined,
        });
        setPetsitters(data);
      } catch (err: any) {
        const msg =
          err?.detail ?? err?.non_field_errors?.[0] ?? 'Erro ao carregar petsitters.';
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPetsitters('', filters);
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPetsitters(text, filters, true), 400);
  };

  const handleApplyFilters = (newFilters: FilterValues) => {
    setFilters(newFilters);
    fetchPetsitters(searchText, newFilters, true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPetsitters(searchText, filters, true);
  };

  const activeFilterCount = filters.animalTypes.length + filters.serviceTypes.length;

  return (
    <View style={styles.container}>
      {/* ── Purple header ── */}
      <LinearGradient
        colors={[Brand.gradientStart, Brand.gradientEnd]}
        style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'android' ? 12 : 8) }]}
      >
        <Text style={styles.headerTitle}>Encontre o petsitter ideal</Text>
        <Text style={styles.headerSubtitle}>Cuidado profissional para seu melhor amigo</Text>

          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={18}
                color={Brand.textMuted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou localização..."
                placeholderTextColor={Brand.textMuted}
                value={searchText}
                onChangeText={handleSearchChange}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchText.length > 0 && (
                <Pressable onPress={() => handleSearchChange('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={Brand.textMuted} />
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => setFilterVisible(true)}
              style={({ pressed }) => [
                styles.filterButton,
                pressed && styles.filterButtonPressed,
                activeFilterCount > 0 && styles.filterButtonActive,
              ]}
            >
              <Ionicons
                name="options-outline"
                size={20}
                color={activeFilterCount > 0 ? Brand.white : Brand.primary}
              />
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
      </LinearGradient>

      {/* ── Content ── */}
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Brand.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={Brand.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={() => fetchPetsitters(searchText, filters)}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          key="grid-3"
          data={petsitters}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <PetSitterCard item={item} cardW={cardW} onPress={() => setSelectedPetsitter(item)} />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Brand.primary}
              colors={[Brand.primary]}
            />
          }
          ListHeaderComponent={
            <Text style={styles.resultsLabel}>
              {petsitters.length}{' '}
              {petsitters.length === 1 ? 'petsitter disponível' : 'petsitters disponíveis'}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>Nenhum petsitter encontrado</Text>
              <Text style={styles.emptySubtitle}>
                Tente outros filtros ou um termo de busca diferente.
              </Text>
            </View>
          }
        />
      )}

      <FilterModal
        visible={filterVisible}
        initial={filters}
        onApply={handleApplyFilters}
        onClose={() => setFilterVisible(false)}
      />

      <PetSitterDetailModal
        petsitter={selectedPetsitter}
        onClose={() => setSelectedPetsitter(null)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  // Header
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Brand.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Brand.white, borderRadius: 12, paddingHorizontal: 12, height: 46,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Brand.text, paddingVertical: 0 },
  filterButton: {
    width: 46, height: 46, backgroundColor: Brand.white, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  filterButtonPressed: { opacity: 0.8 },
  filterButtonActive: { backgroundColor: Brand.primary },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: Brand.success, borderRadius: 8,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  filterBadgeText: { fontSize: 10, fontWeight: '700', color: Brand.white },
  // List
  listContent: { padding: LIST_PADDING, paddingBottom: 32 },
  columnWrapper: { gap: CARD_GAP, marginBottom: CARD_GAP },
  resultsLabel: { fontSize: 13, fontWeight: '600', color: Brand.textSecondary, marginBottom: 10 },
  // Card
  card: {
    backgroundColor: Brand.cardBg, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardPressed: { opacity: 0.92 },
  cardAvatar: { alignItems: 'center', justifyContent: 'center' },
  cardAvatarText: { fontSize: 36, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  verifiedBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Brand.success, borderRadius: 12, padding: 3,
  },
  cardBody: { padding: 10 },
  cardName: { fontSize: 14, fontWeight: '700', color: Brand.text, marginBottom: 3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  chipRow: { marginTop: 5, flexWrap: 'wrap', gap: 4 },
  cardLocation: { fontSize: 11, color: Brand.textSecondary, flex: 1 },
  animalEmoji: { fontSize: 15 },
  extraText: { fontSize: 11, color: Brand.textMuted, fontWeight: '600' },
  chip: { backgroundColor: Brand.surface, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 3 },
  chipExtra: { backgroundColor: '#EDE9FE' },
  chipText: { fontSize: 10, fontWeight: '600', color: Brand.primary },
  // States
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  errorText: { fontSize: 15, color: Brand.textSecondary, textAlign: 'center' },
  retryButton: { marginTop: 4, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: Brand.primary, borderRadius: 10 },
  retryText: { color: Brand.white, fontWeight: '600', fontSize: 14 },
  emptyContainer: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyEmoji: { fontSize: 48, marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Brand.text },
  emptySubtitle: { fontSize: 14, color: Brand.textSecondary, textAlign: 'center' },
});
