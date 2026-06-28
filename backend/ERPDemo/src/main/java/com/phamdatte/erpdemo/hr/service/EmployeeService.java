package com.phamdatte.erpdemo.hr.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.EmployeeCreateRequest;
import com.phamdatte.erpdemo.hr.dto.EmployeeDto;
import com.phamdatte.erpdemo.hr.entity.Department;
import com.phamdatte.erpdemo.hr.entity.Employee;
import com.phamdatte.erpdemo.hr.entity.Position;
import com.phamdatte.erpdemo.hr.repository.DepartmentRepository;
import com.phamdatte.erpdemo.hr.repository.EmployeeRepository;
import com.phamdatte.erpdemo.hr.repository.PositionRepository;
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
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    @Transactional(readOnly = true)
    public PageResponse<EmployeeDto> findAll(Pageable pageable) {
        Page<EmployeeDto> page = employeeRepository.findAll(pageable).map(this::toDto);
        return PageResponse.of(page);
    }

    @Transactional(readOnly = true)
    public EmployeeDto findById(UUID id) {
        return toDto(getEntity(id));
    }

    public EmployeeDto create(EmployeeCreateRequest req) {
        if (employeeRepository.existsByEmployeeCode(req.employeeCode())) {
            throw new IllegalArgumentException("Employee code already exists: " + req.employeeCode());
        }
        Employee emp = Employee.builder()
                .employeeCode(req.employeeCode())
                .fullName(req.fullName())
                .email(req.email())
                .phone(req.phone())
                .gender(req.gender())
                .dateOfBirth(req.dateOfBirth())
                .hireDate(req.hireDate())
                .status(req.status() != null ? req.status() : "ACTIVE")
                .baseSalary(req.baseSalary())
                .build();
        if (req.departmentId() != null) {
            emp.setDepartment(departmentRepository.getReferenceById(req.departmentId()));
        }
        if (req.positionId() != null) {
            emp.setPosition(positionRepository.getReferenceById(req.positionId()));
        }
        return toDto(employeeRepository.save(emp));
    }

    public EmployeeDto update(UUID id, EmployeeCreateRequest req) {
        Employee emp = getEntity(id);
        emp.setFullName(req.fullName());
        emp.setEmail(req.email());
        emp.setPhone(req.phone());
        emp.setGender(req.gender());
        emp.setDateOfBirth(req.dateOfBirth());
        emp.setBaseSalary(req.baseSalary());
        if (req.status() != null) emp.setStatus(req.status());
        if (req.departmentId() != null) emp.setDepartment(departmentRepository.getReferenceById(req.departmentId()));
        else emp.setDepartment(null);
        if (req.positionId() != null) emp.setPosition(positionRepository.getReferenceById(req.positionId()));
        else emp.setPosition(null);
        return toDto(employeeRepository.save(emp));
    }

    public void delete(UUID id) {
        Employee emp = getEntity(id);
        emp.setDeleted(true);
        employeeRepository.save(emp);
    }

    private Employee getEntity(UUID id) {
        return employeeRepository.findById(id)
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + id));
    }

    private EmployeeDto toDto(Employee e) {
        return new EmployeeDto(
                e.getId(), e.getEmployeeCode(), e.getFullName(), e.getEmail(), e.getPhone(),
                e.getGender(), e.getDateOfBirth(), e.getHireDate(), e.getStatus(),
                e.getDepartment() != null ? e.getDepartment().getId() : null,
                e.getDepartment() != null ? e.getDepartment().getName() : null,
                e.getPosition() != null ? e.getPosition().getId() : null,
                e.getPosition() != null ? e.getPosition().getName() : null,
                e.getBaseSalary()
        );
    }
}
