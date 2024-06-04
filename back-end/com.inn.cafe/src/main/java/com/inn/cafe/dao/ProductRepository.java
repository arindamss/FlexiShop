package com.inn.cafe.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.inn.cafe.entity.Product;
import com.inn.cafe.wrapper.ProductWrapper;

import jakarta.transaction.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    List<ProductWrapper> getAllProduct();

    @Transactional
    @Modifying
    public Integer updateStatusById(@Param("status") String status, @Param("id") Integer id);

    List<ProductWrapper> findByCategoryId(@Param("cId") Integer cId);

    ProductWrapper findProductById(@Param("id") Integer id);

}
