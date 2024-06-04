package com.inn.cafe.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import com.inn.cafe.JWT.JWTAuthenticationFilter;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.ProductRepository;
import com.inn.cafe.entity.Category;
import com.inn.cafe.entity.Product;
import com.inn.cafe.service.ProductService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.ProductWrapper;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    JWTAuthenticationFilter filter;

    @Autowired
    ProductRepository productRepo;

    @Override
    public ResponseEntity<String> addProduct(Map<String, String> requestMap) {
        try {
            if(filter.isAdmin()){
                if(validateMapProduct(requestMap,false)){
                    productRepo.save(getProductMap(requestMap, false));
                    return CafeUtils.getResponseEntity("Product Added Successfull.", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity(CafeConstents.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateMapProduct(Map<String, String> requestMap, boolean valid) {
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
    
    private Product getProductMap(Map<String, String> requestMap, boolean isAdd) {
        Category category=new Category();
        category.setId(Integer.parseInt(requestMap.get("categoryId")));

        Product product=new Product();
        if(isAdd){
            product.setId(Integer.parseInt(requestMap.get("id")));
        }
        else{
            product.setStatus("true");
        }
        product.setCategory(category);
        product.setName(requestMap.get("name"));
        product.setPrice(Integer.parseInt(requestMap.get("price")));
        product.setDescription(requestMap.get("description"));
        return product;

    }

    @Override
    public ResponseEntity<List<ProductWrapper>> getAllProduct() {
        try{
            return new ResponseEntity<>(productRepo.getAllProduct(), HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateProduct(Map<String, String> requestMap) {
        try{
            if(filter.isAdmin()){
                Optional<Product> optional=productRepo.findById(Integer.parseInt(requestMap.get("id")));
                if(!optional.isEmpty()){
                    Product product=getProductMap(requestMap, true);
                    product.setStatus(optional.get().getStatus());
                    productRepo.save(product);
                    return CafeUtils.getResponseEntity("Product Update Successfull.", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity("Product Id does not exist. ", HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteProduct(Integer id) {
        try{
            if(filter.isAdmin()){
                Optional<Product> optional=productRepo.findById(id);
                if(!optional.isEmpty()){
                    productRepo.deleteById(id);
                    return CafeUtils.getResponseEntity("Product Deleted Successfull.", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity("Id Does Not Exiest.", HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);

        }catch(Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateProductStatus(Map<String, String> requestMap) {
        try{
            if(filter.isAdmin()){
                Optional<Product> optional=productRepo.findById(Integer.parseInt(requestMap.get("id")));
                if(!optional.isEmpty()){
                    productRepo.updateStatusById(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));
                    return CafeUtils.getResponseEntity("Product Status changed", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity("Id does not exist", HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);

        }
        catch(Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<ProductWrapper>> getProductByCategory(Integer cId) {
        try {
            return new ResponseEntity<>(productRepo.findByCategoryId(cId), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<ProductWrapper> getProductById(Integer id) {
        try {
            return new ResponseEntity<>(productRepo.findProductById(id), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ProductWrapper(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    
}
