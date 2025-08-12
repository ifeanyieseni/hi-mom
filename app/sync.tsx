import { router } from 'expo-router'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  Database,
  Download,
  RefreshCw,
  Upload,
} from 'lucide-react-native'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SyncScreen() {
  const [syncing, setSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState('2 hours ago')
  const [syncStats, setSyncStats] = useState({
    patientsToUpload: 5,
    visitsToUpload: 8,
    updatesToDownload: 3,
  })

  const handleSync = () => {
    setSyncing(true)

    // Simulate sync process
    setTimeout(() => {
      setSyncing(false)
      setLastSynced('Just now')
      setSyncStats({
        patientsToUpload: 0,
        visitsToUpload: 0,
        updatesToDownload: 0,
      })
    }, 3000)
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white px-6 py-6 shadow-sm'>
        <View className='flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-4'>
            <ArrowLeft size={24} color='#052871' />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-900'>Sync Data</Text>
        </View>
      </View>

      <ScrollView className='flex-1 px-6 py-6'>
        <View className='space-y-6'>
          {/* Sync Status */}
          <View className='bg-white rounded-xl p-5 shadow-sm'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-lg font-semibold text-gray-800'>
                Sync Status
              </Text>
              <View className='bg-green-100 px-3 py-1 rounded-full flex-row items-center'>
                <Check size={14} color='#22C55E' />
                <Text className='text-xs font-semibold text-green-700 ml-1'>
                  ONLINE
                </Text>
              </View>
            </View>

            <View className='mt-4 flex-row items-center'>
              <Clock size={16} color='#6B7280' />
              <Text className='text-gray-600 ml-2'>
                Last synced: {lastSynced}
              </Text>
            </View>
          </View>

          {/* Sync Data */}
          <View className='bg-white rounded-xl p-5 shadow-sm'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>
              Data to Sync
            </Text>

            <View className='space-y-3'>
              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center'>
                  <Upload size={16} color='#052871' />
                  <Text className='text-gray-700 ml-2'>Patients to upload</Text>
                </View>
                <Text className='text-gray-900 font-medium'>
                  {syncStats.patientsToUpload}
                </Text>
              </View>

              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center'>
                  <Upload size={16} color='#052871' />
                  <Text className='text-gray-700 ml-2'>Visits to upload</Text>
                </View>
                <Text className='text-gray-900 font-medium'>
                  {syncStats.visitsToUpload}
                </Text>
              </View>

              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center'>
                  <Download size={16} color='#052871' />
                  <Text className='text-gray-700 ml-2'>
                    Updates to download
                  </Text>
                </View>
                <Text className='text-gray-900 font-medium'>
                  {syncStats.updatesToDownload}
                </Text>
              </View>
            </View>
          </View>

          {/* Storage */}
          <View className='bg-white rounded-xl p-5 shadow-sm'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>
              Local Storage
            </Text>

            <View className='space-y-3'>
              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center'>
                  <Database size={16} color='#6B7280' />
                  <Text className='text-gray-700 ml-2'>Patients</Text>
                </View>
                <Text className='text-gray-900 font-medium'>42</Text>
              </View>

              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center'>
                  <Database size={16} color='#6B7280' />
                  <Text className='text-gray-700 ml-2'>Visits</Text>
                </View>
                <Text className='text-gray-900 font-medium'>156</Text>
              </View>

              <View className='flex-row justify-between items-center'>
                <View className='flex-row items-center'>
                  <Database size={16} color='#6B7280' />
                  <Text className='text-gray-700 ml-2'>Storage used</Text>
                </View>
                <Text className='text-gray-900 font-medium'>24 MB</Text>
              </View>
            </View>
          </View>

          {/* Warning */}
          {(syncStats.patientsToUpload > 0 || syncStats.visitsToUpload > 0) && (
            <View className='bg-warning-50 rounded-xl p-4 border border-yellow-200'>
              <View className='flex-row items-start'>
                <AlertCircle
                  size={18}
                  color='#F59E0B'
                  style={{ marginTop: 1 }}
                />
                <Text className='text-yellow-800 ml-2 flex-1'>
                  You have unsynchronized data. Please sync to ensure all
                  patient information is backed up.
                </Text>
              </View>
            </View>
          )}

          {/* Sync Button */}
          <TouchableOpacity
            onPress={handleSync}
            disabled={syncing}
            className={`py-4 rounded-xl mt-6 flex-row justify-center items-center ${syncing ? 'bg-gray-400' : 'bg-primary-500'}`}
          >
            <RefreshCw
              size={20}
              color='white'
              className={syncing ? 'animate-spin' : ''}
            />
            <Text className='text-white font-semibold text-lg ml-2'>
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export async function syncPatients() {
  // Simulate upload/download logic
  // 1. Get local patients from store
  // 2. Upload unsynced patients to server (API call)
  // 3. Download new/updated patients from server (API call)
  // 4. Update local store with new data
  // Replace this with real API logic as needed
  return new Promise((resolve) => setTimeout(resolve, 2000))
}
