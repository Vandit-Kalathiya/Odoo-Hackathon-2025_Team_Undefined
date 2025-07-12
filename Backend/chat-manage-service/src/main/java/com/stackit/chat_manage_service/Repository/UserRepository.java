//package com.stackit.chat_manage_service.Repository;
//
//import com.stackit.chat_manage_service.Auth.Entities.User;
//import com.stackit.chat_manage_service.Entity.enums.UserRole;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface UserRepository extends JpaRepository<User, Long> {
//
//    Optional<User> findByUsername(String username);
//
//    Optional<User> findByEmail(String email);
//
//    List<User> findByUsernameContainingIgnoreCase(String username);
//
//    Page<User> findByRole(UserRole role, Pageable pageable);
//
//    Page<User> findByIsActiveTrue(Pageable pageable);
//
//    Page<User> findByIsBannedTrue(Pageable pageable);
//
//    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.isBanned = false ORDER BY u.reputationScore DESC")
//    Page<User> findTopUsers(Pageable pageable);
//
//    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
//    long countByRole(@Param("role") UserRole role);
//
//    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.isBanned = false")
//    long countActiveUsers();
//
//    boolean existsByUsername(String username);
//
//    boolean existsByEmail(String email);
//}