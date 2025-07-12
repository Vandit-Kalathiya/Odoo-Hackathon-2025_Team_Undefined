package com.stackit.chat_manage_service.Repository;

import com.stackit.chat_manage_service.Entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByName(String name);

    List<Tag> findByNameContainingIgnoreCase(String name);

    Page<Tag> findByIsActiveTrueOrderByUsageCountDesc(Pageable pageable);

    Page<Tag> findByIsActiveTrueOrderByNameAsc(Pageable pageable);

    @Query("SELECT t FROM Tag t WHERE t.isActive = true AND " +
            "LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Tag> findByKeyword(@Param("keyword") String keyword);

    @Query("SELECT t FROM Tag t WHERE t.isActive = true ORDER BY t.usageCount DESC")
    List<Tag> findMostUsedTags(Pageable pageable);

    @Query("SELECT t FROM Tag t WHERE t.isActive = true AND t.usageCount > 0 ORDER BY t.usageCount DESC")
    List<Tag> findActiveTags();

    @Modifying
    @Query("UPDATE Tag t SET t.usageCount = t.usageCount + 1 WHERE t.id = :tagId")
    void incrementUsageCount(@Param("tagId") Long tagId);

    @Modifying
    @Query("UPDATE Tag t SET t.usageCount = t.usageCount - 1 WHERE t.id = :tagId AND t.usageCount > 0")
    void decrementUsageCount(@Param("tagId") Long tagId);

    @Query("SELECT COUNT(t) FROM Tag t WHERE t.isActive = true")
    long countActiveTags();

    boolean existsByName(String name);
}
