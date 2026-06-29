package com.phamdatte.erpdemo.accounting.service;

import com.phamdatte.erpdemo.accounting.dto.JournalEntryCreateRequest;
import com.phamdatte.erpdemo.accounting.dto.JournalEntryDto;
import com.phamdatte.erpdemo.accounting.dto.JournalLineDto;
import com.phamdatte.erpdemo.accounting.entity.ChartOfAccount;
import com.phamdatte.erpdemo.accounting.entity.JournalEntry;
import com.phamdatte.erpdemo.accounting.entity.JournalLine;
import com.phamdatte.erpdemo.accounting.repository.ChartOfAccountRepository;
import com.phamdatte.erpdemo.accounting.repository.JournalEntryRepository;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class JournalEntryService {

    private final JournalEntryRepository entryRepository;
    private final ChartOfAccountRepository accountRepository;

    @Transactional(readOnly = true)
    public PageResponse<JournalEntryDto> findAll(Pageable pageable) {
        return PageResponse.of(entryRepository.findAll(pageable).map(this::toDto));
    }

    @Transactional(readOnly = true)
    public JournalEntryDto findById(UUID id) {
        return toDto(getEntity(id));
    }

    public JournalEntryDto create(JournalEntryCreateRequest req) {
        if (entryRepository.existsByEntryNumber(req.entryNumber())) {
            throw new IllegalArgumentException("Entry number already exists: " + req.entryNumber());
        }
        JournalEntry entry = JournalEntry.builder()
                .entryNumber(req.entryNumber())
                .entryDate(req.entryDate())
                .description(req.description())
                .reference(req.reference())
                .build();

        for (var lineReq : req.lines()) {
            ChartOfAccount acc = accountRepository.findById(lineReq.accountId())
                    .orElseThrow(() -> new EntityNotFoundException("Account not found: " + lineReq.accountId()));
            JournalLine line = JournalLine.builder()
                    .journalEntry(entry)
                    .account(acc)
                    .description(lineReq.description())
                    .debit(lineReq.debit() != null ? lineReq.debit() : BigDecimal.ZERO)
                    .credit(lineReq.credit() != null ? lineReq.credit() : BigDecimal.ZERO)
                    .build();
            entry.getLines().add(line);
        }
        return toDto(entryRepository.save(entry));
    }

    public void delete(UUID id) {
        JournalEntry entry = getEntity(id);
        entry.setDeleted(true);
        entryRepository.save(entry);
    }

    private JournalEntry getEntity(UUID id) {
        return entryRepository.findById(id)
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Journal entry not found: " + id));
    }

    private JournalEntryDto toDto(JournalEntry e) {
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;
        var lineDtos = new java.util.ArrayList<JournalLineDto>();
        if (e.getLines() != null) {
            for (JournalLine l : e.getLines()) {
                totalDebit = totalDebit.add(l.getDebit() != null ? l.getDebit() : BigDecimal.ZERO);
                totalCredit = totalCredit.add(l.getCredit() != null ? l.getCredit() : BigDecimal.ZERO);
                lineDtos.add(new JournalLineDto(
                        l.getId(), l.getAccount().getId(), l.getAccount().getCode(),
                        l.getAccount().getName(), l.getDescription(),
                        l.getDebit(), l.getCredit()
                ));
            }
        }
        return new JournalEntryDto(
                e.getId(), e.getEntryNumber(), e.getEntryDate(),
                e.getDescription(), e.getReference(),
                totalDebit, totalCredit, lineDtos
        );
    }
}
