import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModerationQueue = () => {
  const [activeTab, setActiveTab] = useState('flagged');

  const flaggedContent = [
    {
      id: 1,
      type: 'question',
      title: 'How to hack into systems?',
      author: 'SuspiciousUser',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
      reportedBy: 'CommunityMember',
      reason: 'Inappropriate content',
      timestamp: '2025-07-12T03:20:00',
      reports: 5,
      content: `I need to know how to gain unauthorized access to computer systems for educational purposes. Can someone guide me through the process?`,
      severity: 'high'
    },
    {
      id: 2,
      type: 'answer',
      title: 'Re: Best React practices',
      author: 'SpamBot123',
      authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face',
      reportedBy: 'ModeratorAlert',
      reason: 'Spam content',
      timestamp: '2025-07-12T03:15:00',
      reports: 3,
      content: `Check out this amazing deal! Get 90% off on coding courses. Visit our website now and use code SPAM123 for extra discount!`,
      severity: 'medium'
    },
    {
      id: 3,
      type: 'comment',
      title: 'Re: JavaScript fundamentals',
      author: 'AngryDeveloper',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      reportedBy: 'CommunityHelper',
      reason: 'Harassment',
      timestamp: '2025-07-12T03:10:00',
      reports: 2,
      content: `You're completely wrong and obviously don't know what you're talking about. Stop giving advice when you're clearly incompetent.`,
      severity: 'high'
    }
  ];

  const userReports = [
    {
      id: 1,
      user: 'TrollAccount',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      reportedBy: 'MultipleUsers',
      reason: 'Multiple violations',
      violations: ['Spam', 'Harassment', 'Off-topic'],
      joinDate: '2025-07-10',
      totalPosts: 15,
      reports: 8,
      severity: 'high'
    },
    {
      id: 2,
      user: 'NewSpammer',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      reportedBy: 'AutoModerator',
      reason: 'Suspicious activity',
      violations: ['Spam', 'Self-promotion'],
      joinDate: '2025-07-12',
      totalPosts: 25,
      reports: 4,
      severity: 'medium'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'question': return 'MessageSquare';
      case 'answer': return 'MessageCircle';
      case 'comment': return 'MessageSquare';
      default: return 'Flag';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleApprove = (id, type) => {
    console.log(`Approving ${type} with id:`, id);
  };

  const handleReject = (id, type) => {
    console.log(`Rejecting ${type} with id:`, id);
  };

  const handleBanUser = (userId) => {
    console.log('Banning user:', userId);
  };

  const tabs = [
    { id: 'flagged', label: 'Flagged Content', count: flaggedContent.length },
    { id: 'users', label: 'User Reports', count: userReports.length }
  ];

  return (
    <div className="bg-card border rounded-lg">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Moderation Queue</h3>
        
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'flagged' && (
          <div className="space-y-4 p-6">
            {flaggedContent.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-success opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No flagged content</h3>
                <p className="text-sm text-muted-foreground">All content has been reviewed</p>
              </div>
            ) : (
              flaggedContent.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/25 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Icon name={getTypeIcon(item.type)} size={16} className="text-muted-foreground mt-1" />
                      <div>
                        <h4 className="font-medium text-card-foreground">{item.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <img
                            src={item.authorAvatar}
                            alt={item.author}
                            className="w-5 h-5 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/images/no_image.png';
                            }}
                          />
                          <span className="text-sm text-muted-foreground">by {item.author}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                      {item.severity} priority
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Flag" size={14} className="text-destructive" />
                        <span>{item.reports} reports</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="User" size={14} />
                        <span>Reported by {item.reportedBy}</span>
                      </div>
                      <span>Reason: {item.reason}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(item.id, 'content')}
                        iconName="Check"
                        iconSize={14}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(item.id, 'content')}
                        iconName="X"
                        iconSize={14}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4 p-6">
            {userReports.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="UserCheck" size={48} className="mx-auto mb-4 text-success opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No user reports</h3>
                <p className="text-sm text-muted-foreground">All users are in good standing</p>
              </div>
            ) : (
              userReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/25 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={report.userAvatar}
                        alt={report.user}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                      <div>
                        <h4 className="font-medium text-card-foreground">{report.user}</h4>
                        <p className="text-sm text-muted-foreground">Joined {new Date(report.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                      {report.severity} risk
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold text-card-foreground">{report.totalPosts}</p>
                      <p className="text-xs text-muted-foreground">Total Posts</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold text-destructive">{report.reports}</p>
                      <p className="text-xs text-muted-foreground">Reports</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-semibold text-warning">{report.violations.length}</p>
                      <p className="text-xs text-muted-foreground">Violations</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-card-foreground mb-2">Violations:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.violations.map((violation, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-destructive/10 text-destructive">
                          {violation}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span>Reported by {report.reportedBy} • Reason: {report.reason}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(report.id, 'user')}
                        iconName="UserCheck"
                        iconSize={14}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBanUser(report.id)}
                        iconName="UserX"
                        iconSize={14}
                      >
                        Ban User
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationQueue;