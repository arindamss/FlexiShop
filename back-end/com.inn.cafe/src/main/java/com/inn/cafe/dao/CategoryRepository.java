package com.inn.cafe.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inn.cafe.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    List<Category> getAllCategory();

}
