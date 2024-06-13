package com.inn.cafe.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.google.common.base.Strings;
import com.inn.cafe.JWT.JWTAuthenticationFilter;
import com.inn.cafe.JWT.JWTHelper;
import com.inn.cafe.JWT.UserDetailsServiceImpl;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.UserRepository;
import com.inn.cafe.entity.User;
import com.inn.cafe.service.UserService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.utils.EmailUtils;
import com.inn.cafe.wrapper.UserWrapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepo;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserDetailsServiceImpl customUserDetails;

    @Autowired
    JWTHelper jwtHelper;

    @Autowired
    JWTAuthenticationFilter filter;

    @Autowired
    EmailUtils emailUtils;

    @Override
    public ResponseEntity<String> signup(Map<String, String> requestMap) {
        log.info("Inside signup{} ", requestMap);
        try {
            if (validateSignupMap(requestMap)) {
                User user = this.userRepo.findByEmailId(requestMap.get("email"));
                if (Objects.isNull(user)) {
                    userRepo.save(getUSerFromMap(requestMap));
                    return CafeUtils.getResponseEntity("Successfully Registered", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("Email Already Exist", HttpStatus.BAD_REQUEST);
                }
            } else {
                return CafeUtils.getResponseEntity(CafeConstents.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity("Something went wrong", HttpStatus.BAD_REQUEST);

    }

    public boolean validateSignupMap(Map<String, String> requestMap) {
        if (requestMap.containsKey("name") && requestMap.containsKey("contactNumber") && requestMap.containsKey("email")
                && requestMap.containsKey("password")) {
            return true;
        }
        return false;
    }

    public User getUSerFromMap(Map<String, String> requestMap) {
        User user = new User();
        user.setName(requestMap.get("name"));
        user.setEmail(requestMap.get("email"));
        user.setContactNumber(requestMap.get("contactNumber"));
        user.setPassword(requestMap.get("password"));
        user.setStatus("false");
        user.setRole("user");
        return user;
    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside Login Service");

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password")));
            log.info("I am in 1st");

            if (auth.isAuthenticated()) {
                log.info("I am in 2nd");
                if (customUserDetails.getUserDetails().getStatus().equalsIgnoreCase("true")) {
                    log.info("I am in 3rd");
                    return new ResponseEntity<String>(
                            "{\"token\":\"" + jwtHelper.generateToken(customUserDetails.getUserDetails().getEmail(),
                                    customUserDetails.getUserDetails().getRole()) + "\",\"message\":\"Login Successfull\"}",
                            HttpStatus.OK);
                } else {
                    return new ResponseEntity<String>("\"message\":\"Wait for Admin approval.\"",
                            HttpStatus.BAD_REQUEST);
                }
            }
            else{
                log.info("I am inside error");
                return new ResponseEntity<String>("\"message\":\"Bad Credientials.\"", HttpStatus.BAD_REQUEST);
            }
        } 
        catch (BadCredentialsException e) {
            log.error("Bad credentials error: {}", e.getMessage());
                return new ResponseEntity<String>("{\"message\":\"Bad Credentials.\"}", HttpStatus.BAD_REQUEST);
        } 
        catch (AuthenticationException e) {
            log.error("Authentication error: {}", e.getMessage());
            return new ResponseEntity<String>("{\"message\":\"Authentication error.\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        } 
        catch (Exception e) {
            log.error("Unexpected error: {}", e);
            return new ResponseEntity<String>("{\"message\":\"Unexpected error occurred.\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        //     log.info("I am outside error");
        // return new ResponseEntity<String>("\"message\":\"Bad Credientials.\"",HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<List<UserWrapper>> getAllUser() {
        try{
            if(filter.isAdmin()){
                return new ResponseEntity<>(userRepo.getAllUser(), HttpStatus.OK);
            }
            else{
                return new ResponseEntity<List<UserWrapper>>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }
            
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<List<UserWrapper>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try{
            if(filter.isAdmin()){
                Optional<User> optional=userRepo.findById(Integer.parseInt(requestMap.get("id")));
                if(!optional.isEmpty()){
                    userRepo.updateStatus(Integer.parseInt(requestMap.get("id")), requestMap.get("status"));
                    sendMailToAllAdmin(requestMap.get("status"), optional.get().getEmail(), userRepo.getAllAdmin());
                    return CafeUtils.getResponseEntity("User Status Updated Successfully", HttpStatus.OK);
                }
            }
            else{
                return CafeUtils.getResponseEntity(CafeConstents.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void sendMailToAllAdmin(String status, String user, List<String> allAdmin) {
        allAdmin.remove(filter.getCurrentUser());

        if(status != null && status.equalsIgnoreCase("true")){
            emailUtils.sendSimpleMessage(allAdmin, "Account Approved", "USER :- "+user+" \nis approved by \n ADMIN:- "+filter.getCurrentUser());
        }
        else{
            emailUtils.sendSimpleMessage(allAdmin, "Account Disabled", "USER :- "+user+" \nis disabled by \n ADMIN:- "+filter.getCurrentUser());
        }
    }

    @Override
    public ResponseEntity<String> checkToken() {
        return CafeUtils.getResponseEntity("true", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> changePassword(Map<String, String> requestMap) {
        try{
            User userObj=userRepo.findByEmail(filter.getCurrentUser());
            if(!userObj.equals(null)){
                if(userObj.getPassword().equals(requestMap.get("oldPassword"))){
                    userObj.setPassword(requestMap.get("newPassword"));
                    userRepo.save(userObj);
                    return CafeUtils.getResponseEntity("Password Changed Successfully.", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity("Incorrect Old Password.", HttpStatus.BAD_REQUEST);
            }
            return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        catch(Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap) {
        try{
            User userObj=userRepo.findByEmail(requestMap.get("username"));
            if(!Objects.isNull(userObj) && !Strings.isNullOrEmpty(userObj.getEmail())){
                emailUtils.forgotMail(userObj.getEmail(), "Credientils By Cafe-Controller.", userObj.getPassword());
            }
            return CafeUtils.getResponseEntity("Email successfully sent.", HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    
    

}
