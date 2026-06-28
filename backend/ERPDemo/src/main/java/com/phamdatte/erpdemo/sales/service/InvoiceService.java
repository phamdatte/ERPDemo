package com.phamdatte.erpdemo.sales.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.sales.dto.InvoiceCreateRequest;
import com.phamdatte.erpdemo.sales.dto.InvoiceDto;
import com.phamdatte.erpdemo.sales.entity.Customer;
import com.phamdatte.erpdemo.sales.entity.Invoice;
import com.phamdatte.erpdemo.sales.entity.SalesOrder;
import com.phamdatte.erpdemo.sales.repository.CustomerRepository;
import com.phamdatte.erpdemo.sales.repository.InvoiceRepository;
import com.phamdatte.erpdemo.sales.repository.SalesOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final SalesOrderRepository salesOrderRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          CustomerRepository customerRepository,
                          SalesOrderRepository salesOrderRepository) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    public PageResponse<InvoiceDto> list(int page, int size) {
        Page<Invoice> result = invoiceRepository.findAllWithCustomer(PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public InvoiceDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public InvoiceDto create(InvoiceCreateRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + request.customerId()));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.invoiceNumber());
        invoice.setCustomer(customer);
        invoice.setInvoiceDate(request.invoiceDate());
        invoice.setTotalAmount(request.totalAmount());
        invoice.setDescription(request.description());
        invoice.setStatus("UNPAID");

        if (request.salesOrderId() != null) {
            SalesOrder order = salesOrderRepository.findById(request.salesOrderId())
                    .orElseThrow(() -> new IllegalArgumentException("Sales order not found: " + request.salesOrderId()));
            invoice.setSalesOrder(order);
        }

        return toDto(invoiceRepository.save(invoice));
    }

    private Invoice find(UUID id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + id));
    }

    private InvoiceDto toDto(Invoice invoice) {
        return new InvoiceDto(invoice.getId(), invoice.getInvoiceNumber(),
                invoice.getCustomer().getId(), invoice.getCustomer().getName(),
                invoice.getSalesOrder() != null ? invoice.getSalesOrder().getId() : null,
                invoice.getSalesOrder() != null ? invoice.getSalesOrder().getOrderNumber() : null,
                invoice.getInvoiceDate(), invoice.getStatus(),
                invoice.getTotalAmount(), invoice.getDescription());
    }
}
