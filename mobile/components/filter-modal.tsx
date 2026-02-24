import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Brand } from '@/constants/theme';

// ─── Data ─────────────────────────────────────────────────────────────────────

const ANIMAL_TYPES = [
  { key: 'dog',     label: 'Cachorro', emoji: '🐶' },
  { key: 'cat',     label: 'Gato',     emoji: '🐱' },
  { key: 'bird',    label: 'Pássaro',  emoji: '🐦' },
  { key: 'rabbit',  label: 'Coelho',   emoji: '🐰' },
  { key: 'chicken', label: 'Galinha',  emoji: '🐓' },
  { key: 'hamster', label: 'Hamster',  emoji: '🐹' },
] as const;

const SERVICE_TYPES = [
  {
    key: 'keepsitter',
    label: 'KeepSitter',
    description: 'Visitas rápidas e cuidados diários',
  },
  {
    key: 'keephost',
    label: 'KeepHost',
    description: 'Hospedagem completa na casa do cuidador',
  },
  {
    key: 'keepwalk',
    label: 'KeepWalk',
    description: 'Passeios diários',
  },
] as const;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface FilterValues {
  animalTypes: string[];
  serviceTypes: string[];
}

interface Props {
  visible: boolean;
  initial: FilterValues;
  onApply: (filters: FilterValues) => void;
  onClose: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function FilterModal({ visible, initial, onApply, onClose }: Props) {
  const [animalTypes, setAnimalTypes] = useState<string[]>(initial.animalTypes);
  const [serviceTypes, setServiceTypes] = useState<string[]>(initial.serviceTypes);

  // Sync local state when modal opens with new initial values
  React.useEffect(() => {
    if (visible) {
      setAnimalTypes(initial.animalTypes);
      setServiceTypes(initial.serviceTypes);
    }
  }, [visible]);

  function toggle<T extends string>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  const handleClear = () => {
    setAnimalTypes([]);
    setServiceTypes([]);
  };

  const handleApply = () => {
    onApply({ animalTypes, serviceTypes });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filtros</Text>
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton}>
            <Ionicons name="close" size={22} color={Brand.text} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          {/* Animal Types */}
          <Text style={styles.sectionTitle}>Tipo de Animal</Text>
          <View style={styles.animalGrid}>
            {ANIMAL_TYPES.map((animal) => {
              const selected = animalTypes.includes(animal.key);
              return (
                <Pressable
                  key={animal.key}
                  onPress={() => setAnimalTypes(toggle(animalTypes, animal.key))}
                  style={[styles.animalCard, selected && styles.animalCardSelected]}
                >
                  <Text style={styles.animalEmoji}>{animal.emoji}</Text>
                  <Text style={[styles.animalLabel, selected && styles.animalLabelSelected]}>
                    {animal.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Service Types */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Modalidades de Serviço</Text>
          <View style={styles.serviceList}>
            {SERVICE_TYPES.map((service) => {
              const selected = serviceTypes.includes(service.key);
              return (
                <Pressable
                  key={service.key}
                  onPress={() => setServiceTypes(toggle(serviceTypes, service.key))}
                  style={[styles.serviceCard, selected && styles.serviceCardSelected]}
                >
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceLabel, selected && styles.serviceLabelSelected]}>
                      {service.label}
                    </Text>
                    <Text style={styles.serviceDesc}>{service.description}</Text>
                  </View>
                  {selected && (
                    <Ionicons name="checkmark-circle" size={20} color={Brand.primary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => [styles.clearButton, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.clearText}>Limpar</Text>
          </Pressable>
          <Pressable
            onPress={handleApply}
            style={({ pressed }) => [styles.applyButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.applyText}>Aplicar Filtros</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Brand.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Brand.text,
  },
  closeButton: {
    padding: 4,
  },
  body: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
    marginBottom: 12,
  },
  animalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  animalCard: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: Brand.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.white,
    gap: 4,
  },
  animalCardSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.surface,
  },
  animalEmoji: {
    fontSize: 28,
  },
  animalLabel: {
    fontSize: 12,
    color: Brand.textSecondary,
    fontWeight: '500',
  },
  animalLabelSelected: {
    color: Brand.primary,
    fontWeight: '600',
  },
  serviceList: {
    gap: 10,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Brand.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: Brand.white,
  },
  serviceCardSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.surface,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.text,
    marginBottom: 2,
  },
  serviceLabelSelected: {
    color: Brand.primary,
  },
  serviceDesc: {
    fontSize: 12,
    color: Brand.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  clearButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Brand.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
  },
  applyButton: {
    flex: 2,
    backgroundColor: Brand.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.white,
  },
});
