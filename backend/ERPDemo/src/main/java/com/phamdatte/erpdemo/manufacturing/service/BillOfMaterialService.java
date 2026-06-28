package com.phamdatte.erpdemo.manufacturing.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.entity.Product;
import com.phamdatte.erpdemo.inventory.repository.ProductRepository;
import com.phamdatte.erpdemo.manufacturing.dto.BillOfMaterialCreateRequest;
import com.phamdatte.erpdemo.manufacturing.dto.BillOfMaterialDto;
import com.phamdatte.erpdemo.manufacturing.dto.BomLineDto;
import com.phamdatte.erpdemo.manufacturing.entity.BillOfMaterial;
import com.phamdatte.erpdemo.manufacturing.entity.BomLine;
import com.phamdatte.erpdemo.manufacturing.repository.BillOfMaterialRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class BillOfMaterialService {

    private final BillOfMaterialRepository billOfMaterialRepository;
    private final ProductRepository productRepository;

    public BillOfMaterialService(BillOfMaterialRepository billOfMaterialRepository,
                                  ProductRepository productRepository) {
        this.billOfMaterialRepository = billOfMaterialRepository;
        this.productRepository = productRepository;
    }

    public PageResponse<BillOfMaterialDto> list(int page, int size) {
        Page<BillOfMaterial> result = billOfMaterialRepository.findAllWithProduct(PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public BillOfMaterialDto get(UUID id) {
        return toDto(billOfMaterialRepository.findWithLinesById(id)
                .orElseThrow(() -> new IllegalArgumentException("BOM not found: " + id)));
    }

    @Transactional
    public BillOfMaterialDto create(BillOfMaterialCreateRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + request.productId()));

        BillOfMaterial bom = new BillOfMaterial();
        bom.setCode(request.code());
        bom.setProduct(product);
        bom.setDescription(request.description());

        for (var lineReq : request.lines()) {
            Product lineProduct = productRepository.findById(lineReq.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + lineReq.productId()));
            BomLine line = new BomLine();
            line.setBillOfMaterial(bom);
            line.setProduct(lineProduct);
            line.setQuantity(lineReq.quantity());
            bom.getLines().add(line);
        }

        return toDto(billOfMaterialRepository.save(bom));
    }

    private BillOfMaterialDto toDto(BillOfMaterial bom) {
        var lineDtos = bom.getLines().stream()
                .map(line -> new BomLineDto(
                        line.getId(),
                        line.getProduct().getId(),
                        line.getProduct().getName(),
                        line.getProduct().getCode(),
                        line.getQuantity()))
                .toList();

        return new BillOfMaterialDto(bom.getId(), bom.getCode(),
                bom.getProduct().getId(), bom.getProduct().getName(),
                bom.getDescription(), lineDtos);
    }
}
