import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationHeader = () => {
  const handleSignInClick = () => {
    // Mock navigation to sign in page
    window.location.href = '/user-registration?mode=signin';
  };

  const handleLogoClick = () => {
    window.location.href = '/questions-dashboard';
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
                <div className="flex items-center space-x-">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation('/questions-dashboard')}
          >
            <img
              src="/public/logo.svg"
              alt="StackIt Logo"
              className="h-36"
            />
          </div>
        </div>

        {/* Sign In Link */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignInClick}
          className="text-sm"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </header>
  );
};

export default RegistrationHeader;