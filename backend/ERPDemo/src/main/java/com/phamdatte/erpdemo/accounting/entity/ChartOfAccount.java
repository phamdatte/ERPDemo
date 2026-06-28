package com.phamdatte.erpdemo.accounting.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "acc_chart_of_account")
@Getter @Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ChartOfAccount extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ChartOfAccount parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<ChartOfAccount> children;
}
