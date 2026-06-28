package com.phamdatte.erpdemo.accounting.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record JournalEntryDto(
        UUID id, String entryNumber, LocalDate entryDate,
        String description, String reference,
        BigDecimal totalDebit, BigDecimal totalCredit,
        List<JournalLineDto> lines
) {}
