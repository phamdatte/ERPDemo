package com.phamdatte.erpdemo.inventory.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "inv_product")
@Getter @Setter @SuperBuilder
@NoArgsConstructor @AllArgsConstructor
public class Product extends BaseEntity {

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(length = 20)
    private String unit;

    @Column(precision = 14, scale = 2)
    private BigDecimal unitPrice;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<StockMove> stockMoves;
}
