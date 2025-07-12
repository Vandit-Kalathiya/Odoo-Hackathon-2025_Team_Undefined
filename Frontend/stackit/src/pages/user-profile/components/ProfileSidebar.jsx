import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileSidebar = ({ user }) => {
  const topTags = [
    { name: 'react', count: 45, color: 'bg-blue-100 text-blue-800' },
    { name: 'javascript', count: 38, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'typescript', count: 25, color: 'bg-blue-100 text-blue-800' },
    { name: 'node.js', count: 18, color: 'bg-green-100 text-green-800' },
    { name: 'css', count: 15, color: 'bg-purple-100 text-purple-800' }
  ];

  const achievements = [
    { name: 'First Question', icon: 'MessageSquare', date: '2024-01-15' },
    { name: 'First Answer', icon: 'MessageCircle', date: '2024-01-16' },
    { name: 'Good Question', icon: 'ThumbsUp', date: '2024-02-01' },
    { name: 'Helpful', icon: 'Heart', date: '2024-02-15' }
  ];

  const contributionData = [
    { month: 'Jan', questions: 5, answers: 12 },
    { month: 'Feb', questions: 8, answers: 15 },
    { month: 'Mar', questions: 6, answers: 18 },
    { month: 'Apr', questions: 10, answers: 22 },
    { month: 'May', questions: 7, answers: 16 },
    { month: 'Jun', questions: 9, answers: 20 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Tags */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Tag" size={18} />
          <span>Top Tags</span>
        </h3>
        <div className="space-y-3">
          {topTags.map((tag, index) => (
            <div key={tag.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">#{index + 1}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${tag.color}`}>
                  {tag.name}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{tag.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Award" size={18} />
          <span>Recent Achievements</span>
        </h3>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div key={achievement.name} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-warning/10 text-warning rounded-full flex items-center justify-center">
                <Icon name={achievement.icon} size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(achievement.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={18} />
          <span>6 Month Activity</span>
        </h3>
        <div className="space-y-4">
          {contributionData.map((data) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{data.month}</span>
                <span className="text-foreground">{data.questions + data.answers}</span>
              </div>
              <div className="flex space-x-1">
                <div 
                  className="bg-primary h-2 rounded-sm"
                  style={{ width: `${(data.questions / 25) * 100}%` }}
                />
                <div 
                  className="bg-success h-2 rounded-sm"
                  style={{ width: `${(data.answers / 25) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-sm"></div>
              <span>Questions</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-sm"></div>
              <span>Answers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(user.website || user.twitter || user.github || user.linkedin) && (
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Link" size={18} />
            <span>Links</span>
          </h3>
          <div className="space-y-3">
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <Icon name="Globe" size={16} />
                <span>Website</span>
              </a>
            )}
            {user.twitter && (
              <a
                href={`https://twitter.com/${user.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <Icon name="Twitter" size={16} />
                <span>@{user.twitter}</span>
              </a>
            )}
            {user.github && (
              <a
                href={`https://github.com/${user.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <Icon name="Github" size={16} />
                <span>{user.github}</span>
              </a>
            )}
            {user.linkedin && (
              <a
                href={`https://linkedin.com/in/${user.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <Icon name="Linkedin" size={16} />
                <span>{user.linkedin}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;