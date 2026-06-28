package com.phamdatte.erpdemo.procurement.entity;

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
@Table(name = "inv_vendor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Vendor extends BaseEntity {

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

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PurchaseOrder> purchaseOrders = new HashSet<>();
}
