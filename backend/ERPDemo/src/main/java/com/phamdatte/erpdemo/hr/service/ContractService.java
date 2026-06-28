package com.phamdatte.erpdemo.hr.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.ContractCreateRequest;
import com.phamdatte.erpdemo.hr.dto.ContractDto;
import com.phamdatte.erpdemo.hr.entity.Contract;
import com.phamdatte.erpdemo.hr.repository.ContractRepository;
import com.phamdatte.erpdemo.hr.repository.EmployeeRepository;
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
public class ContractService {

    private final ContractRepository contractRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public PageResponse<ContractDto> findAll(Pageable pageable) {
        Page<ContractDto> page = contractRepository.findAll(pageable).map(this::toDto);
        return PageResponse.of(page);
    }

    @Transactional(readOnly = true)
    public ContractDto findById(UUID id) {
        return toDto(getEntity(id));
    }

    public ContractDto create(ContractCreateRequest req) {
        var emp = employeeRepository.findById(req.employeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + req.employeeId()));
        Contract c = Contract.builder()
                .employee(emp)
                .contractType(req.contractType())
                .startDate(req.startDate())
                .endDate(req.endDate())
                .salary(req.salary())
                .status(req.status() != null ? req.status() : "ACTIVE")
                .build();
        return toDto(contractRepository.save(c));
    }

    public ContractDto update(UUID id, ContractCreateRequest req) {
        Contract c = getEntity(id);
        c.setContractType(req.contractType());
        c.setStartDate(req.startDate());
        c.setEndDate(req.endDate());
        c.setSalary(req.salary());
        if (req.status() != null) c.setStatus(req.status());
        return toDto(contractRepository.save(c));
    }

    public void delete(UUID id) {
        Contract c = getEntity(id);
        c.setDeleted(true);
        contractRepository.save(c);
    }

    private Contract getEntity(UUID id) {
        return contractRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Contract not found: " + id));
    }

    private ContractDto toDto(Contract c) {
        return new ContractDto(
                c.getId(), c.getEmployee().getId(), c.getEmployee().getFullName(),
                c.getContractType(), c.getStartDate(), c.getEndDate(),
                c.getSalary(), c.getStatus()
        );
    }
}
