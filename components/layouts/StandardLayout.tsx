import React from 'react'
import { ScrollView, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface StandardLayoutProps {
  children: React.ReactNode
  hasHeader?: boolean
  headerComponent?: React.ReactNode
  scrollable?: boolean
  backgroundColor?: string
  contentPadding?: boolean
  style?: ViewStyle
}

export default function StandardLayout({
  children,
  hasHeader = false,
  headerComponent,
  scrollable = true,
  backgroundColor = 'bg-gray-50',
  contentPadding = true,
  style,
}: StandardLayoutProps) {
  const contentClassName = `flex-1 ${backgroundColor}`
  const paddingClassName = contentPadding ? 'px-4 py-4' : ''

  const ContentWrapper = scrollable ? ScrollView : View
  const contentWrapperProps = scrollable
    ? {
        className: `flex-1 ${paddingClassName}`,
        showsVerticalScrollIndicator: false,
        contentContainerStyle: { flexGrow: 1 },
      }
    : {
        className: `flex-1 ${paddingClassName}`,
      }

  return (
    <SafeAreaView className={contentClassName} style={style}>
      {/* Custom Header */}
      {hasHeader && headerComponent && (
        <View className='bg-white shadow-sm'>{headerComponent}</View>
      )}

      {/* Content Area */}
      <ContentWrapper {...contentWrapperProps}>{children}</ContentWrapper>
    </SafeAreaView>
  )
}

// Specialized layout variants
export function ScreenWithHeader({
  children,
  headerComponent,
  ...props
}: Omit<StandardLayoutProps, 'hasHeader'>) {
  return (
    <StandardLayout
      hasHeader={true}
      headerComponent={headerComponent}
      {...props}
    >
      {children}
    </StandardLayout>
  )
}

export function TabScreen({
  children,
  ...props
}: Omit<StandardLayoutProps, 'hasHeader'>) {
  return (
    <StandardLayout hasHeader={false} {...props}>
      {children}
    </StandardLayout>
  )
}

export function ModalScreen({
  children,
  headerComponent,
  ...props
}: StandardLayoutProps) {
  return (
    <StandardLayout
      hasHeader={!!headerComponent}
      headerComponent={headerComponent}
      backgroundColor='bg-white'
      {...props}
    >
      {children}
    </StandardLayout>
  )
}
