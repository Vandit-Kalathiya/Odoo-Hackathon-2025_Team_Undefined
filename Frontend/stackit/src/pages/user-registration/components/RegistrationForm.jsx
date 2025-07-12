import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading: externalLoading, onSwitchToLogin }) => {
  const { signUp, authError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        full_name: formData.fullName.trim(),
        username: formData.username.trim(),
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result?.success) {
        // Call the external onSubmit handler if provided
        if (onSubmit) {
          await onSubmit(formData);
        } else {
          // Default behavior - redirect to dashboard
          window.location.href = '/questions-dashboard';
        }
      }
    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !formData.fullName || !formData.username || !formData.email || 
                          !formData.password || !formData.confirmPassword || !formData.agreedToTerms;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          error={errors.fullName}
          disabled={isLoading || externalLoading}
          icon="User"
        />

        <Input
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          error={errors.username}
          disabled={isLoading || externalLoading}
          icon="AtSign"
        />
      </div>

      <Input
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        disabled={isLoading || externalLoading}
        icon="Mail"
      />

      <Input
        type="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={errors.password}
        disabled={isLoading || externalLoading}
        icon="Lock"
      />

      <Input
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        disabled={isLoading || externalLoading}
        icon="Lock"
      />

      <div className="space-y-2">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
            disabled={isLoading || externalLoading}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="text-sm text-destructive">{errors.agreedToTerms}</p>
        )}
      </div>

      {(authError || errors.submit) && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">
              {authError || errors.submit}
            </p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        loading={isLoading || externalLoading}
        disabled={isSubmitDisabled}
        iconName="UserPlus"
        iconPosition="left"
        iconSize={16}
      >
        Create Account
      </Button>

      {onSwitchToLogin && (
        <div className="text-center text-sm text-muted-foreground">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Sign in
          </button>
        </div>
      )}
    </form>
  );
};

export default RegistrationForm;