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
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    console.log('Login:', data);
    router.replace('/(tabs)');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    router.replace('/(tabs)');
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
              <Text style={styles.title}>Entrar</Text>
              <Text style={styles.subtitle}>Acesse a sua conta PetKeep</Text>
            </View>

            <View style={styles.card}>
              <Pressable
                onPress={handleGoogleLogin}
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
                  name="password"
                  rules={{
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter no mínimo 6 caracteres',
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

                <View style={styles.optionsRow}>
                  <View style={styles.rememberRow}>
                    <Pressable style={styles.checkbox}>
                      <Ionicons
                        name="square-outline"
                        size={20}
                        color="#6b7280"
                      />
                    </Pressable>
                    <Text style={styles.rememberText}>Lembrar de mim</Text>
                  </View>
                  <Pressable>
                    <Text style={styles.forgotLink}>Esqueci minha senha</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.submitButtonPressed,
                  ]}
                >
                  <Text style={styles.submitText}>Entrar</Text>
                </Pressable>

                <View style={styles.signupRow}>
                  <Text style={styles.signupText}>Não tem uma conta? </Text>
                  <Pressable onPress={() => router.push('/signup')}>
                    <Text style={styles.signupLink}>Cadastre-se</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
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
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    padding: 2,
  },
  rememberText: {
    fontSize: 14,
    color: '#6b7280',
  },
  forgotLink: {
    fontSize: 14,
    color: '#4f46e5',
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
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  signupText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signupLink: {
    fontSize: 14,
    color: '#4f46e5',
  },
});
