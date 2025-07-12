// utils/backendHelpers.js - Helper functions for backend integration

/**
 * Transform backend Answer entity to frontend format
 */
export const transformAnswer = (answerData) => {
    if (!answerData) return null;

    return {
        id: answerData.id,
        content: answerData.content,
        author: {
            id: answerData.user?.id,
            name: answerData.user?.displayName || answerData.user?.username,
            username: answerData.user?.username,
            avatar: answerData.user?.avatarUrl || generateAvatarUrl(answerData.user?.displayName || answerData.user?.username),
            reputation: answerData.user?.reputationScore || 0,
            title: answerData.user?.role || 'Member',
            isOnline: true, // You might want to add this field to your backend
        },
        createdAt: answerData.createdAt,
        editedAt: answerData.editedAt,
        isEdited: !!answerData.editedAt,
        votes: answerData.score || 0,
        upvoteCount: answerData.upvoteCount || 0,
        downvoteCount: answerData.downvoteCount || 0,
        userVote: null, // You'll need to implement this based on current user's vote
        isAccepted: answerData.isAccepted || false,
        commentCount: 0, // Add when you implement comments
        comments: [], // Add when you implement comments
        questionId: answerData.question?.id,
        isActive: answerData.isActive !== false,
    };
};

/**
 * Transform backend Question entity to frontend format
 */
export const transformQuestion = (questionData) => {
    if (!questionData) return null;

    return {
        id: questionData.id,
        title: questionData.title,
        content: questionData.description,
        author: {
            id: questionData.user?.id,
            name: questionData.user?.displayName || questionData.user?.username,
            username: questionData.user?.username,
            avatar: questionData.user?.avatarUrl || generateAvatarUrl(questionData.user?.displayName || questionData.user?.username),
            reputation: questionData.user?.reputationScore || 0,
            title: questionData.user?.role || 'Member',
            isOnline: true,
        },
        createdAt: questionData.createdAt,
        lastActivity: questionData.updatedAt,
        views: questionData.viewCount || 0,
        votes: questionData.score || 0,
        answerCount: questionData.answerCount || 0,
        followers: 0, // Add this field to your backend if needed
        tags: questionData.tags ? questionData.tags.map(tag => typeof tag === 'string' ? tag : tag.name) : [],
        userVote: null, // Implement based on current user's vote
        isBookmarked: false, // Implement bookmark functionality
        isFollowing: false, // Implement follow functionality
        acceptedAnswerAt: questionData.acceptedAnswerId ? questionData.updatedAt : null,
        isClosed: questionData.isClosed || false,
        closeReason: questionData.closeReason,
        hasAcceptedAnswer: questionData.hasAcceptedAnswer || false,
        isActive: questionData.isActive !== false,
    };
};

/**
 * Transform backend User entity to frontend format
 */
export const transformUser = (userData) => {
    if (!userData) return null;

    return {
        id: userData.id,
        username: userData.username,
        displayName: userData.displayName,
        name: userData.displayName || userData.username, // For compatibility
        email: userData.email,
        avatarUrl: userData.avatarUrl || generateAvatarUrl(userData.displayName || userData.username),
        avatar: userData.avatarUrl || generateAvatarUrl(userData.displayName || userData.username), // For compatibility
        reputationScore: userData.reputationScore || 0,
        reputation: userData.reputationScore || 0, // For compatibility
        role: userData.role,
        title: userData.role, // For compatibility
        createdAt: userData.createdAt,
        isOnline: true, // Add this to your backend if needed
    };
};

/**
 * Generate avatar URL from name
 */
export const generateAvatarUrl = (name, size = 150) => {
    if (!name) return `https://ui-avatars.com/api/?name=U&background=6366f1&color=ffffff&size=${size}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff&size=${size}`;
};

/**
 * Safe getter for user name
 */
export const getUserName = (user) => {
    if (!user) return 'Anonymous';
    return user.displayName || user.name || user.username || 'Anonymous';
};

/**
 * Safe getter for user avatar
 */
export const getUserAvatar = (user, size = 150) => {
    if (!user) return generateAvatarUrl('Anonymous', size);
    if (user.avatar) return user.avatar;
    if (user.avatarUrl) return user.avatarUrl;
    return generateAvatarUrl(getUserName(user), size);
};

/**
 * Safe getter for user reputation
 */
export const getUserReputation = (user) => {
    if (!user) return 0;
    return user.reputation || user.reputationScore || 0;
};

/**
 * Safe getter for user title/role
 */
export const getUserTitle = (user) => {
    if (!user) return 'Member';
    return user.title || user.role || 'Member';
};

/**
 * Format date to relative time
 */
export const formatRelativeTime = (date) => {
    if (!date) return 'Unknown';

    const now = new Date();
    const posted = new Date(date);
    const diffInMinutes = Math.floor((now - posted) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;

    return posted.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Format absolute date
 */
export const formatAbsoluteDate = (date) => {
    if (!date) return 'Unknown';

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format numbers for display (1K, 1M, etc.)
 */
export const formatNumber = (num) => {
    if (!num || num === 0) return '0';

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
};

/**
 * Truncate text content
 */
export const truncateText = (text, maxLength = 500) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Prepare answer data for API submission
 */
export const prepareAnswerForSubmission = (content, questionId, userId) => {
    return {
        content: content.trim(),
        questionId: parseInt(questionId),
        userId: parseInt(userId),
    };
};

/**
 * Prepare question data for API submission
 */
export const prepareQuestionForSubmission = (title, description, tags, userId) => {
    return {
        title: title.trim(),
        description: description.trim(),
        tags: Array.isArray(tags) ? tags : [],
        userId: parseInt(userId),
    };
};

/**
 * Handle API errors gracefully
 */
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
    console.error('API Error:', error);

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return fallbackMessage;
};

/**
 * Sort answers based on criteria
 */
export const sortAnswers = (answers, sortBy) => {
    const sorted = [...answers];

    switch (sortBy) {
        case "votes":
            return sorted.sort((a, b) => {
                // Accepted answer always first
                if (a.isAccepted && !b.isAccepted) return -1;
                if (!a.isAccepted && b.isAccepted) return 1;
                // Then by votes
                return (b.votes || 0) - (a.votes || 0);
            });
        case "newest":
            return sorted.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        case "oldest":
            return sorted.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        case "activity":
            return sorted.sort((a, b) => {
                const aActivity = new Date(a.editedAt || a.createdAt);
                const bActivity = new Date(b.editedAt || b.createdAt);
                return bActivity - aActivity;
            });
        default:
            return sorted;
    }
};

/**
 * Check if user can perform action on content
 */
export const canUserEdit = (content, currentUser) => {
    if (!currentUser || !content) return false;
    return currentUser.id === content.author?.id || currentUser.role === 'ADMIN';
};

export const canUserDelete = (content, currentUser) => {
    if (!currentUser || !content) return false;
    return currentUser.id === content.author?.id || currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR';
};

export const canUserAcceptAnswer = (question, currentUser) => {
    if (!currentUser || !question) return false;
    return currentUser.id === question.author?.id;
};