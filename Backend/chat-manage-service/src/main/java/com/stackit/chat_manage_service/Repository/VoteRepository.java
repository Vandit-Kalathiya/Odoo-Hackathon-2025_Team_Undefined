package com.stackit.chat_manage_service.Repository;

import com.stackit.chat_manage_service.Entity.Answer;
import com.stackit.chat_manage_service.Entity.User;
import com.stackit.chat_manage_service.Entity.Vote;
import com.stackit.chat_manage_service.Entity.enums.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    Optional<Vote> findByUserAndAnswer(User user, Answer answer);

    List<Vote> findByAnswer(Answer answer);

    List<Vote> findByUser(User user);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.answer = :answer AND v.voteType = :voteType")
    long countByAnswerAndVoteType(@Param("answer") Answer answer, @Param("voteType") VoteType voteType);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.answer = :answer AND v.voteType = 'UPVOTE'")
    long countUpvotesByAnswer(@Param("answer") Answer answer);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.answer = :answer AND v.voteType = 'DOWNVOTE'")
    long countDownvotesByAnswer(@Param("answer") Answer answer);

    @Query("SELECT " +
            "SUM(CASE WHEN v.voteType = 'UPVOTE' THEN 1 ELSE 0 END) - " +
            "SUM(CASE WHEN v.voteType = 'DOWNVOTE' THEN 1 ELSE 0 END) " +
            "FROM Vote v WHERE v.answer = :answer")
    Integer calculateScoreByAnswer(@Param("answer") Answer answer);

    @Query("SELECT v FROM Vote v WHERE v.user = :user AND v.answer IN " +
            "(SELECT a FROM Answer a WHERE a.question.id = :questionId)")
    List<Vote> findByUserAndQuestionId(@Param("user") User user, @Param("questionId") Long questionId);

    boolean existsByUserAndAnswer(User user, Answer answer);

    void deleteByUserAndAnswer(User user, Answer answer);
}
