package com.inn.cafe.utils;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtils {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(List<String> to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("arindamk404@gmail.com");
        System.out.println("All the admins : ");
        for(String s:getToArray(to)){
            System.out.println(s);
        }
        message.setTo(getToArray(to));
        message.setSubject(subject);
        message.setText(text);

        // if (list != null && list.size() > 0)
        //     message.setCc(getCcArray(list));

        emailSender.send(message);
    }

    private String[] getCcArray(List<String> ccList) {
        String[] cc = new String[ccList.size()];
        for (int i = 0; i < ccList.size(); i++) {
            cc[i] = ccList.get(i);
        }
        return cc;
    }

    private String[] getToArray(List<String> allAdmin){
        int index=0;
        String []admins=new String[allAdmin.size()];
        for(String admin:allAdmin){
            admins[index++]=admin;
        }
        return admins;
    }

    public void forgotMail(String to, String subject, String password) throws MessagingException{
        MimeMessage message=emailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(message, true);
        helper.setFrom("arindamk404@gmail.com");
        helper.setSubject(subject);
        helper.setTo(to);
        String htmlMsg = "<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b> " + to + " <br><b>Password: </b> " + password + "<br><a href=\"http://localhost:4200/\">Click here to login</a></p>";
        message.setContent(htmlMsg, "text/html");
        emailSender.send(message);
    }

}
