package com.phamdatte.erpdemo.accounting.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record JournalLineDto(
        UUID id, UUID accountId, String accountCode, String accountName,
        String description, BigDecimal debit, BigDecimal credit
) {}
