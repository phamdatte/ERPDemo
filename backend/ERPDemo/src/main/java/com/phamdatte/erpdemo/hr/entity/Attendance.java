package com.phamdatte.erpdemo.hr.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "hr_attendance")
@Getter @Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private LocalDate workDate;

    private LocalTime checkIn;

    private LocalTime checkOut;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PRESENT";

    @Column(length = 255)
    private String note;
}
