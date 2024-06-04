package com.inn.cafe.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.inn.cafe.wrapper.ProductWrapper;

public interface ProductService {
    
    public ResponseEntity<String> addProduct(Map<String, String> requestMap);

    public ResponseEntity<List<ProductWrapper>> getAllProduct();

    ResponseEntity<String> updateProduct(Map<String, String> requestMap);

    public ResponseEntity<String> deleteProduct(Integer id);

    public ResponseEntity<String> updateProductStatus(Map<String, String> requestMap);

    public ResponseEntity<List<ProductWrapper>> getProductByCategory(Integer cId);

    public ResponseEntity<ProductWrapper> getProductById(Integer id);
}
