package com.phamdatte.erpdemo.accounting.service;

import com.phamdatte.erpdemo.accounting.dto.ChartOfAccountCreateRequest;
import com.phamdatte.erpdemo.accounting.dto.ChartOfAccountDto;
import com.phamdatte.erpdemo.accounting.entity.ChartOfAccount;
import com.phamdatte.erpdemo.accounting.repository.ChartOfAccountRepository;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ChartOfAccountService {

    private final ChartOfAccountRepository repository;

    @Transactional(readOnly = true)
    public PageResponse<ChartOfAccountDto> findAll(Pageable pageable) {
        return PageResponse.of(repository.findAll(pageable).map(this::toDto));
    }

    @Transactional(readOnly = true)
    public ChartOfAccountDto findById(UUID id) {
        return toDto(getEntity(id));
    }

    public ChartOfAccountDto create(ChartOfAccountCreateRequest req) {
        if (repository.existsByCode(req.code())) {
            throw new IllegalArgumentException("Account code already exists: " + req.code());
        }
        ChartOfAccount coa = ChartOfAccount.builder()
                .code(req.code()).name(req.name()).type(req.type())
                .description(req.description()).build();
        if (req.parentId() != null) coa.setParent(getEntity(req.parentId()));
        return toDto(repository.save(coa));
    }

    public ChartOfAccountDto update(UUID id, ChartOfAccountCreateRequest req) {
        ChartOfAccount coa = getEntity(id);
        coa.setName(req.name());
        coa.setType(req.type());
        coa.setDescription(req.description());
        if (req.parentId() != null) coa.setParent(getEntity(req.parentId()));
        else coa.setParent(null);
        return toDto(repository.save(coa));
    }

    public void delete(UUID id) {
        ChartOfAccount coa = getEntity(id);
        coa.setDeleted(true);
        repository.save(coa);
    }

    private ChartOfAccount getEntity(UUID id) {
        return repository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Account not found: " + id));
    }

    private ChartOfAccountDto toDto(ChartOfAccount c) {
        return new ChartOfAccountDto(
                c.getId(), c.getCode(), c.getName(), c.getType(), c.getDescription(),
                c.getParent() != null ? c.getParent().getId() : null,
                c.getParent() != null ? c.getParent().getName() : null
        );
    }
}
