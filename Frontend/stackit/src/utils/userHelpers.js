// userHelpers.js - Helper functions to handle different user object structures

export const getUserName = (user) => {
    if (!user) return 'Unknown User';
    return user.name || user.displayName || user.username || 'Unknown User';
};

export const getUserAvatar = (user) => {
    if (!user) return null;

    const avatar = user.avatar || user.avatarUrl;
    if (avatar) return avatar;

    // Generate a placeholder avatar with initials
    const name = getUserName(user);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff&size=150`;
};

export const getUserReputation = (user) => {
    if (!user) return 0;
    return user.reputation || user.reputationScore || 0;
};

export const getUserTitle = (user) => {
    if (!user) return 'Member';
    return user.title || user.role || 'Member';
};

export const getUserUsername = (user) => {
    if (!user) return null;
    return user.username;
};

export const isUserOnline = (user) => {
    if (!user) return false;
    return user.isOnline || false;
};

// Transform question object to ensure compatibility
export const transformQuestionForDisplay = (questionData) => {
    if (!questionData) return null;

    return {
        id: questionData.id,
        title: questionData.title,
        content: questionData.description || questionData.content,
        author: {
            id: questionData.user?.id || questionData.author?.id,
            name: getUserName(questionData.user || questionData.author),
            username: getUserUsername(questionData.user || questionData.author),
            avatar: getUserAvatar(questionData.user || questionData.author),
            avatarUrl: getUserAvatar(questionData.user || questionData.author),
            reputation: getUserReputation(questionData.user || questionData.author),
            reputationScore: getUserReputation(questionData.user || questionData.author),
            title: getUserTitle(questionData.user || questionData.author),
            role: getUserTitle(questionData.user || questionData.author),
            isOnline: isUserOnline(questionData.user || questionData.author),
        },
        createdAt: questionData.createdAt,
        lastActivity: questionData.updatedAt || questionData.lastActivity,
        views: questionData.viewCount || questionData.views || 0,
        votes: questionData.score || questionData.votes || 0,
        answerCount: questionData.answerCount || 0,
        followers: questionData.followers || 0,
        tags: questionData.tags ? questionData.tags.map(tag => typeof tag === 'string' ? tag : tag.name) : [],
        userVote: questionData.userVote || null,
        isBookmarked: questionData.isBookmarked || false,
        isFollowing: questionData.isFollowing || false,
        acceptedAnswerAt: questionData.acceptedAnswerId ? questionData.updatedAt : null,
        isClosed: questionData.isClosed || false,
        closeReason: questionData.closeReason || null,
        hasAcceptedAnswer: questionData.hasAcceptedAnswer || false,
        isActive: questionData.isActive !== false, // Default to true unless explicitly false
    };
};

// Transform answer object to ensure compatibility
export const transformAnswerForDisplay = (answerData, currentUser) => {
    if (!answerData) return null;

    return {
        id: answerData.id,
        content: answerData.content || answerData.description,
        author: {
            id: answerData.user?.id || answerData.author?.id,
            name: getUserName(answerData.user || answerData.author),
            username: getUserUsername(answerData.user || answerData.author),
            avatar: getUserAvatar(answerData.user || answerData.author),
            avatarUrl: getUserAvatar(answerData.user || answerData.author),
            reputation: getUserReputation(answerData.user || answerData.author),
            reputationScore: getUserReputation(answerData.user || answerData.author),
            title: getUserTitle(answerData.user || answerData.author),
            role: getUserTitle(answerData.user || answerData.author),
            isOnline: isUserOnline(answerData.user || answerData.author),
        },
        createdAt: answerData.createdAt,
        editedAt: answerData.updatedAt && answerData.updatedAt !== answerData.createdAt ? answerData.updatedAt : null,
        isEdited: answerData.updatedAt && answerData.updatedAt !== answerData.createdAt,
        votes: answerData.score || answerData.votes || 0,
        userVote: answerData.userVote || null,
        isAccepted: answerData.isAccepted || false,
        commentCount: answerData.commentCount || 0,
        comments: answerData.comments || [],
    };
};

// Transform user object for current user
export const transformCurrentUser = (userData) => {
    if (!userData) return null;

    return {
        id: userData.id,
        username: userData.username,
        displayName: userData.displayName || userData.name,
        name: userData.name || userData.displayName, // For compatibility
        email: userData.email,
        avatarUrl: getUserAvatar(userData),
        avatar: getUserAvatar(userData), // For compatibility
        reputationScore: getUserReputation(userData),
        reputation: getUserReputation(userData), // For compatibility
        role: userData.role,
        title: getUserTitle(userData), // For compatibility
    };
};