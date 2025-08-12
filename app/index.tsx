import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import SplashScreen from '../components/SplashScreen';

export default function Index() {
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  

  useEffect(() => {
    // Wait a bit for the navigation to be ready
    const timer = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSplashFinish = () => {
    console.log('Splash screen finished, redirecting to login...');
    if (isNavigationReady) {
      router.replace('/login');
    }
  };

  // Show splash screen while navigation is getting ready
  return <SplashScreen onFinish={handleSplashFinish} />;
}