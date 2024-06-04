package com.inn.cafe.restImpl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.inn.cafe.rest.DashbordRest;
import com.inn.cafe.service.DashbordService;

@RestController
@CrossOrigin(origins = "*")
public class DashbordRestImpl implements DashbordRest {

    @Autowired
    DashbordService dashbordService;

    @Override
    public ResponseEntity<Map<String, Object>> getCount() {
       return dashbordService.getCount();
    }
    
}
