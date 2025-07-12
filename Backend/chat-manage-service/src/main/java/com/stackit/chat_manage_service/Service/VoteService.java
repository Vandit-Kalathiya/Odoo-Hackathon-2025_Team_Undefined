package com.stackit.chat_manage_service.Service;

import com.stackit.chat_manage_service.Entity.Answer;
import com.stackit.chat_manage_service.Auth.Entities.User;
import com.stackit.chat_manage_service.Entity.Vote;
import com.stackit.chat_manage_service.Entity.enums.VoteType;
import com.stackit.chat_manage_service.Payload.Request.VoteRequest;
import com.stackit.chat_manage_service.Repository.AnswerRepository;
import com.stackit.chat_manage_service.Auth.Repository.UserRepository;
import com.stackit.chat_manage_service.Repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VoteService {

    private final VoteRepository voteRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    public void voteOnAnswer(Long answerId, VoteRequest request) {
        log.info("Processing vote on answer: {}", answerId);

        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent users from voting on their own answers
        if (answer.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot vote on your own answer");
        }

        Optional<Vote> existingVote = voteRepository.findByUserAndAnswer(user, answer);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();

            if (vote.getVoteType() == request.getVoteType()) {
                // Remove vote if same type is clicked again
                voteRepository.delete(vote);
                log.info("Vote removed for answer: {}", answerId);
            } else {
                // Change vote type
                vote.setVoteType(request.getVoteType());
                voteRepository.save(vote);
                log.info("Vote changed for answer: {}", answerId);
            }
        } else {
            // Create new vote
            Vote newVote = Vote.builder()
                    .user(user)
                    .answer(answer)
                    .voteType(request.getVoteType())
                    .build();

            voteRepository.save(newVote);
            log.info("New vote created for answer: {}", answerId);
        }

        // Calculate new score
        int newScore = calculateAnswerScore(answer);

        // Send WebSocket notification about score change
        webSocketService.broadcastVoteChange(answerId, newScore);

        // Create notification for answer author (if not voting on own answer)
        if (!answer.getUser().getId().equals(user.getId())) {
            if (request.getVoteType() == VoteType.UPVOTE) {
                notificationService.createAnswerUpvotedNotification(answerId, user.getId());
            } else {
                notificationService.createAnswerDownvotedNotification(answerId, user.getId());
            }
        }
    }

    public void removeVote(Long answerId, Long userId) {
        log.info("Removing vote on answer: {} by user: {}", answerId, userId);

        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        voteRepository.findByUserAndAnswer(user, answer)
                .ifPresent(vote -> {
                    voteRepository.delete(vote);

                    // Calculate new score
                    int newScore = calculateAnswerScore(answer);

                    // Send WebSocket notification about score change
                    webSocketService.broadcastVoteChange(answerId, newScore);

                    log.info("Vote removed successfully");
                });
    }

    @Transactional(readOnly = true)
    public int getAnswerScore(Long answerId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        return calculateAnswerScore(answer);
    }

    @Transactional(readOnly = true)
    public VoteType getUserVoteForAnswer(Long answerId, Long userId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return voteRepository.findByUserAndAnswer(user, answer)
                .map(Vote::getVoteType)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public long getUpvoteCount(Long answerId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        return voteRepository.countUpvotesByAnswer(answer);
    }

    @Transactional(readOnly = true)
    public long getDownvoteCount(Long answerId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        return voteRepository.countDownvotesByAnswer(answer);
    }

    private int calculateAnswerScore(Answer answer) {
        Integer score = voteRepository.calculateScoreByAnswer(answer);
        return score != null ? score : 0;
    }
}
