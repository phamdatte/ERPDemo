package com.phamdatte.erpdemo.sales.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sale_customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Customer extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 40)
    private String code;

    @Column(name = "name", nullable = false, length = 160)
    private String name;

    @Column(name = "contact_name", length = 120)
    private String contactName;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "email", length = 160)
    private String email;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "tax_code", length = 30)
    private String taxCode;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<SalesOrder> salesOrders = new HashSet<>();
}
