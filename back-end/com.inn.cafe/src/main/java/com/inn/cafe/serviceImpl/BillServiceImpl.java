package com.inn.cafe.serviceImpl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Phaser;
import java.util.stream.Stream;

import com.itextpdf.text.Element;

import org.apache.pdfbox.io.IOUtils;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.inn.cafe.JWT.JWTAuthenticationFilter;
import com.inn.cafe.constents.CafeConstents;
import com.inn.cafe.dao.BillRepository;
import com.inn.cafe.entity.Bill;
import com.inn.cafe.service.BillService;
import com.inn.cafe.utils.CafeUtils;
import com.itextpdf.text.BaseColor;
// import com.itextpdf.awt.geom.Rectangle;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BillServiceImpl implements BillService {

    @Autowired
    JWTAuthenticationFilter filter;

    @Autowired
    BillRepository billRepo;

    @Override
    public ResponseEntity<String> generateReport(Map<String, Object> requestMap) {
        try {
            String filename;
            if(validateRequestMap(requestMap)){
                if(requestMap.containsKey("isGenerate") && !(Boolean) requestMap.get("isGenerate")){
                    filename=(String) requestMap.get("uuid");
                }
                else{
                    filename=CafeUtils.getUUID();
                    requestMap.put("uuid", filename);
                    insertBill(requestMap);
                }
                
                String data="Name : "+requestMap.get("name")+"\nContact Number : "+requestMap.get("contactNumber")+"\nEmail : "+requestMap.get("email")+
                                    "\nPayment Mode : "+requestMap.get("paymentMethod");

                Document document=new Document();
                PdfWriter.getInstance(document, new FileOutputStream(CafeConstents.STORAGE_LOCATION+"\\"+filename+".pdf")); 
                document.open();
                setRectangleInPdf(document);

                Paragraph chunk=new Paragraph("Cafe Controller", getFont("Header"));
                chunk.setAlignment(Element.ALIGN_CENTER);
                document.add(chunk);

                Paragraph paragraph=new Paragraph(data+"\n\n", getFont("Data"));
                document.add(paragraph);

                PdfPTable table=new PdfPTable(5);
                table.setWidthPercentage(100);
                addTableHeader(table);

                JSONArray jsonArray=CafeUtils.getJsonArrayFromString((String)requestMap.get("productDetails"));
                for(int i=0;i<jsonArray.length();i++){
                    addRow(table, CafeUtils.getMapFromJson(jsonArray.getString(i)));
                }

                document.add(table);
                Paragraph footer=new Paragraph("Total : "+requestMap.get("totalAmmount")+"Thank you for visiting. Please visit again", getFont("Data"));
                document.add(footer);
                document.close();
                return new ResponseEntity<>("{\"uuid\":" +filename+"\"}", HttpStatus.OK);

            }
            return CafeUtils.getResponseEntity("Required Data not present", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void addRow(PdfPTable table, Map<String, Object> data) {
        log.info("Inside addRow");
        table.addCell((String)data.get("name"));
        table.addCell((String)data.get("category"));
        table.addCell((String)data.get("quantity"));
        table.addCell(Double.toString((Double)data.get("price")));
        table.addCell(Double.toString((Double)data.get("price")));

        
    }

    private void addTableHeader(PdfPTable table) {
       log.info("Inside addTableHeader");
       Stream.of("Name", "Category","Quantity","Price","Sub Total")
            .forEach(columnTitle -> {
                PdfPCell header=new PdfPCell();
                header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                header.setBorderWidth(2);
                header.setPhrase(new Phrase(columnTitle));
                header.setBackgroundColor(BaseColor.YELLOW);
                header.setHorizontalAlignment(Element.ALIGN_CENTER);
                header.setVerticalAlignment(Element.ALIGN_CENTER);
                table.addCell(header);
            });
    }

    private Font getFont(String type) {
        log.info("Inside getFont");
        switch(type){
            case "Header":
                Font headerFont=FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 18, BaseColor.BLACK);
                headerFont.setStyle(Font.BOLD);
                return headerFont;
            case "Data":
                Font dataFont=FontFactory.getFont(FontFactory.TIMES_ROMAN, 11, BaseColor.BLACK);
                dataFont.setStyle(Font.BOLD);
                return dataFont;
            default:
                return new Font();
        }
    }
    
    private void setRectangleInPdf(Document document) throws DocumentException {
        log.info("Inside setRectangleInPdf");
        Rectangle rect=new Rectangle(577,825,18,15);
        rect.enableBorderSide(1);
        rect.enableBorderSide(2);
        rect.enableBorderSide(4);
        rect.enableBorderSide(8);
        rect.setBorderColor(BaseColor.BLACK);
        rect.setBorderWidth(1);
        document.add(rect);

    }

    public void insertBill(Map<String, Object> requestMap){
        try {
            Bill bill=new Bill();
            bill.setName((String)requestMap.get("name"));
            bill.setUuid((String) requestMap.get("uuid"));
            bill.setEmail((String)requestMap.get("email"));
            bill.setContactNumber((String)requestMap.get("contactNumber"));
            bill.setPaymentMode((String)requestMap.get("paymentMethod"));
            bill.setTotal(Integer.parseInt((String) requestMap.get("totalAmount")));
            bill.setProductDetails((String)requestMap.get("productDetails"));
            bill.setCreatedBy(filter.getCurrentUser());
            billRepo.save(bill);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean validateRequestMap(Map<String, Object> requestMap){
        return requestMap.containsKey("name") && requestMap.containsKey("contactNumber") && requestMap.containsKey("email") &&
                    requestMap.containsKey("paymentMethod") && requestMap.containsKey("totalAmount") && requestMap.containsKey("productDetails");
    }

    @Override
    public ResponseEntity<List<Bill>> getBills() {
        List<Bill> bills=new ArrayList<>();
        if(filter.isAdmin()){
            bills=billRepo.getAllBills();
        }
        else{
            bills=billRepo.getBillByUsername(filter.getCurrentUser());
        }
        return new ResponseEntity<>(bills, HttpStatus.OK);

    }

    @Override
    public ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap) {
        log.info("Inside getPdf : requestMap {}",requestMap);
        try {
            byte[] byteArray=new byte[0];
            if(!requestMap.containsKey("uuid") && validateRequestMap(requestMap))
                return new ResponseEntity<>(byteArray, HttpStatus.BAD_REQUEST);
            String filePath=CafeConstents.STORAGE_LOCATION+"\\"+(String) requestMap.get("uuid")+".pdf";
            if(CafeUtils.isFileExist(filePath)){
                byteArray=getByteArray(filePath);
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            }
            else{
                requestMap.put("isGenerate", false);
                generateReport(requestMap);
                byteArray=getByteArray(filePath);
                return new ResponseEntity<>(byteArray, HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private byte[] getByteArray(String filePath)throws Exception {
        File inisialFile=new File(filePath);
        InputStream targetStream=new FileInputStream(inisialFile);
        byte[] byteArray=IOUtils.toByteArray(targetStream);
        targetStream.close();
        return byteArray;
    }

    @Override
    public ResponseEntity<String> deleteBill(Integer id) {
        try {
            Optional optional=billRepo.findById(id);
            if(!optional.isEmpty()){
                billRepo.deleteById(id);
                return CafeUtils.getResponseEntity("Bill Deleted Successfull", HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity("Bill id does not exist", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstents.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
}
