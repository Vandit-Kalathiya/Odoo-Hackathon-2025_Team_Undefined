import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialRegistration = ({ onSocialRegister, isLoading }) => {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      color: 'text-gray-900',
      bgColor: 'hover:bg-gray-50'
    }
  ];

  const handleSocialClick = (provider) => {
    if (onSocialRegister) {
      onSocialRegister(provider);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <span className="text-sm text-muted-foreground bg-background px-4">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            size="default"
            fullWidth
            onClick={() => handleSocialClick(provider.id)}
            disabled={isLoading}
            className={`${provider.bgColor} transition-colors duration-200`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon 
                name={provider.icon} 
                size={18} 
                className={provider.color}
              />
              <span className="text-sm font-medium">
                {provider.name}
              </span>
            </div>
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialRegistration;