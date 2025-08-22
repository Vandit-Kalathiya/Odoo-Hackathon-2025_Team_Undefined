import React, { useState, useEffect, useRef, use } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';
import { useAuth } from 'contexts/AuthContext';

const UserMenu = ({ user, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {signOut} = useAuth();
  console.log(user)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (!isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile]);

  const menuItems = [
    {
      label: 'Profile',
      icon: 'User',
      path: '/user-profile',
      description: 'View and edit your profile'
    },
    {
      label: 'My Questions',
      icon: 'MessageSquare',
      path: '/questions-dashboard?filter=my-questions',
      description: 'Questions you\'ve asked'
    },
    {
      label: 'My Answers',
      icon: 'MessageCircle',
      path: '/questions-dashboard?filter=my-answers',
      description: 'Your answers and contributions'
    },
    {
      label: 'Bookmarks',
      icon: 'Bookmark',
      path: '/questions-dashboard?filter=bookmarks',
      description: 'Saved questions and answers'
    },
    {
      label: 'Settings',
      icon: 'Settings',
      path: '/user-profile?tab=settings',
      description: 'Account and preferences'
    }
  ];

  const adminMenuItems = user?.role === 'admin' ? [
    {
      label: 'Admin Dashboard',
      icon: 'Shield',
      path: '/admin-dashboard',
      description: 'Platform administration'
    }
  ] : [];

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    // Handle sign out logic here
    await signOut();
    setIsOpen(false);
  };

  const getUserInitials = (name) => {
    return name
      // .map(word => word.charAt(0))
      // .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {getUserInitials(user.name)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
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
          
          {adminMenuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              fullWidth
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="justify-start h-10 text-warning"
            >
              {item.label}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            fullWidth
            onClick={handleSignOut}
            iconName="LogOut"
            iconPosition="left"
            iconSize={16}
            className="justify-start h-10 text-destructive hover:text-destructive"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen((open) => !open)}
        className="h-9 px-2"
      >
        <div className="flex items-center space-x-2">
          <div className="relative">{user.name}</div>
          <Icon
            name="ChevronDown"
            size={14}
            className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {getUserInitials(user.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-popover-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <span className={`inline-flex items-center py-0.5 rounded text-xs font-medium mt-1 ${
                  user.role === "ADMIN"
                    ? "bg-warning/10 text-warning"
                    : "bg-muted/10 text-muted-foreground"
                }`}>
                  {user.role === "ADMIN" ? "Admin" : "User"}
                </span>
              </div>
            </div>
          </div>

          <div className="py-2">
            {[...menuItems, ...adminMenuItems].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors duration-150 flex items-center space-x-3 ${
                  item.icon === "Shield" ? "text-warning" : ""
                }`}
              >
                <Icon
                  name={item.icon}
                  size={16}
                  className={item.icon === "Shield" ? "text-warning" : "text-muted-foreground"}
                />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    item.icon === "Shield" ? "text-warning" : "text-popover-foreground"
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t py-2">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors duration-150 flex items-center space-x-3"
            >
              <Icon name="LogOut" size={16} className="text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Sign Out</p>
                <p className="text-xs text-muted-foreground">
                  End your session
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;