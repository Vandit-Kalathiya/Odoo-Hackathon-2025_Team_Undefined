import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RegistrationHeader from './components/RegistrationHeader';
import SocialRegistration from './components/SocialRegistration';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import SuccessMessage from './components/SuccessMessage';

const UserRegistration = () => {
  const { loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'signup' | 'success' | 'forgot-password'
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleFormSubmit = async (formData) => {
    setUserEmail(formData.email);
    setCurrentView('success');
  };

  const handleSocialRegistration = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful social registration
      const mockSocialEmail = `user@${provider}.com`;
      console.log(`Registering with ${provider}:`, mockSocialEmail);
      setUserEmail(mockSocialEmail);
      setCurrentView('success');
      
    } catch (error) {
      console.log('Social registration error:', error.message);
      alert(`${provider} registration failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    window.location.href = '/questions-dashboard';
  };

  const handleForgotPassword = () => {
    // For now, just show an alert. In a real app, this would show a forgot password form
    alert('Password reset functionality will be implemented soon. Please contact support for assistance.');
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RegistrationHeader />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          {currentView === 'login' && (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground">
                  Sign in to your StackIt account
                </p>
              </div>

              {/* Social Login */}
              {/* <SocialRegistration 
                onSocialRegister={handleSocialRegistration}
                isLoading={isLoading}
                mode="login"
              /> */}

              {/* Login Form */}
              <LoginForm 
                onSwitchToSignup={() => setCurrentView('signup')}
                onForgotPassword={handleForgotPassword}
              />
            </>
          )}

          {currentView === 'signup' && (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Join StackIt
                </h1>
                <p className="text-muted-foreground">
                  Create your account to start asking questions and sharing knowledge
                </p>
              </div>

              {/* Social Registration */}
              {/* <SocialRegistration 
                onSocialRegister={handleSocialRegistration}
                isLoading={isLoading}
                mode="signup"
              /> */}

              {/* Registration Form */}
              <RegistrationForm 
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                onSwitchToLogin={() => setCurrentView('login')}
              />

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  By creating an account, you agree to our community guidelines
                  and help us build a better Q&A platform for everyone.
                </p>
              </div>
            </>
          )}

          {currentView === 'success' && (
            <SuccessMessage 
              email={userEmail}
              onContinue={handleContinueToDashboard}
            />
          )}
        </div>
      </main>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default UserRegistration;