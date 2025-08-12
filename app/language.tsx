import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/settings';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
];

export default function LanguageScreen() {
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    router.push('/(tabs)');
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 py-12">
      <View className="items-center mb-12">
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Choose Your Language
        </Text>
        <Text className="text-lg text-gray-600">
          Select your preferred language
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <View className="grid grid-cols-2 gap-4">
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              onPress={() => handleLanguageSelect(language.code)}
              className="bg-white rounded-xl p-6 items-center shadow-sm border border-gray-200 active:bg-gray-50"
            >
              <Text className="text-4xl mb-3">{language.flag}</Text>
              <Text className="text-lg font-semibold text-gray-800">
                {language.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}