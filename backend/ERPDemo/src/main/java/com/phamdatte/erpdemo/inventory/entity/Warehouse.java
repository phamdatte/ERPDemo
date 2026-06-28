package com.phamdatte.erpdemo.inventory.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "inv_warehouse")
@Getter @Setter @SuperBuilder
@NoArgsConstructor @AllArgsConstructor
public class Warehouse extends BaseEntity {

    @Column(nullable = false, unique = true, length = 40)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(length = 255)
    private String address;

    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL)
    private List<StockMove> stockMoves;
}
