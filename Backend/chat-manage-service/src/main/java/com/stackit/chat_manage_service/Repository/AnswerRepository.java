package com.stackit.chat_manage_service.Repository;

import com.stackit.chat_manage_service.Auth.Entities.User;
import com.stackit.chat_manage_service.Entity.Answer;
import com.stackit.chat_manage_service.Entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByQuestionAndIsActiveTrueOrderByCreatedAtAsc(Question question);

    Page<Answer> findByQuestionAndIsActiveTrueOrderByCreatedAtAsc(Question question, Pageable pageable);

    Page<Answer> findByUser(User user, Pageable pageable);

    Optional<Answer> findByIdAndIsActiveTrue(Long id);

    @Query("SELECT a FROM Answer a WHERE a.question = :question AND a.isActive = true " +
            "ORDER BY a.isAccepted DESC, " +
            "(SELECT COUNT(v) FROM Vote v WHERE v.answer = a AND v.voteType = 'UPVOTE') , " +
            "(SELECT COUNT(v) FROM Vote v WHERE v.answer = a AND v.voteType = 'DOWNVOTE') DESC, " +
            "a.createdAt ASC")
    List<Answer> findByQuestionOrderedByScoreAndAcceptance(@Param("question") Question question);

    @Query("SELECT a FROM Answer a WHERE a.isActive = true AND a.isAccepted = true")
    Page<Answer> findAcceptedAnswers(Pageable pageable);

    @Query("SELECT a FROM Answer a WHERE a.isActive = true AND " +
            "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Answer> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT a FROM Answer a WHERE a.isActive = true AND a.createdAt >= :since")
    Page<Answer> findRecentAnswers(@Param("since") LocalDateTime since, Pageable pageable);

    @Query("SELECT a FROM Answer a LEFT JOIN a.votes v WHERE a.isActive = true " +
            "GROUP BY a.id ORDER BY " +
            "SUM(CASE WHEN v.voteType = 'UPVOTE' THEN 1 ELSE 0 END) - " +
            "SUM(CASE WHEN v.voteType = 'DOWNVOTE' THEN 1 ELSE 0 END) DESC")
    Page<Answer> findMostUpvotedAnswers(Pageable pageable);

    @Modifying
    @Query("UPDATE Answer a SET a.isAccepted = true WHERE a.id = :answerId")
    void acceptAnswer(@Param("answerId") Long answerId);

    @Modifying
    @Query("UPDATE Answer a SET a.isAccepted = false WHERE a.question = :question")
    void unacceptAllAnswersForQuestion(@Param("question") Question question);

    @Query("SELECT COUNT(a) FROM Answer a WHERE a.question = :question AND a.isActive = true")
    long countByQuestion(@Param("question") Question question);

    @Query("SELECT COUNT(a) FROM Answer a WHERE a.user = :user AND a.isActive = true")
    long countByUser(@Param("user") User user);

    @Query("SELECT COUNT(a) FROM Answer a WHERE a.isActive = true AND a.createdAt >= :since")
    long countRecentAnswers(@Param("since") LocalDateTime since);
}
