package com.inn.cafe.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.inn.cafe.entity.Bill;

public interface BillService {

    ResponseEntity generateReport(Map<String, Object> requestMap);

    ResponseEntity<List<Bill>> getBills();

    ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap);

    ResponseEntity<String> deleteBill(Integer id);
    
}
