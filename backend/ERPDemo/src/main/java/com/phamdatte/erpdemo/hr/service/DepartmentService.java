package com.phamdatte.erpdemo.hr.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.DepartmentCreateRequest;
import com.phamdatte.erpdemo.hr.dto.DepartmentDto;
import com.phamdatte.erpdemo.hr.entity.Department;
import com.phamdatte.erpdemo.hr.entity.Employee;
import com.phamdatte.erpdemo.hr.repository.DepartmentRepository;
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
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public PageResponse<DepartmentDto> findAll(Pageable pageable) {
        Page<DepartmentDto> page = departmentRepository.findAll(pageable).map(this::toDto);
        return PageResponse.of(page);
    }

    @Transactional(readOnly = true)
    public DepartmentDto findById(UUID id) {
        return toDto(getEntity(id));
    }

    public DepartmentDto create(DepartmentCreateRequest req) {
        if (departmentRepository.existsByCode(req.code())) {
            throw new IllegalArgumentException("Department code already exists: " + req.code());
        }
        Department dept = Department.builder()
                .code(req.code())
                .name(req.name())
                .description(req.description())
                .build();
        if (req.parentId() != null) {
            dept.setParent(getEntity(req.parentId()));
        }
        if (req.managerId() != null) {
            dept.setManager(employeeRepository.getReferenceById(req.managerId()));
        }
        return toDto(departmentRepository.save(dept));
    }

    public DepartmentDto update(UUID id, DepartmentCreateRequest req) {
        Department dept = getEntity(id);
        dept.setName(req.name());
        dept.setDescription(req.description());
        if (req.parentId() != null) dept.setParent(getEntity(req.parentId()));
        else dept.setParent(null);
        if (req.managerId() != null) dept.setManager(employeeRepository.getReferenceById(req.managerId()));
        else dept.setManager(null);
        return toDto(departmentRepository.save(dept));
    }

    public void delete(UUID id) {
        Department dept = getEntity(id);
        dept.setDeleted(true);
        departmentRepository.save(dept);
    }

    private Department getEntity(UUID id) {
        return departmentRepository.findById(id)
                .filter(d -> !d.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + id));
    }

    private DepartmentDto toDto(Department d) {
        return new DepartmentDto(
                d.getId(), d.getCode(), d.getName(), d.getDescription(),
                d.getParent() != null ? d.getParent().getId() : null,
                d.getParent() != null ? d.getParent().getName() : null,
                d.getManager() != null ? d.getManager().getId() : null,
                d.getManager() != null ? d.getManager().getFullName() : null
        );
    }
}
