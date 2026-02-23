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
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { api, ApiError } from '@/services/api';

interface CustomerSignupForm {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export default function SignupCustomerScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<CustomerSignupForm>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: CustomerSignupForm) => {
    setIsLoading(true);
    try {
      await api.customers.signup(data);
      Alert.alert(
        'Conta criada!',
        'Seu cadastro foi realizado com sucesso. Faça login para continuar.',
        [{ text: 'Entrar', onPress: () => router.replace('/login') }]
      );
    } catch (err) {
      const apiErr = err as ApiError;
      let hasFieldError = false;

      const fieldMap: Record<string, keyof CustomerSignupForm> = {
        full_name: 'full_name',
        email: 'email',
        phone: 'phone',
        password: 'password',
        confirm_password: 'confirm_password',
      };

      for (const [key, field] of Object.entries(fieldMap)) {
        if (apiErr[key]) {
          const msgs = Array.isArray(apiErr[key]) ? apiErr[key] : [apiErr[key]];
          setError(field, { message: (msgs as string[]).join(' ') });
          hasFieldError = true;
        }
      }

      if (!hasFieldError) {
        const nonField = apiErr['non_field_errors'] ?? apiErr['detail'];
        const message = Array.isArray(nonField)
          ? (nonField as string[]).join(' ')
          : typeof nonField === 'string'
          ? nonField
          : 'Ocorreu um erro. Tente novamente.';
        Alert.alert('Erro', message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#e0e7ff', '#faf5ff', '#fce7f3']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#374151" />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>

          <View style={styles.centerWrapper}>
            <View style={styles.header}>
              <Text style={styles.title}>Criar Conta - Cliente</Text>
              <Text style={styles.subtitle}>
                Encontre o melhor cuidador para seu pet
              </Text>
            </View>

            <View style={styles.card}>
              <Pressable
                style={({ pressed }) => [
                  styles.googleButton,
                  pressed && styles.googleButtonPressed,
                ]}
              >
                <MaterialCommunityIcons name="google" size={22} color="#4285F4" />
                <Text style={styles.googleButtonText}>Continuar com Google</Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="full_name"
                  rules={{ required: 'Nome completo é obrigatório' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nome completo</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color="#9ca3af"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="João Silva"
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          style={[
                            styles.input,
                            styles.inputWithIcon,
                            errors.full_name && styles.inputError,
                          ]}
                        />
                      </View>
                      {errors.full_name && (
                        <Text style={styles.errorText}>
                          {errors.full_name.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: 'E-mail é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'E-mail inválido',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>E-mail</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="mail-outline"
                          size={20}
                          color="#9ca3af"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="seu@email.com"
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={[
                            styles.input,
                            styles.inputWithIcon,
                            errors.email && styles.inputError,
                          ]}
                        />
                      </View>
                      {errors.email && (
                        <Text style={styles.errorText}>
                          {errors.email.message}
                        </Text>
                      )}
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
                        <Ionicons
                          name="call-outline"
                          size={20}
                          color="#9ca3af"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="(11) 99999-9999"
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="phone-pad"
                          style={[
                            styles.input,
                            styles.inputWithIcon,
                            errors.phone && styles.inputError,
                          ]}
                        />
                      </View>
                      {errors.phone && (
                        <Text style={styles.errorText}>
                          {errors.phone.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 8,
                      message: 'Senha deve ter no mínimo 8 caracteres',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Senha</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color="#9ca3af"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="••••••••"
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          secureTextEntry={!showPassword}
                          style={[
                            styles.input,
                            styles.inputWithIcon,
                            styles.inputWithTrailing,
                            errors.password && styles.inputError,
                          ]}
                        />
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeButton}
                          hitSlop={12}
                        >
                          <Ionicons
                            name={
                              showPassword ? 'eye-off-outline' : 'eye-outline'
                            }
                            size={20}
                            color="#9ca3af"
                          />
                        </Pressable>
                      </View>
                      {errors.password && (
                        <Text style={styles.errorText}>
                          {errors.password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="confirm_password"
                  rules={{
                    required: 'Confirmação de senha é obrigatória',
                    validate: (v) =>
                      v === getValues('password') || 'As senhas não coincidem',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Confirmar senha</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color="#9ca3af"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          placeholder="••••••••"
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          secureTextEntry={!showConfirmPassword}
                          style={[
                            styles.input,
                            styles.inputWithIcon,
                            styles.inputWithTrailing,
                            errors.confirm_password && styles.inputError,
                          ]}
                        />
                        <Pressable
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={styles.eyeButton}
                          hitSlop={12}
                        >
                          <Ionicons
                            name={
                              showConfirmPassword
                                ? 'eye-off-outline'
                                : 'eye-outline'
                            }
                            size={20}
                            color="#9ca3af"
                          />
                        </Pressable>
                      </View>
                      {errors.confirm_password && (
                        <Text style={styles.errorText}>
                          {errors.confirm_password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.submitButtonPressed,
                    isLoading && styles.submitButtonDisabled,
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitText}>Criar Conta</Text>
                  )}
                </Pressable>

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
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    padding: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginBottom: 24,
  },
  googleButtonPressed: {
    backgroundColor: '#f9fafb',
    borderColor: '#9ca3af',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#fff',
  },
  form: {
    gap: 16,
    width: '100%',
  },
  inputGroup: {
    marginBottom: 4,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    paddingLeft: 44,
  },
  inputWithTrailing: {
    paddingRight: 44,
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#ef4444',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonPressed: {
    backgroundColor: '#4338ca',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
});
