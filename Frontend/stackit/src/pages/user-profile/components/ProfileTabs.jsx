import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileTabs = ({ activeTab, onTabChange, questionCount, answerCount, activityCount }) => {
  const tabs = [
    {
      id: 'questions',
      label: 'Questions',
      icon: 'MessageSquare',
      count: questionCount
    },
    {
      id: 'answers',
      label: 'Answers',
      icon: 'MessageCircle',
      count: answerCount
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Notification',
      count: activityCount
    },
    {
      id: 'badges',
      label: 'Badges',
      icon: 'Award',
      count: null
    }
  ];

  return (
    <div className="border-b bg-background sticky top-16 z-40">
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => onTabChange(tab.id)}
            className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <div className="flex items-center space-x-2">
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id 
                    ? 'bg-primary-foreground text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab.count}
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;