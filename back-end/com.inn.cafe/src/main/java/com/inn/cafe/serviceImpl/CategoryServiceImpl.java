package com.inn.cafe.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.google.common.base.Strings;
import com.inn.cafe.JWT.JWTAuthenticationFilter;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.CategoryRepository;
import com.inn.cafe.entity.Category;
import com.inn.cafe.service.CategoryService;
import com.inn.cafe.utils.CafeUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CategoryServiceImpl implements CategoryService{

    @Autowired
    CategoryRepository categoryRepo;

    @Autowired
    JWTAuthenticationFilter filter;

    @Override
    public ResponseEntity<String> addNewCategory(Map<String, String> requestMap) {
        try {
            
            if(filter.isAdmin()){
                if(validateCategoryMap(requestMap, false)){
                    categoryRepo.save(getCategoryMap(requestMap, false));
                    return CafeUtils.getResponseEntity("Category Added Successfull.", HttpStatus.OK);
                }
            }
            return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);


        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public boolean validateCategoryMap(Map<String, String> requestMap, boolean valid){
        if(requestMap.containsKey("name")){
            if(requestMap.containsKey("id") && valid){
                return true;
            }
            else if(!valid){
                return true;
            }
        }
        return false;
    }
    
    private Category getCategoryMap(Map<String, String> requestMap, boolean isAdd){
        Category category=new Category();
        if(isAdd){
            category.setId(Integer.parseInt(requestMap.get("id")));
        }
        category.setName(requestMap.get("name"));
        return category;
    }

    @Override
    public ResponseEntity<List<Category>> getAllCategory(String fetchValue) {
        try {
            if(!Strings.isNullOrEmpty(fetchValue) && fetchValue.equalsIgnoreCase("true")){
                log.info("Inside If block \n\n");
                return new ResponseEntity<>(categoryRepo.getAllCategory(), HttpStatus.OK);
            }
            return new ResponseEntity<>(categoryRepo.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> uapdateCategory(Map<String, String> requMap) {
        try {
            if(filter.isAdmin()){
                // For checking id is present we pass true
                if(validateCategoryMap(requMap, true)){
                    Optional optional=categoryRepo.findById(Integer.parseInt(requMap.get("id")));
                    if(!optional.isEmpty()){
                        // For update the id we pass true
                        categoryRepo.save(getCategoryMap(requMap, true));
                        return CafeUtils.getResponseEntity("Category Updated Successfull.", HttpStatus.OK);
                    }
                    return CafeUtils.getResponseEntity("Id does not exist", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity(CafeConstents.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
