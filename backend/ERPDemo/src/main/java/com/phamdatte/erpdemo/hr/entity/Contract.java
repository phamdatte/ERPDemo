package com.phamdatte.erpdemo.hr.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hr_contract")
@Getter @Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Contract extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false, length = 40)
    private String contractType;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(precision = 14, scale = 2)
    private BigDecimal salary;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";
}
