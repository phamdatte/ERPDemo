package com.phamdatte.erpdemo.accounting.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record JournalEntryCreateRequest(
        @NotBlank String entryNumber, @NotNull LocalDate entryDate,
        String description, String reference,
        @NotEmpty @Valid List<JournalLineRequest> lines
) {}
