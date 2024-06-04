package com.inn.cafe.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.inn.cafe.entity.Category;

public interface CategoryService {

    ResponseEntity<String> addNewCategory(Map<String, String> requestMap);

    ResponseEntity<List<Category>> getAllCategory(String fetchValue);

    ResponseEntity<String> uapdateCategory(Map<String,String> requMap);
    
}
