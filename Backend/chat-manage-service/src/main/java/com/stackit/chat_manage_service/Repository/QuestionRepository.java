package com.stackit.chat_manage_service.Repository;

import com.stackit.chat_manage_service.Entity.Question;
import com.stackit.chat_manage_service.Entity.Tag;
import com.stackit.chat_manage_service.Entity.User;
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
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.tags LEFT JOIN FETCH q.user WHERE q.isActive = true ORDER BY q.createdAt DESC")
    Page<Question> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<Question> findByIsActiveTrueAndIsClosedFalseOrderByCreatedAtDesc(Pageable pageable);

    Page<Question> findByUser(User user, Pageable pageable);

    Page<Question> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title, Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.isActive = true AND " +
            "(LOWER(q.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(q.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Question> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT q FROM Question q JOIN q.tags t WHERE t IN :tags AND q.isActive = true")
    Page<Question> findByTags(@Param("tags") List<Tag> tags, Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.isActive = true AND q.acceptedAnswerId IS NOT NULL")
    Page<Question> findAnsweredQuestions(Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.isActive = true AND q.acceptedAnswerId IS NULL")
    Page<Question> findUnansweredQuestions(Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.isActive = true ORDER BY q.viewCount DESC")
    Page<Question> findMostViewedQuestions(Pageable pageable);

    @Query("SELECT q FROM Question q LEFT JOIN q.answers a WHERE q.isActive = true " +
            "GROUP BY q.id ORDER BY COUNT(a) DESC")
    Page<Question> findMostAnsweredQuestions(Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.isActive = true AND q.createdAt >= :since")
    Page<Question> findRecentQuestions(@Param("since") LocalDateTime since, Pageable pageable);

    @Modifying
    @Query("UPDATE Question q SET q.viewCount = q.viewCount + 1 WHERE q.id = :questionId")
    void incrementViewCount(@Param("questionId") Long questionId);

    @Modifying
    @Query("UPDATE Question q SET q.acceptedAnswerId = :answerId WHERE q.id = :questionId")
    void updateAcceptedAnswer(@Param("questionId") Long questionId, @Param("answerId") Long answerId);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.user = :user AND q.isActive = true")
    long countByUser(@Param("user") User user);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.isActive = true AND q.createdAt >= :since")
    long countRecentQuestions(@Param("since") LocalDateTime since);
}