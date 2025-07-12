import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import SearchBar from './SearchBar';

const Header = () => {
  const location = useLocation();
  const { user, userProfile, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    {
      label: 'Questions',
      path: '/questions-dashboard',
      icon: 'MessageSquare',
      tooltip: 'Browse community questions'
    },
    {
      label: 'Ask',
      path: '/ask-question',
      icon: 'Plus',
      tooltip: 'Ask a new question'
    },
    {
      label: 'Profile',
      path: '/user-profile',
      icon: 'User',
      tooltip: 'Manage your profile',
      requiresAuth: true
    }
  ];

  const adminItems = [
    {
      label: 'Admin',
      path: '/admin-dashboard',
      icon: 'Settings',
      tooltip: 'Admin dashboard',
      requiredRole: 'admin'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const visibleNavItems = navigationItems.filter(item => 
    !item.requiresAuth || user
  );

  const visibleAdminItems = userProfile?.role === 'admin' ? adminItems : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/questions-dashboard')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icon name="Stack" size={20} />
            </div>
            <span className="text-xl font-semibold text-foreground">StackIt</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {visibleNavItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="h-9"
            >
              {item.label}
            </Button>
          ))}
          {visibleAdminItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="h-9"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          <SearchBar />
          {user && !loading && <NotificationBell />}
          {!loading && (
            user ? (
              <UserMenu user={userProfile || user} />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/user-registration')}
              >
                Sign In
              </Button>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          {user && !loading && <NotificationBell />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-9 w-9"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-3">
            <SearchBar />
            
            <nav className="space-y-2">
              {visibleNavItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  fullWidth
                  onClick={() => handleNavigation(item.path)}
                  iconName={item.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="justify-start h-10"
                >
                  {item.label}
                </Button>
              ))}
              {visibleAdminItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  fullWidth
                  onClick={() => handleNavigation(item.path)}
                  iconName={item.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="justify-start h-10"
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            {!loading && (
              user ? (
                <div className="pt-3 border-t">
                  <UserMenu user={userProfile || user} isMobile />
                </div>
              ) : (
                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleNavigation('/user-registration')}
                  >
                    Sign In
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button for Ask Question */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          variant="default"
          size="lg"
          onClick={() => handleNavigation('/ask-question')}
          iconName="Plus"
          iconSize={20}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        />
      </div>
    </header>
  );
};

export default Header;