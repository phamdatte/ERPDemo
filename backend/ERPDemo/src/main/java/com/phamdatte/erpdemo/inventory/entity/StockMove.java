package com.phamdatte.erpdemo.inventory.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "inv_stock_move")
@Getter @Setter @SuperBuilder
@NoArgsConstructor @AllArgsConstructor
public class StockMove extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false, length = 10)
    private String moveType;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal quantity;

    @Column(length = 255)
    private String note;
}
