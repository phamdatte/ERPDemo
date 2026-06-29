package com.phamdatte.erpdemo.sales.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.entity.Product;
import com.phamdatte.erpdemo.inventory.repository.ProductRepository;
import com.phamdatte.erpdemo.sales.dto.SalesOrderCreateRequest;
import com.phamdatte.erpdemo.sales.dto.SalesOrderDto;
import com.phamdatte.erpdemo.sales.dto.SalesOrderLineDto;
import com.phamdatte.erpdemo.sales.entity.Customer;
import com.phamdatte.erpdemo.sales.entity.SalesOrder;
import com.phamdatte.erpdemo.sales.entity.SalesOrderLine;
import com.phamdatte.erpdemo.sales.repository.CustomerRepository;
import com.phamdatte.erpdemo.sales.repository.SalesOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public SalesOrderService(SalesOrderRepository salesOrderRepository,
                             CustomerRepository customerRepository,
                             ProductRepository productRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<SalesOrderDto> list(int page, int size) {
        Page<SalesOrder> result = salesOrderRepository.findAllWithCustomer(PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    @Transactional(readOnly = true)
    public SalesOrderDto get(UUID id) {
        return toDto(salesOrderRepository.findWithLinesById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sales order not found: " + id)));
    }

    @Transactional
    public SalesOrderDto create(SalesOrderCreateRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + request.customerId()));

        SalesOrder order = new SalesOrder();
        order.setOrderNumber(request.orderNumber());
        order.setCustomer(customer);
        order.setOrderDate(request.orderDate());
        order.setDescription(request.description());
        order.setStatus("DRAFT");

        for (var lineReq : request.lines()) {
            Product product = productRepository.findById(lineReq.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + lineReq.productId()));
            SalesOrderLine line = new SalesOrderLine();
            line.setSalesOrder(order);
            line.setProduct(product);
            line.setQuantity(lineReq.quantity());
            line.setUnitPrice(lineReq.unitPrice());
            line.setLineTotal(lineReq.unitPrice().multiply(lineReq.quantity()));
            order.getLines().add(line);
        }

        return toDto(salesOrderRepository.save(order));
    }

    private SalesOrderDto toDto(SalesOrder order) {
        var lineDtos = order.getLines().stream()
                .map(line -> new SalesOrderLineDto(
                        line.getId(),
                        line.getProduct().getId(),
                        line.getProduct().getName(),
                        line.getProduct().getCode(),
                        line.getQuantity(),
                        line.getUnitPrice(),
                        line.getLineTotal()))
                .toList();

        return new SalesOrderDto(order.getId(), order.getOrderNumber(),
                order.getCustomer().getId(), order.getCustomer().getName(),
                order.getOrderDate(), order.getStatus(), order.getDescription(), lineDtos);
    }
}
