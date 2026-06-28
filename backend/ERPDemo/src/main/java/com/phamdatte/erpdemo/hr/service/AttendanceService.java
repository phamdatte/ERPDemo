package com.phamdatte.erpdemo.hr.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.hr.dto.AttendanceCreateRequest;
import com.phamdatte.erpdemo.hr.dto.AttendanceDto;
import com.phamdatte.erpdemo.hr.entity.Attendance;
import com.phamdatte.erpdemo.hr.repository.AttendanceRepository;
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
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public PageResponse<AttendanceDto> findAll(Pageable pageable) {
        Page<AttendanceDto> page = attendanceRepository.findAll(pageable).map(this::toDto);
        return PageResponse.of(page);
    }

    @Transactional(readOnly = true)
    public AttendanceDto findById(UUID id) {
        return toDto(getEntity(id));
    }

    public AttendanceDto create(AttendanceCreateRequest req) {
        var emp = employeeRepository.findById(req.employeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + req.employeeId()));
        Attendance a = Attendance.builder()
                .employee(emp)
                .workDate(req.workDate())
                .checkIn(req.checkIn())
                .checkOut(req.checkOut())
                .status(req.status() != null ? req.status() : "PRESENT")
                .note(req.note())
                .build();
        return toDto(attendanceRepository.save(a));
    }

    public AttendanceDto update(UUID id, AttendanceCreateRequest req) {
        Attendance a = getEntity(id);
        a.setWorkDate(req.workDate());
        a.setCheckIn(req.checkIn());
        a.setCheckOut(req.checkOut());
        if (req.status() != null) a.setStatus(req.status());
        a.setNote(req.note());
        return toDto(attendanceRepository.save(a));
    }

    public void delete(UUID id) {
        Attendance a = getEntity(id);
        a.setDeleted(true);
        attendanceRepository.save(a);
    }

    private Attendance getEntity(UUID id) {
        return attendanceRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Attendance not found: " + id));
    }

    private AttendanceDto toDto(Attendance a) {
        return new AttendanceDto(
                a.getId(), a.getEmployee().getId(), a.getEmployee().getFullName(),
                a.getWorkDate(), a.getCheckIn(), a.getCheckOut(),
                a.getStatus(), a.getNote()
        );
    }
}
