import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';

type SplashScreenProps = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation value for the progress bar - use useRef to prevent recreation
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const hasFinished = useRef(false);
  
  // Ensure onFinish is only called once
  const handleFinish = () => {
    if (!hasFinished.current && onFinish) {
      hasFinished.current = true;
      console.log('SplashScreen: Calling onFinish');
      onFinish();
    }
  };
  
  useEffect(() => {
    console.log('SplashScreen: Starting animation...');
    
    // Set up a fallback timeout for web compatibility
    const fallbackTimeout = setTimeout(() => {
      console.log('SplashScreen: Fallback timeout triggered');
      handleFinish();
    }, 2500); // Slightly longer than animation duration
    
    // Start the loading animation
    Animated.timing(loadingAnim, {
      toValue: 1,
      duration: 2000, // 2 seconds to complete
      useNativeDriver: Platform.OS !== 'web', // Use native driver on mobile, not on web
    }).start((finished) => {
      console.log('SplashScreen: Animation completed, finished:', finished);
      clearTimeout(fallbackTimeout);
      if (finished) {
        handleFinish();
      }
    });
    
    // Cleanup timeout on unmount
    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, [loadingAnim, onFinish]);

  // Calculate the width of the loading bar based on animation value
  const width = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Logo circle with heart */}
      <View style={styles.logoContainer}>
        <Heart size={40} color="#2A8A8A" />
      </View>
      
      {/* App name and subtitle */}
      <Text style={styles.title}>HiMom</Text>
      <Text style={styles.subtitle}>Maternal Health Care</Text>
      
      {/* Loading bar container */}
      <View style={styles.loaderContainer}>
        <Animated.View 
          style={[styles.loader, { width }]} 
        />
      </View>
      
      {/* Footer text */}
      <Text style={styles.footerText}>Empowering Rural Healthcare</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A8A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 100,
  },
  loaderContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  loader: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  footerText: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
});