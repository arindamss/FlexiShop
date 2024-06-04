package com.inn.cafe.JWT;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.inn.cafe.entity.User;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private com.inn.cafe.dao.UserRepository userRepo;

    private com.inn.cafe.entity.User userDetails;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Inside UserDetails{}",userDetails);
        // User user=userRepo.getUser(username);
        userDetails=userRepo.findByEmailId(username);
        if(userDetails ==null){
            throw new UsernameNotFoundException("User is not found");
        }
        
        else{
            return new org.springframework.security.core.userdetails.User(userDetails.getEmail(), userDetails.getPassword(), new ArrayList<>());
        }
        // CustomUSerDetails customUser=new CustomUSerDetails(user);
        // return customUser;
    }

    public User getUserDetails(){
        return userDetails;
    }
    
}