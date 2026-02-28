import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceType = 'KeepWalk' | 'KeepHost' | 'KeepSitter';

interface Appointment {
  id: string;
  date: Date;
  time: string;
  petName: string;
  serviceType: ServiceType;
  petOwner: string;
  completed?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TODAY = new Date();

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    date: TODAY,
    time: '09:00',
    petName: 'Rex',
    serviceType: 'KeepWalk',
    petOwner: 'João Silva',
    completed: true,
  },
  {
    id: '2',
    date: TODAY,
    time: '14:00',
    petName: 'Bella',
    serviceType: 'KeepSitter',
    petOwner: 'Maria Santos',
    completed: true,
  },
  {
    id: '3',
    date: TODAY,
    time: '16:00',
    petName: 'Max',
    serviceType: 'KeepHost',
    petOwner: 'Pedro Costa',
    completed: false,
  },
  {
    id: '4',
    date: TODAY,
    time: '18:00',
    petName: 'Luna',
    serviceType: 'KeepWalk',
    petOwner: 'Ana Oliveira',
    completed: false,
  },
  {
    id: '5',
    date: addDays(TODAY, 2),
    time: '10:00',
    petName: 'Thor',
    serviceType: 'KeepHost',
    petOwner: 'Carlos Souza',
    completed: false,
  },
  {
    id: '6',
    date: addDays(TODAY, 2),
    time: '15:00',
    petName: 'Nina',
    serviceType: 'KeepSitter',
    petOwner: 'Juliana Lima',
    completed: false,
  },
  {
    id: '7',
    date: addDays(TODAY, 5),
    time: '11:00',
    petName: 'Bob',
    serviceType: 'KeepWalk',
    petOwner: 'Roberto Alves',
    completed: false,
  },
];

// ─── Service Visual Config ────────────────────────────────────────────────────

const SERVICE_CONFIG: Record<
  ServiceType,
  { bg: string; text: string; border: string; icon: string }
> = {
  KeepWalk: {
    bg: '#EEF2FF',
    text: '#4338CA',
    border: '#C7D2FE',
    icon: '🚶',
  },
  KeepHost: {
    bg: '#F5F3FF',
    text: '#6D28D9',
    border: '#DDD6FE',
    icon: '🏠',
  },
  KeepSitter: {
    bg: '#FDF2F8',
    text: '#BE185D',
    border: '#FBCFE8',
    icon: '👀',
  },
};

const WEEK_DAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

// ─── Calendar Component ───────────────────────────────────────────────────────

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markedDates: Date[];
}

