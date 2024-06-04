package com.inn.cafe.entity;

import java.io.Serializable;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import lombok.Data;

@NamedQuery(name = "Category.getAllCategory", query = "select c from Category c where c.id in (select p.category.id from Product p where p.status='true')")

@Data
@DynamicUpdate
@DynamicInsert
@Entity
@Table(name = "Category")
public class Category implements Serializable {
    public static final long serialVersionUID=1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;
}
