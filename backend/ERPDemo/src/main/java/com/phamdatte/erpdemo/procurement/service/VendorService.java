package com.phamdatte.erpdemo.procurement.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.procurement.dto.VendorCreateRequest;
import com.phamdatte.erpdemo.procurement.dto.VendorDto;
import com.phamdatte.erpdemo.procurement.entity.Vendor;
import com.phamdatte.erpdemo.procurement.repository.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public PageResponse<VendorDto> list(int page, int size, String keyword) {
        Page<Vendor> result = (keyword == null || keyword.isBlank())
                ? vendorRepository.findAll(PageRequest.of(page, size))
                : vendorRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public VendorDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public VendorDto create(VendorCreateRequest request) {
        Vendor vendor = new Vendor();
        vendor.setCode(request.code());
        vendor.setName(request.name());
        vendor.setContactName(request.contactName());
        vendor.setPhone(request.phone());
        vendor.setEmail(request.email());
        vendor.setAddress(request.address());
        return toDto(vendorRepository.save(vendor));
    }

    @Transactional
    public VendorDto update(UUID id, VendorCreateRequest request) {
        Vendor vendor = find(id);
        vendor.setCode(request.code());
        vendor.setName(request.name());
        vendor.setContactName(request.contactName());
        vendor.setPhone(request.phone());
        vendor.setEmail(request.email());
        vendor.setAddress(request.address());
        return toDto(vendorRepository.save(vendor));
    }

    @Transactional
    public void delete(UUID id) {
        Vendor vendor = find(id);
        vendor.setDeleted(true);
        vendorRepository.save(vendor);
    }

    private Vendor find(UUID id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found: " + id));
    }

    private VendorDto toDto(Vendor vendor) {
        return new VendorDto(vendor.getId(), vendor.getCode(), vendor.getName(),
                vendor.getContactName(), vendor.getPhone(), vendor.getEmail(), vendor.getAddress());
    }
}