function Calendar({ selectedDate, onSelectDate, markedDates }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState<Date>(new Date(TODAY));

  const { days, leadingBlanks } = useMemo(() => {
    const start = startOfMonth(viewMonth);
    const end = endOfMonth(viewMonth);
    const allDays = eachDayOfInterval({ start, end });
    // getDay returns 0 (Sun) – 6 (Sat)
    const blanks = getDay(start);
    return { days: allDays, leadingBlanks: blanks };
  }, [viewMonth]);

  const cells: (Date | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...days,
  ];

  const hasAppointment = (day: Date) =>
    markedDates.some((d) => isSameDay(d, day));

  const monthLabel = format(viewMonth, 'MMMM yyyy', { locale: ptBR });

  return (
    <View>
      {/* Month navigation */}
      <View style={calStyles.header}>
        <Pressable
          onPress={() => setViewMonth((m) => subMonths(m, 1))}
          hitSlop={12}
          style={calStyles.navBtn}
        >
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </Pressable>
        <Text style={calStyles.monthLabel}>
          {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
        </Text>
        <Pressable
          onPress={() => setViewMonth((m) => addMonths(m, 1))}
          hitSlop={12}
          style={calStyles.navBtn}
        >
          <Ionicons name="chevron-forward" size={20} color="#374151" />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View style={calStyles.weekRow}>
        {WEEK_DAYS.map((d) => (
          <Text key={d} style={calStyles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={calStyles.grid}>
        {cells.map((day, idx) => {
          if (!day) return <View key={`blank-${idx}`} style={calStyles.cell} />;

          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, TODAY);
          const isCurrentMonth = isSameMonth(day, viewMonth);
          const marked = hasAppointment(day);

          return (
            <Pressable
              key={day.toISOString()}
              style={[calStyles.cell]}
              onPress={() => onSelectDate(day)}
            >
              <View
                style={[
                  calStyles.dayCircle,
                  isSelected && calStyles.daySelected,
                ]}
              >
                <Text
                  style={[
                    calStyles.dayText,
                    isToday && !isSelected && calStyles.dayToday,
                    isSelected && calStyles.dayTextSelected,
                    !isCurrentMonth && calStyles.dayMuted,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </View>
              {marked && !isSelected && <View style={calStyles.dot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const calStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 16,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 140,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: '#6366F1',
  },
  dayText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '400',
  },
  dayToday: {
    color: '#6366F1',
    fontWeight: '700',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayMuted: {
    color: '#D1D5DB',
  },
  dot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
});

// ─── Appointment Card ─────────────────────────────────────────────────────────

function AppointmentCard({ apt }: { apt: Appointment }) {
  const cfg = SERVICE_CONFIG[apt.serviceType];
  return (
    <View
      style={[
        aptStyles.card,
        apt.completed ? aptStyles.cardCompleted : aptStyles.cardPending,
      ]}
    >
      <View style={aptStyles.cardHeader}>
        <View style={aptStyles.petInfo}>
          <View style={aptStyles.avatarBox}>
            <Text style={aptStyles.avatarEmoji}>🐾</Text>
          </View>
          <View>
            <Text style={aptStyles.petName}>{apt.petName}</Text>
            <Text style={aptStyles.ownerName}>{apt.petOwner}</Text>
          </View>
        </View>
        {apt.completed && (
          <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
        )}
      </View>

      <View style={aptStyles.tags}>
        <View style={aptStyles.timeTag}>
          <Text style={aptStyles.timeTagText}>🕐 {apt.time}</Text>
        </View>
        <View
          style={[
            aptStyles.serviceTag,
            { backgroundColor: cfg.bg, borderColor: cfg.border },
          ]}
        >
          <Text style={[aptStyles.serviceTagText, { color: cfg.text }]}>
            {cfg.icon} {apt.serviceType}
          </Text>
        </View>
      </View>
    </View>
  );
}

const aptStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  cardPending: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  petName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  ownerName: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timeTagText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  serviceTagText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PetsitterDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const carouselRef = useRef<ScrollView>(null);

  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);

  // Stats
  const todayAppointments = MOCK_APPOINTMENTS.filter((a) =>
    isSameDay(a.date, TODAY),
  );
  const completedToday = todayAppointments.filter((a) => a.completed).length;
  const totalToday = todayAppointments.length;
  const totalClients = 20;
  const averageRating = 4.9;

  // Appointment dots for calendar
  const appointmentDates = MOCK_APPOINTMENTS.map((a) => a.date);

  // Appointments for selected day, sorted by time
  const selectedAppointments = MOCK_APPOINTMENTS.filter((a) =>
    isSameDay(a.date, selectedDate),
  ).sort((a, b) => a.time.localeCompare(b.time));

  const CARD_WIDTH = width - 48; // 24px padding each side

  const selectedDateLabel = format(
    selectedDate,
    "EEEE, dd 'de' MMMM",
    { locale: ptBR },
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
              }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View>
              <Text style={styles.greetingName}>Olá, Marina!</Text>
              <Text style={styles.greetingSub}>
                Você possui{' '}
                <Text style={styles.greetingHighlight}>{totalToday} pets</Text>{' '}
                para cuidar hoje
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.replace('/login')} hitSlop={8}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          {/* ── Availability Toggle ── */}
          <View style={styles.card}>
            <View style={styles.availRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.availTitle}>Status de Disponibilidade</Text>
                <Text style={styles.availSub}>
                  {isAvailable
                    ? 'Você está disponível para novos agendamentos'
                    : 'Você não está aceitando novos agendamentos'}
                </Text>
              </View>
              <View style={styles.availToggle}>
                <Text
                  style={[
                    styles.availStatus,
                    { color: isAvailable ? '#16A34A' : '#9CA3AF' },
                  ]}
                >
                  {isAvailable ? 'Online' : 'Offline'}
                </Text>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>
          </View>

          {/* ── Stats Carousel ── */}
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
          >
            {/* Card 1 — Atendimentos Hoje */}
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.statCard, { width: CARD_WIDTH }]}
            >
              <View style={styles.statCardInner}>
                <View>
                  <Text style={styles.statLabel}>Atendimentos Hoje</Text>
                  <Text style={styles.statValue}>
                    {completedToday}/{totalToday}
                  </Text>
                  <Text style={styles.statSub}>concluídos</Text>
                </View>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={52}
                  color="rgba(199,210,254,0.7)"
                />
              </View>
            </LinearGradient>

            {/* Card 2 — Total de Clientes */}
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.statCard, { width: CARD_WIDTH }]}
            >
              <View style={styles.statCardInner}>
                <View>
                  <Text style={styles.statLabel}>Total de Clientes</Text>
                  <Text style={styles.statValue}>{totalClients}</Text>
                  <Text style={styles.statSub}>pets atendidos</Text>
                </View>
                <Ionicons
                  name="people-outline"
                  size={52}
                  color="rgba(221,214,254,0.7)"
                />
              </View>
            </LinearGradient>

            {/* Card 3 — Nota Média */}
            <LinearGradient
              colors={['#EC4899', '#DB2777']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.statCard, { width: CARD_WIDTH }]}
            >
              <View style={styles.statCardInner}>
                <View>
                  <Text style={styles.statLabel}>Sua Nota Média</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.statValue}>{averageRating}</Text>
                    <View style={styles.starsRow}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Ionicons
                          key={i}
                          name={
                            i < Math.floor(averageRating) ? 'star' : 'star-outline'
                          }
                          size={14}
                          color={
                            i < Math.floor(averageRating)
                              ? '#FDE68A'
                              : 'rgba(251,207,232,0.7)'
                          }
                          style={styles.starIcon}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.statSub}>excelente!</Text>
                </View>
                <Ionicons
                  name="star"
                  size={52}
                  color="rgba(251,207,232,0.7)"
                />
              </View>
            </LinearGradient>
          </ScrollView>

          {/* ── Calendar ── */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>Calendário</Text>
            </View>
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              markedDates={appointmentDates}
            />
          </View>

          {/* ── Appointments ── */}
          <View style={styles.card}>
            <View style={styles.appointmentsHead}>
              <View>
                <Text style={styles.sectionTitle}>Compromissos</Text>
                <Text style={styles.appointmentsDate}>
                  {selectedDateLabel.charAt(0).toUpperCase() +
                    selectedDateLabel.slice(1)}
                </Text>
              </View>
              {selectedAppointments.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {selectedAppointments.length}{' '}
                    {selectedAppointments.length === 1
                      ? 'compromisso'
                      : 'compromissos'}
                  </Text>
                </View>
              )}
            </View>

            {selectedAppointments.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🐕</Text>
                <Text style={styles.emptyText}>
                  Nenhum compromisso neste dia
                </Text>
              </View>
            ) : (
              selectedAppointments.map((apt) => (
                <AppointmentCard key={apt.id} apt={apt} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#EEF2FF',
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  greetingSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  greetingHighlight: {
    fontWeight: '700',
    color: '#6366F1',
  },
  logoutText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },

  // Generic card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // Availability
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  availTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  availSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  availToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availStatus: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats carousel
  carousel: {},
  carouselContent: {
    gap: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 20,
    height: 130,
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  statCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    marginBottom: 2,
  },
  starIcon: {
    marginBottom: 1,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  // Appointments header
  appointmentsHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  appointmentsDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  countBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338CA',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
