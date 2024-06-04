package com.inn.cafe.entity;

import java.io.Serializable;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.Data;

@NamedQuery(name = "Product.getAllProduct", query = "select new com.inn.cafe.wrapper.ProductWrapper(p.id, p.name, p.description, p.status, p.price, p.category.id, p.category.name) from Product p")

@NamedQuery(name = "Product.updateStatusById", query = "update Product p set p.status=:status where p.id=:id")

@NamedQuery(name = "Product.findByCategoryId", query = "select new com.inn.cafe.wrapper.ProductWrapper(p.id, p.name) from Product p where p.category.id=:cId")

@NamedQuery(name = "Product.findProductById", query = "select new com.inn.cafe.wrapper.ProductWrapper(p.id, p.name, p.description, p.price) from Product p where p.id=:id and p.status='true'")

@Data
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "product")
public class Product implements Serializable {
    public static final long serialVersionUID=1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "descripton")
    private String description;

    @Column(name = "price")
    private Integer price;

    @Column(name = "status")
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_fk", nullable = false)
    // @Column(name = "category")
    private Category category;



}
