package com.phamdatte.erpdemo.sales.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.sales.dto.CustomerCreateRequest;
import com.phamdatte.erpdemo.sales.dto.CustomerDto;
import com.phamdatte.erpdemo.sales.entity.Customer;
import com.phamdatte.erpdemo.sales.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public PageResponse<CustomerDto> list(int page, int size, String keyword) {
        Page<Customer> result = (keyword == null || keyword.isBlank())
                ? customerRepository.findAll(PageRequest.of(page, size))
                : customerRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public CustomerDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public CustomerDto create(CustomerCreateRequest request) {
        Customer customer = new Customer();
        customer.setCode(request.code());
        customer.setName(request.name());
        customer.setContactName(request.contactName());
        customer.setPhone(request.phone());
        customer.setEmail(request.email());
        customer.setAddress(request.address());
        customer.setTaxCode(request.taxCode());
        return toDto(customerRepository.save(customer));
    }

    @Transactional
    public CustomerDto update(UUID id, CustomerCreateRequest request) {
        Customer customer = find(id);
        customer.setCode(request.code());
        customer.setName(request.name());
        customer.setContactName(request.contactName());
        customer.setPhone(request.phone());
        customer.setEmail(request.email());
        customer.setAddress(request.address());
        customer.setTaxCode(request.taxCode());
        return toDto(customerRepository.save(customer));
    }

    @Transactional
    public void delete(UUID id) {
        Customer customer = find(id);
        customer.setDeleted(true);
        customerRepository.save(customer);
    }

    private Customer find(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
    }

    private CustomerDto toDto(Customer customer) {
        return new CustomerDto(customer.getId(), customer.getCode(), customer.getName(),
                customer.getContactName(), customer.getPhone(), customer.getEmail(),
                customer.getAddress(), customer.getTaxCode());
    }
}
