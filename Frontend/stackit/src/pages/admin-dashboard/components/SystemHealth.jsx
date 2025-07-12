import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemHealth = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    serverStatus: 'healthy',
    databaseStatus: 'healthy',
    apiResponseTime: 145,
    uptime: '99.98%',
    activeConnections: 1247,
    errorRate: 0.02,
    lastUpdated: new Date()
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Server memory usage is at 85%. Consider scaling resources.',
      timestamp: '2025-07-12T03:20:00',
      severity: 'medium',
      resolved: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Database Backup Completed',
      message: 'Daily database backup completed successfully.',
      timestamp: '2025-07-12T02:00:00',
      severity: 'low',
      resolved: true
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        apiResponseTime: Math.floor(Math.random() * 50) + 120,
        activeConnections: Math.floor(Math.random() * 200) + 1150,
        errorRate: Math.random() * 0.1,
        lastUpdated: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
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

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const healthChecks = [
    {
      name: 'Web Server',
      status: systemMetrics.serverStatus,
      description: 'Main application server'
    },
    {
      name: 'Database',
      status: systemMetrics.databaseStatus,
      description: 'Primary database connection'
    },
    {
      name: 'API Gateway',
      status: systemMetrics.apiResponseTime < 200 ? 'healthy' : 'warning',
      description: 'API response times'
    },
    {
      name: 'File Storage',
      status: 'healthy',
      description: 'Image and file uploads'
    },
    {
      name: 'Email Service',
      status: 'healthy',
      description: 'Notification emails'
    },
    {
      name: 'WebSocket',
      status: 'healthy',
      description: 'Real-time notifications'
    }
  ];

  const performanceMetrics = [
    {
      label: 'API Response Time',
      value: `${systemMetrics.apiResponseTime}ms`,
      status: systemMetrics.apiResponseTime < 200 ? 'good' : 'warning',
      icon: 'Zap'
    },
    {
      label: 'Uptime',
      value: systemMetrics.uptime,
      status: 'good',
      icon: 'Clock'
    },
    {
      label: 'Active Connections',
      value: systemMetrics.activeConnections.toLocaleString(),
      status: 'good',
      icon: 'Users'
    },
    {
      label: 'Error Rate',
      value: `${(systemMetrics.errorRate * 100).toFixed(2)}%`,
      status: systemMetrics.errorRate < 0.05 ? 'good' : 'warning',
      icon: 'AlertCircle'
    }
  ];

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">System Health</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="RefreshCw" size={14} />
            <span>Last updated: {systemMetrics.lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {healthChecks.map((check, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-muted/25 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-card-foreground">{check.name}</h4>
                <Icon 
                  name={getStatusIcon(check.status)} 
                  size={16} 
                  className={getStatusColor(check.status)} 
                />
              </div>
              <p className="text-sm text-muted-foreground">{check.description}</p>
              <div className="mt-2">
                <span className={`text-xs font-medium capitalize ${getStatusColor(check.status)}`}>
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
              <Icon 
                name={metric.icon} 
                size={24} 
                className={`mx-auto mb-2 ${metric.status === 'good' ? 'text-success' : 'text-warning'}`} 
              />
              <p className="text-lg font-semibold text-card-foreground">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-card border rounded-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
              <h3 className="text-lg font-semibold text-card-foreground">System Alerts</h3>
              {alerts.filter(alert => !alert.resolved).length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  {alerts.filter(alert => !alert.resolved).length} active
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" iconName="Settings" iconSize={14}>
              Configure Alerts
            </Button>
          </div>
        </div>

        <div className="divide-y">
          {alerts.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-success opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">All systems operational</h3>
              <p className="text-sm text-muted-foreground">No active alerts or issues detected</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-6 ${alert.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={getAlertIcon(alert.type)} 
                      size={20} 
                      className={`mt-0.5 ${getAlertColor(alert.type)}`} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-card-foreground">{alert.title}</h4>
                        {alert.resolved && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        iconName="Check"
                        iconSize={14}
                      >
                        Resolve
                      </Button>
                      <Button variant="ghost" size="sm" iconName="MoreHorizontal" iconSize={14} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" fullWidth iconName="RefreshCw" iconPosition="left" iconSize={16}>
            Restart Services
          </Button>
          <Button variant="outline" fullWidth iconName="Database" iconPosition="left" iconSize={16}>
            Backup Database
          </Button>
          <Button variant="outline" fullWidth iconName="Download" iconPosition="left" iconSize={16}>
            Export Logs
          </Button>
          <Button variant="outline" fullWidth iconName="Settings" iconPosition="left" iconSize={16}>
            System Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;