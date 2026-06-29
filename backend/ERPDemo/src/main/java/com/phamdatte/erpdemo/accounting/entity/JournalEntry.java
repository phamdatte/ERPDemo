package com.phamdatte.erpdemo.accounting.entity;

import com.phamdatte.erpdemo.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "acc_journal_entry")
@Getter @Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntry extends BaseEntity {

    @Column(nullable = false, unique = true, length = 40)
    private String entryNumber;

    @Column(nullable = false)
    private LocalDate entryDate;

    @Column(length = 255)
    private String description;

    @Column(length = 120)
    private String reference;

    @Builder.Default
    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JournalLine> lines = new ArrayList<>();
}
