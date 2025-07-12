import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ActivityTable = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activities = [
    {
      id: 1,
      type: 'question',
      action: 'created',
      user: 'John Developer',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      content: 'How to implement React hooks effectively?',
      timestamp: '2025-07-12T03:25:00',
      status: 'active',
      votes: 12,
      reports: 0
    },
    {
      id: 2,
      type: 'answer',
      action: 'created',
      user: 'Sarah Expert',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      content: 'You should start with useState and useEffect...',
      timestamp: '2025-07-12T03:20:00',
      status: 'flagged',
      votes: 8,
      reports: 2
    },
    {
      id: 3,
      type: 'user',
      action: 'registered',
      user: 'Mike Learner',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      content: 'New user registration',
      timestamp: '2025-07-12T03:15:00',
      status: 'active',
      votes: 0,
      reports: 0
    },
    {
      id: 4,
      type: 'comment',
      action: 'created',
      user: 'Alex Reviewer',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      content: 'Great explanation! Could you add more examples?',
      timestamp: '2025-07-12T03:10:00',
      status: 'active',
      votes: 3,
      reports: 0
    },
    {
      id: 5,
      type: 'question',
      action: 'updated',
      user: 'Emma Coder',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      content: 'Best practices for state management in React',
      timestamp: '2025-07-12T03:05:00',
      status: 'active',
      votes: 15,
      reports: 0
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'question', label: 'Questions' },
    { value: 'answer', label: 'Answers' },
    { value: 'comment', label: 'Comments' },
    { value: 'user', label: 'User Actions' },
    { value: 'flagged', label: 'Flagged Content' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">Active</span>;
      case 'flagged':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">Flagged</span>;
      case 'banned':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">Banned</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Unknown</span>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'question': return 'MessageSquare';
      case 'answer': return 'MessageCircle';
      case 'comment': return 'MessageSquare';
      case 'user': return 'User';
      default: return 'Activity';
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

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(activities.map(activity => activity.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType || 
                       (filterType === 'flagged' && activity.status === 'flagged');
    const matchesSearch = activity.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-card border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Monitor platform activity and user actions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="search"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              placeholder="Filter by type"
              className="w-full sm:w-48"
            />
          </div>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Approve
                </Button>
                <Button variant="destructive" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === activities.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Type</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('user')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>User</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Content</th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Time</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity) => (
              <tr key={activity.id} className="border-t hover:bg-muted/25 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(activity.id)}
                    onChange={(e) => handleSelectItem(activity.id, e.target.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getTypeIcon(activity.type)} size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">{activity.type}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activity.userAvatar}
                      alt={activity.user}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                    <span className="text-sm font-medium">{activity.user}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {activity.content}
                  </p>
                  {activity.reports > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon name="Flag" size={12} className="text-destructive" />
                      <span className="text-xs text-destructive">{activity.reports} reports</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(activity.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Eye" iconSize={14}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal" iconSize={14} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredActivities.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Activity" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No activities found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || filterType !== 'all' ?'Try adjusting your search or filter criteria' :'Recent platform activity will appear here'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityTable;