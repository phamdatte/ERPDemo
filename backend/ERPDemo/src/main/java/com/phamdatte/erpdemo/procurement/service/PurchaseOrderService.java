package com.phamdatte.erpdemo.procurement.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.entity.Product;
import com.phamdatte.erpdemo.inventory.repository.ProductRepository;
import com.phamdatte.erpdemo.procurement.dto.PurchaseOrderCreateRequest;
import com.phamdatte.erpdemo.procurement.dto.PurchaseOrderDto;
import com.phamdatte.erpdemo.procurement.dto.PurchaseOrderLineDto;
import com.phamdatte.erpdemo.procurement.entity.PurchaseOrder;
import com.phamdatte.erpdemo.procurement.entity.PurchaseOrderLine;
import com.phamdatte.erpdemo.procurement.entity.Vendor;
import com.phamdatte.erpdemo.procurement.repository.PurchaseOrderRepository;
import com.phamdatte.erpdemo.procurement.repository.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository,
                                VendorRepository vendorRepository,
                                ProductRepository productRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.vendorRepository = vendorRepository;
        this.productRepository = productRepository;
    }

    public PageResponse<PurchaseOrderDto> list(int page, int size) {
        Page<PurchaseOrder> result = purchaseOrderRepository.findAllWithVendor(PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public PurchaseOrderDto get(UUID id) {
        return toDto(purchaseOrderRepository.findWithLinesById(id)
                .orElseThrow(() -> new IllegalArgumentException("Purchase order not found: " + id)));
    }

    @Transactional
    public PurchaseOrderDto create(PurchaseOrderCreateRequest request) {
        Vendor vendor = vendorRepository.findById(request.vendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found: " + request.vendorId()));

        PurchaseOrder order = new PurchaseOrder();
        order.setOrderNumber(request.orderNumber());
        order.setVendor(vendor);
        order.setOrderDate(request.orderDate());
        order.setDescription(request.description());
        order.setStatus("DRAFT");

        for (var lineReq : request.lines()) {
            Product product = productRepository.findById(lineReq.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + lineReq.productId()));
            PurchaseOrderLine line = new PurchaseOrderLine();
            line.setPurchaseOrder(order);
            line.setProduct(product);
            line.setQuantity(lineReq.quantity());
            line.setUnitPrice(lineReq.unitPrice());
            line.setLineTotal(lineReq.unitPrice().multiply(lineReq.quantity()));
            order.getLines().add(line);
        }

        return toDto(purchaseOrderRepository.save(order));
    }

    private PurchaseOrderDto toDto(PurchaseOrder order) {
        var lineDtos = order.getLines().stream()
                .map(line -> new PurchaseOrderLineDto(
                        line.getId(),
                        line.getProduct().getId(),
                        line.getProduct().getName(),
                        line.getProduct().getCode(),
                        line.getQuantity(),
                        line.getUnitPrice(),
                        line.getLineTotal()))
                .toList();

        return new PurchaseOrderDto(order.getId(), order.getOrderNumber(),
                order.getVendor().getId(), order.getVendor().getName(),
                order.getOrderDate(), order.getStatus(), order.getDescription(), lineDtos);
    }
}
