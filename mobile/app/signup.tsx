import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function SignupTypeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#e0e7ff', '#faf5ff', '#fce7f3']}
      style={styles.gradient}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#374151" />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Como deseja se cadastrar?</Text>
        <Text style={styles.subtitle}>Escolha o tipo de conta para continuar</Text>

        <View style={styles.options}>
          <Pressable
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={() => router.push('/signup-customer')}
          >
            <View style={[styles.iconContainer, styles.iconCustomer]}>
              <Ionicons name="person-outline" size={28} color="#4f46e5" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Cadastro de Cliente</Text>
              <Text style={styles.optionDesc}>Buscar cuidadores para meu pet</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={() => router.push('/signup-petsitter')}
          >
            <View style={[styles.iconContainer, styles.iconPetsitter]}>
              <MaterialCommunityIcons name="dog" size={28} color="#7c3aed" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Cadastro de Petsitter</Text>
              <Text style={styles.optionDesc}>Oferecer meus serviços</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: '#374151',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4f46e5',
    marginBottom: 40,
    textAlign: 'center',
  },
  options: {
    width: '100%',
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  optionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCustomer: {
    backgroundColor: '#ede9fe',
  },
  iconPetsitter: {
    backgroundColor: '#f3e8ff',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
});
