package com.inn.cafe.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.inn.cafe.entity.User;
import com.inn.cafe.wrapper.UserWrapper;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    User findByEmailId(@Param("email") String  email);

    List<UserWrapper> getAllUser();

    @Transactional
    @Modifying
    @Query("update User u set u.status=:status where u.id=:id")
    Integer updateStatus(@Param("id") Integer id, @Param("status") String status);

    List<String> getAllAdmin();

    User findByEmail(String email);

}
