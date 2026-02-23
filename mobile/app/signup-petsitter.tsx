import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { api, ApiError } from '@/services/api';

const ANIMAL_OPTIONS = [
  { key: 'dog', label: 'Cachorro', icon: 'dog' as const },
  { key: 'cat', label: 'Gato', icon: 'cat' as const },
  { key: 'bird', label: 'Pássaro', icon: 'bird' as const },
  { key: 'rabbit', label: 'Coelho', icon: 'rabbit' as const },
  { key: 'hamster', label: 'Hamster', icon: 'rodent' as const },
  { key: 'chicken', label: 'Galinha', icon: 'bird' as const },
  { key: 'other', label: 'Outros', icon: 'paw' as const },
];

const SERVICE_OPTIONS = [
  { key: 'keepsitter', label: 'KeepSitter', desc: 'Cuida do pet na sua casa' },
  { key: 'keephost', label: 'KeepHost', desc: 'Hospeda o pet na sua casa' },
  { key: 'keepwalk', label: 'KeepWalk', desc: 'Passeio com o pet' },
];

interface PetSitterForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  location: string;
  about: string;
  other_animals: string;
}

export default function SignupPetSitterScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [animalError, setAnimalError] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    trigger,
    formState: { errors },
  } = useForm<PetSitterForm>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      location: '',
      about: '',
      other_animals: '',
    },
  });

  const toggleAnimal = (key: string) => {
    setAnimalError('');
    setSelectedAnimals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleService = (key: string) => {
    setServiceError('');
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const goToStep2 = async () => {
    const valid = await trigger(['full_name', 'email', 'phone', 'password', 'confirm_password']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: PetSitterForm) => {
    setAnimalError('');
    setServiceError('');
    setSubmitError('');

    let hasLocalError = false;
    if (selectedAnimals.length === 0) {
      setAnimalError('Selecione ao menos um tipo de animal.');
      hasLocalError = true;
    }
    if (selectedServices.length === 0) {
      setServiceError('Selecione ao menos um serviço.');
      hasLocalError = true;
    }
    if (selectedAnimals.includes('other') && !data.other_animals.trim()) {
      setError('other_animals', { message: 'Especifique os outros animais.' });
      hasLocalError = true;
    }
    if (hasLocalError) return;

    setIsLoading(true);
    try {
      await api.petsitters.signup({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirm_password: data.confirm_password,
        location: data.location,
        about: data.about,
        animal_types: selectedAnimals,
        service_types: selectedServices,
        other_animals: data.other_animals || undefined,
      });
      router.replace({ pathname: '/login', params: { success: 'petsitter' } });
    } catch (err) {
      const apiErr = err as ApiError;
      let hasFieldError = false;
      const fieldMap: Record<string, keyof PetSitterForm> = {
        full_name: 'full_name',
        email: 'email',
        phone: 'phone',
        password: 'password',
        confirm_password: 'confirm_password',
        location: 'location',
        about: 'about',
        other_animals: 'other_animals',
      };
      for (const [key, field] of Object.entries(fieldMap)) {
        if (apiErr[key]) {
          const msgs = Array.isArray(apiErr[key]) ? apiErr[key] : [apiErr[key]];
          setError(field, { message: (msgs as string[]).join(' ') });
          hasFieldError = true;
          if (['full_name', 'email', 'phone', 'password', 'confirm_password'].includes(key)) {
            setStep(1);
          }
        }
      }
      if (!hasFieldError) {
        const nonField = apiErr['non_field_errors'] ?? apiErr['detail'];
        const message = Array.isArray(nonField)
          ? (nonField as string[]).join(' ')
          : typeof nonField === 'string'
          ? nonField
          : 'Ocorreu um erro. Tente novamente.';
        setSubmitError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e0e7ff', '#faf5ff', '#fce7f3']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => (step === 2 ? setStep(1) : router.back())} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#374151" />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>

          <View style={styles.centerWrapper}>
            <View style={styles.header}>
              <Text style={styles.title}>Cadastro de PetSitter</Text>
              <Text style={styles.subtitle}>Ofereça seus serviços para pets</Text>
            </View>

            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, step >= 1 && styles.stepDotTextActive]}>1</Text>
              </View>
              <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
              <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, step >= 2 && styles.stepDotTextActive]}>2</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={[styles.form, step !== 1 && styles.hidden]}>
                  <Text style={styles.stepTitle}>Dados pessoais</Text>

                  <Controller
                    control={control}
                    name="full_name"
                    rules={{ required: 'Nome completo é obrigatório' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome completo</Text>
                        <View style={styles.inputWrapper}>
                          <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                          <TextInput
                            placeholder="João Silva"
                            placeholderTextColor="#9ca3af"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            autoCapitalize="words"
                            style={[styles.input, styles.inputWithIcon, errors.full_name && styles.inputError]}
                          />
                        </View>
                        {errors.full_name && <Text style={styles.errorText}>{errors.full_name.message}</Text>}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      required: 'E-mail é obrigatório',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'E-mail inválido' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail</Text>
                        <View style={styles.inputWrapper}>
                          <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                          <TextInput
                            placeholder="seu@email.com"
                            placeholderTextColor="#9ca3af"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={[styles.input, styles.inputWithIcon, errors.email && styles.inputError]}
                          />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="phone"
                    rules={{ required: 'Telefone é obrigatório' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telefone</Text>
                        <View style={styles.inputWrapper}>
                          <Ionicons name="call-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                          <TextInput
                            placeholder="(11) 99999-9999"
                            placeholderTextColor="#9ca3af"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                            style={[styles.input, styles.inputWithIcon, errors.phone && styles.inputError]}
                          />
                        </View>
                        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    rules={{
                      required: 'Senha é obrigatória',
                      minLength: { value: 8, message: 'Mínimo de 8 caracteres' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <View style={styles.inputWrapper}>
                          <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                          <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#9ca3af"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={!showPassword}
                            style={[styles.input, styles.inputWithIcon, styles.inputWithTrailing, errors.password && styles.inputError]}
                          />
                          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton} hitSlop={12}>
                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9ca3af" />
                          </Pressable>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="confirm_password"
                    rules={{
                      required: 'Confirmação é obrigatória',
                      validate: (v) => v === getValues('password') || 'As senhas não coincidem',
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmar senha</Text>
                        <View style={styles.inputWrapper}>
                          <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                          <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#9ca3af"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={!showConfirmPassword}
                            style={[styles.input, styles.inputWithIcon, styles.inputWithTrailing, errors.confirm_password && styles.inputError]}
                          />
                          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton} hitSlop={12}>
                            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9ca3af" />
                          </Pressable>
                        </View>
                        {errors.confirm_password && <Text style={styles.errorText}>{errors.confirm_password.message}</Text>}
                      </View>
                    )}
                  />

                  <Pressable
                    onPress={goToStep2}
                    style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}
                  >
                    <Text style={styles.submitText}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </Pressable>
              </View>
              <View style={[styles.form, step !== 2 && styles.hidden]}>
                  <Text style={styles.stepTitle}>Perfil profissional</Text>

                  <Controller
                    control={control}
                    name="location"
                    rules={{ required: 'Localização é obrigatória' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Localização</Text>
                        <View style={styles.inputWrapper}>
                          <Ionicons name="location-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                          <TextInput
                            placeholder="Ex: São Paulo - SP"
                            placeholderTextColor="#9ca3af"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            style={[styles.input, styles.inputWithIcon, errors.location && styles.inputError]}
                          />
                        </View>
                        {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
                      </View>
                    )}
                  />

                  <Controller
                    control={control}
                    name="about"
                    rules={{ required: 'Descrição é obrigatória' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sobre você</Text>
                        <TextInput
                          placeholder="Conte sua experiência com animais..."
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          multiline
                          numberOfLines={4}
                          textAlignVertical="top"
                          style={[styles.textarea, errors.about && styles.inputError]}
                        />
                        {errors.about && <Text style={styles.errorText}>{errors.about.message}</Text>}
                      </View>
                    )}
                  />

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tipos de animais</Text>
                    <View style={styles.chipGrid}>
                      {ANIMAL_OPTIONS.map((opt) => (
                        <Pressable
                          key={opt.key}
                          onPress={() => toggleAnimal(opt.key)}
                          style={[styles.chip, selectedAnimals.includes(opt.key) && styles.chipSelected]}
                        >
                          <MaterialCommunityIcons
                            name={opt.icon}
                            size={16}
                            color={selectedAnimals.includes(opt.key) ? '#fff' : '#6b7280'}
                          />
                          <Text style={[styles.chipText, selectedAnimals.includes(opt.key) && styles.chipTextSelected]}>
                            {opt.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    {animalError ? <Text style={styles.errorText}>{animalError}</Text> : null}
                  </View>

                  {selectedAnimals.includes('other') && (
                    <Controller
                      control={control}
                      name="other_animals"
                      rules={{ required: 'Especifique os animais' }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputGroup}>
                          <Text style={styles.label}>Quais outros animais?</Text>
                          <TextInput
                            placeholder="Ex: Répteis, tartarugas..."
                            placeholderTextColor="#9ca3af"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            style={[styles.input, errors.other_animals && styles.inputError]}
                          />
                          {errors.other_animals && <Text style={styles.errorText}>{errors.other_animals.message}</Text>}
                        </View>
                      )}
                    />
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Serviços oferecidos</Text>
                    <View style={styles.serviceList}>
                      {SERVICE_OPTIONS.map((opt) => {
                        const active = selectedServices.includes(opt.key);
                        return (
                          <Pressable
                            key={opt.key}
                            onPress={() => toggleService(opt.key)}
                            style={[styles.serviceCard, active && styles.serviceCardActive]}
                          >
                            <View style={styles.serviceCardLeft}>
                              <View style={[styles.serviceCheckbox, active && styles.serviceCheckboxActive]}>
                                {active && <Ionicons name="checkmark" size={14} color="#fff" />}
                              </View>
                              <View>
                                <Text style={[styles.serviceCardTitle, active && styles.serviceCardTitleActive]}>
                                  {opt.label}
                                </Text>
                                <Text style={styles.serviceCardDesc}>{opt.desc}</Text>
                              </View>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                    {serviceError ? <Text style={[styles.errorText, { marginTop: 6 }]}>{serviceError}</Text> : null}
                  </View>

                  <Pressable
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed, isLoading && styles.submitButtonDisabled]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitText}>Criar Conta</Text>
                    )}
                  </Pressable>

                  {submitError ? (
                    <View style={styles.submitErrorBox}>
                      <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                      <Text style={styles.submitErrorText}>{submitError}</Text>
                    </View>
                  ) : null}

                  <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Já tem uma conta? </Text>
                    <Pressable onPress={() => router.push('/login')}>
                      <Text style={styles.loginLink}>Entrar</Text>
                    </Pressable>
                  </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  hidden: { display: 'none' },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 60 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  backText: { fontSize: 16, color: '#374151' },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: { alignItems: 'center', marginBottom: 20, width: '100%' },
  title: { fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center' },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  stepDot: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 2,
    borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff',
  },
  stepDotActive: { borderColor: '#7c3aed', backgroundColor: '#7c3aed' },
  stepDotText: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  stepDotTextActive: { color: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#d1d5db', marginHorizontal: 8 },
  stepLineActive: { backgroundColor: '#7c3aed' },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 8, padding: 24,
  },
  stepTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 20 },
  form: { gap: 16, width: '100%' },
  inputGroup: { marginBottom: 4, width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputWrapper: { position: 'relative', flexDirection: 'row', alignItems: 'center', width: '100%' },
  input: {
    flex: 1, height: 48, borderRadius: 12, borderWidth: 2,
    borderColor: '#e5e7eb', paddingHorizontal: 16, fontSize: 16,
    color: '#111827', backgroundColor: '#fff',
  },
  inputWithIcon: { paddingLeft: 44 },
  inputWithTrailing: { paddingRight: 44 },
  inputIcon: { position: 'absolute', left: 14, zIndex: 1 },
  eyeButton: { position: 'absolute', right: 12, padding: 4 },
  inputError: { borderColor: '#ef4444' },
  errorText: { marginTop: 6, fontSize: 13, color: '#ef4444' },
  textarea: {
    borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb',
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
    color: '#111827', backgroundColor: '#fff', minHeight: 100,
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    borderWidth: 2, borderColor: '#e5e7eb', backgroundColor: '#f9fafb',
  },
  chipSelected: { borderColor: '#7c3aed', backgroundColor: '#7c3aed' },
  chipText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  chipTextSelected: { color: '#fff' },
  serviceList: { gap: 10 },
  serviceCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  serviceCardActive: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  serviceCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceCheckbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center',
  },
  serviceCheckboxActive: { borderColor: '#7c3aed', backgroundColor: '#7c3aed' },
  serviceCardTitle: { fontSize: 15, fontWeight: '600', color: '#374151' },
  serviceCardTitleActive: { color: '#7c3aed' },
  serviceCardDesc: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  submitButton: {
    flexDirection: 'row', gap: 8, backgroundColor: '#7c3aed',
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', marginTop: 8,
  },
  submitButtonPressed: { backgroundColor: '#6d28d9' },
  submitButtonDisabled: { opacity: 0.7 },
  submitText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, flexWrap: 'wrap' },
  loginText: { fontSize: 14, color: '#6b7280' },
  loginLink: { fontSize: 14, color: '#7c3aed', fontWeight: '600' },
  submitErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  submitErrorText: { fontSize: 13, color: '#ef4444', flex: 1 },
});

