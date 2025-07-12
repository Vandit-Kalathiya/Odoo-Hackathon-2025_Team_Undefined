package com.stackit.chat_manage_service.Entity.enums;

public enum NotificationType {
    QUESTION_ANSWERED("Someone answered your question"),
    ANSWER_COMMENTED("Someone commented on your answer"),
    USER_MENTIONED("You were mentioned in a post"),
    ANSWER_ACCEPTED("Your answer was accepted"),
    QUESTION_UPVOTED("Your question was upvoted"),
    ANSWER_UPVOTED("Your answer was upvoted"),
    QUESTION_DOWNVOTED("Your question was downvoted"),
    ANSWER_DOWNVOTED("Your answer was downvoted");

    private final String defaultMessage;

    NotificationType(String defaultMessage) {
        this.defaultMessage = defaultMessage;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
