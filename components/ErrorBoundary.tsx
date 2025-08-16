import React, { Component, ReactNode } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AlertTriangle, RefreshCw } from 'lucide-react-native'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View className='flex-1 items-center justify-center p-6 bg-gray-50'>
          <View className='bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-100 max-w-sm'>
            <View className='w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4'>
              <AlertTriangle size={32} color='#EF4444' />
            </View>
            <Text className='text-lg font-semibold text-gray-900 mb-2 text-center'>
              Something went wrong
            </Text>
            <Text className='text-sm text-gray-600 text-center mb-6'>
              We encountered an unexpected error. Please try again.
            </Text>
            <TouchableOpacity
              onPress={this.handleRetry}
              className='bg-primary-500 rounded-xl px-6 py-3 flex-row items-center'
            >
              <RefreshCw size={18} color='white' />
              <Text className='text-white font-semibold ml-2'>Try Again</Text>
            </TouchableOpacity>
            {__DEV__ && this.state.error && (
              <View className='mt-4 p-3 bg-gray-100 rounded-lg'>
                <Text className='text-xs text-gray-600 font-mono'>
                  {this.state.error.message}
                </Text>
              </View>
            )}
          </View>
        </View>
      )
    }

    return this.props.children
  }
}
