package com.inn.cafe.serviceImpl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.inn.cafe.dao.BillRepository;
import com.inn.cafe.dao.CategoryRepository;
import com.inn.cafe.dao.ProductRepository;
import com.inn.cafe.service.DashbordService;

@Service
public class DashbordServiceimpl implements DashbordService {

    @Autowired
    CategoryRepository categoryRepo;

    @Autowired
    ProductRepository productRepo;

    @Autowired
    BillRepository billRepo;

    @Override
    public ResponseEntity<Map<String, Object>> getCount() {
        Map<String, Object> map=new HashMap<>();
        map.put("category", categoryRepo.count());
        map.put("product", productRepo.count());
        map.put("bill", billRepo.count());
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
    
}
