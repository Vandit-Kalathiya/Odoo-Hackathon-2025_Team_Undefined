import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Developer',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'user',
      status: 'active',
      joinDate: '2025-01-15',
      lastActive: '2025-07-12T03:25:00',
      reputation: 1250,
      questions: 15,
      answers: 42,
      reports: 0
    },
    {
      id: 2,
      name: 'Sarah Expert',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-11-20',
      lastActive: '2025-07-12T03:20:00',
      reputation: 3450,
      questions: 8,
      answers: 156,
      reports: 0
    },
    {
      id: 3,
      name: 'Mike Learner',
      email: 'mike@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'user',
      status: 'active',
      joinDate: '2025-07-12',
      lastActive: '2025-07-12T03:15:00',
      reputation: 50,
      questions: 2,
      answers: 1,
      reports: 0
    },
    {
      id: 4,
      name: 'Spam Account',
      email: 'spam@fake.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
      role: 'user',
      status: 'banned',
      joinDate: '2025-07-10',
      lastActive: '2025-07-11T15:30:00',
      reputation: -25,
      questions: 5,
      answers: 12,
      reports: 8
    },
    {
      id: 5,
      name: 'Emma Coder',
      email: 'emma@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      role: 'user',
      status: 'suspended',
      joinDate: '2025-03-08',
      lastActive: '2025-07-10T12:45:00',
      reputation: 890,
      questions: 12,
      answers: 28,
      reports: 2
    }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'user', label: 'User' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' }
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">Admin</span>;
      case 'moderator':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">Moderator</span>;
      case 'user':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">User</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Unknown</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">Active</span>;
      case 'suspended':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">Suspended</span>;
      case 'banned':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">Banned</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Unknown</span>;
    }
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const handleRoleChange = (userId, newRole) => {
    console.log(`Changing role for user ${userId} to ${newRole}`);
  };

  const handleStatusChange = (userId, newStatus) => {
    console.log(`Changing status for user ${userId} to ${newStatus}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-card border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">User Management</h3>
            <p className="text-sm text-muted-foreground">Manage user roles, permissions, and account status</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Filter by role"
              className="w-full sm:w-40"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">User</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Activity</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Stats</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Last Active</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted/25 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                    <div>
                      <p className="font-medium text-card-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getRoleBadge(user.role)}
                </td>
                <td className="p-4">
                  {getStatusBadge(user.status)}
                  {user.reports > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon name="Flag" size={12} className="text-destructive" />
                      <span className="text-xs text-destructive">{user.reports} reports</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 mb-1">
                      <Icon name="Star" size={12} className="text-warning" />
                      <span className="font-medium">{user.reputation}</span>
                      <span className="text-muted-foreground">reputation</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageSquare" size={12} className="text-primary" />
                      <span>{user.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={12} className="text-success" />
                      <span>{user.answers} answers</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatLastActive(user.lastActive)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {user.status === 'banned' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, 'active')}
                        iconName="UserCheck"
                        iconSize={14}
                      >
                        Unban
                      </Button>
                    ) : user.status === 'suspended' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, 'active')}
                        iconName="UserCheck"
                        iconSize={14}
                      >
                        Unsuspend
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          iconName="UserMinus"
                          iconSize={14}
                        >
                          Suspend
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'banned')}
                          iconName="UserX"
                          iconSize={14}
                        >
                          Ban
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No users found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' ?'Try adjusting your search or filter criteria' :'No users to display'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;