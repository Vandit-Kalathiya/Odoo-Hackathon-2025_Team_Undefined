import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PlatformMessaging = () => {
  const [messageType, setMessageType] = useState('announcement');
  const [targetAudience, setTargetAudience] = useState('all');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [scheduledDate, setScheduledDate] = useState('');

  const messageTypeOptions = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'maintenance', label: 'Maintenance Notice' },
    { value: 'policy', label: 'Policy Update' },
    { value: 'feature', label: 'New Feature' },
    { value: 'warning', label: 'Warning' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active Users' },
    { value: 'new', label: 'New Users (Last 30 days)' },
    { value: 'moderators', label: 'Moderators Only' },
    { value: 'high_reputation', label: 'High Reputation Users (1000+)' },
    { value: 'flagged_users', label: 'Users with Recent Reports' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const recentMessages = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Scheduled Maintenance - July 15th',
      content: 'We will be performing scheduled maintenance on July 15th from 2:00 AM to 4:00 AM UTC. During this time, the platform may be temporarily unavailable.',
      audience: 'all',
      priority: 'high',
      sentAt: '2025-07-12T02:30:00',
      sentBy: 'System Admin',
      status: 'sent',
      recipients: 1250
    },
    {
      id: 2,
      type: 'policy',
      title: 'Updated Community Guidelines',
      content: 'We have updated our community guidelines to better reflect our commitment to creating a safe and inclusive environment for all users.',
      audience: 'all',
      priority: 'normal',
      sentAt: '2025-07-11T14:15:00',
      sentBy: 'Community Manager',
      status: 'sent',
      recipients: 1250
    },
    {
      id: 3,
      type: 'feature',
      title: 'New Rich Text Editor Features',
      content: 'We have added new formatting options to our rich text editor, including better code highlighting and improved image handling.',
      audience: 'active',
      priority: 'normal',
      sentAt: '2025-07-10T10:00:00',
      sentBy: 'Product Team',
      status: 'sent',
      recipients: 890
    }
  ];

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'announcement': return 'Megaphone';
      case 'maintenance': return 'Settings';
      case 'policy': return 'FileText';
      case 'feature': return 'Sparkles';
      case 'warning': return 'AlertTriangle';
      default: return 'MessageSquare';
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'announcement': return 'text-primary';
      case 'maintenance': return 'text-warning';
      case 'policy': return 'text-secondary';
      case 'feature': return 'text-success';
      case 'warning': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">Urgent</span>;
      case 'high':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">High</span>;
      case 'normal':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">Normal</span>;
      case 'low':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Low</span>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleSendMessage = () => {
    if (!messageTitle.trim() || !messageContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const newMessage = {
      type: messageType,
      title: messageTitle,
      content: messageContent,
      audience: targetAudience,
      priority: priority,
      scheduledDate: scheduledDate || null
    };

    console.log('Sending message:', newMessage);
    
    // Reset form
    setMessageTitle('');
    setMessageContent('');
    setScheduledDate('');
    
    alert('Message sent successfully!');
  };

  const getAudienceSize = (audience) => {
    switch (audience) {
      case 'all': return 1250;
      case 'active': return 890;
      case 'new': return 156;
      case 'moderators': return 12;
      case 'high_reputation': return 234;
      case 'flagged_users': return 45;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Composer */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Send" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Send Platform Message</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Message Type"
              options={messageTypeOptions}
              value={messageType}
              onChange={setMessageType}
              required
            />

            <Select
              label="Target Audience"
              description={`Estimated recipients: ${getAudienceSize(targetAudience)} users`}
              options={audienceOptions}
              value={targetAudience}
              onChange={setTargetAudience}
              required
            />

            <Select
              label="Priority Level"
              options={priorityOptions}
              value={priority}
              onChange={setPriority}
              required
            />

            <Input
              label="Schedule Send (Optional)"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              description="Leave empty to send immediately"
            />
          </div>

          <div className="space-y-4">
            <Input
              label="Message Title"
              type="text"
              placeholder="Enter message title..."
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message Content *
              </label>
              <textarea
                placeholder="Enter your message content..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {messageContent.length}/1000 characters
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button
                onClick={handleSendMessage}
                iconName="Send"
                iconPosition="left"
                iconSize={16}
                disabled={!messageTitle.trim() || !messageContent.trim()}
              >
                {scheduledDate ? 'Schedule Message' : 'Send Now'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setMessageTitle('');
                  setMessageContent('');
                  setScheduledDate('');
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-card border rounded-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="History" size={20} className="text-muted-foreground" />
              <h3 className="text-lg font-semibold text-card-foreground">Recent Messages</h3>
            </div>
            <Button variant="outline" size="sm" iconName="Download" iconSize={14}>
              Export History
            </Button>
          </div>
        </div>

        <div className="divide-y">
          {recentMessages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-muted/25 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getMessageTypeIcon(message.type)} 
                    size={20} 
                    className={getMessageTypeColor(message.type)} 
                  />
                  <div>
                    <h4 className="font-medium text-card-foreground">{message.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">by {message.sentBy}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{formatTimestamp(message.sentAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPriorityBadge(message.priority)}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    Sent
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {message.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} />
                    <span>{message.recipients} recipients</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Target" size={14} />
                    <span className="capitalize">{message.audience.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Eye" iconSize={14}>
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Copy" iconSize={14}>
                    Duplicate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentMessages.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No messages sent</h3>
            <p className="text-sm text-muted-foreground">
              Platform messages will appear here once sent
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformMessaging;