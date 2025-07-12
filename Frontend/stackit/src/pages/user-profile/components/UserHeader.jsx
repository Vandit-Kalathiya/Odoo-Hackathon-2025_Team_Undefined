import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { format } from 'date-fns'; // For date formatting
import axios from 'axios';

const UserHeader = ({ user, isOwnProfile, onEditProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [location, setLocation] = useState(user.location || 'Unknown'); // Fallback to user.location or 'Unknown'

  // Format today's date
  const todayDate = format(new Date(), 'MMMM yyyy'); // e.g., "July 2025"

  // Fetch user's current location using Geolocation API
  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          });

          const { latitude, longitude } = position.coords;

          // Reverse geocoding using OpenStreetMap's Nominatim API
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );

          const { address } = response.data;
          const city = address.city || address.town || address.village || '';
          const country = address.country || '';
          const formattedLocation = city && country ? `${city}, ${country}` : city || country || 'Unknown';

          setLocation(formattedLocation);
        } catch (error) {
          console.error('Error fetching location:', error);
          setLocation(user.location || 'Location unavailable'); // Fallback to user.location or default
        }
      } else {
        console.error('Geolocation is not supported by this browser.');
        setLocation(user.location || 'Location unavailable');
      }
    };

    fetchLocation();
  }, [user.location]); // Re-run if user.location changes

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const getReputationColor = (reputation) => {
    if (reputation >= 10000) return 'text-warning';
    if (reputation >= 5000) return 'text-success';
    if (reputation >= 1000) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
            alt={user.username}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-background shadow-lg"
          />
          {user.isOnline && (
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {user.username}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={16} />
                  <span>Joined {todayDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={16} />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  onClick={onEditProfile}
                  iconName="Edit"
                  iconPosition="left"
                  iconSize={16}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? 'outline' : 'default'}
                    onClick={handleFollowToggle}
                    iconName={isFollowing ? 'UserMinus' : 'UserPlus'}
                    iconPosition="left"
                    iconSize={16}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="MessageSquare"
                  />
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${getReputationColor(user.reputation)}`}>
                {user.reputationScore}
              </div>
              <div className="text-xs text-muted-foreground">Reputation</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {user.id}
              </div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {user.id}
              </div>
              <div className="text-xs text-muted-foreground">Answers</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {user.id}
              </div>
              <div className="text-xs text-muted-foreground">Accepted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;