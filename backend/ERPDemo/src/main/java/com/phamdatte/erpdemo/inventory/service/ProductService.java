package com.phamdatte.erpdemo.inventory.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.dto.ProductCreateRequest;
import com.phamdatte.erpdemo.inventory.dto.ProductDto;
import com.phamdatte.erpdemo.inventory.entity.Product;
import com.phamdatte.erpdemo.inventory.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public PageResponse<ProductDto> list(int page, int size, String keyword) {
        Page<Product> result = (keyword == null || keyword.isBlank())
                ? productRepository.findAll(PageRequest.of(page, size))
                : productRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public ProductDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public ProductDto create(ProductCreateRequest request) {
        Product product = new Product();
        product.setCode(request.code());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setUnit(request.unit());
        product.setUnitPrice(request.unitPrice());
        return toDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto update(UUID id, ProductCreateRequest request) {
        Product product = find(id);
        product.setCode(request.code());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setUnit(request.unit());
        product.setUnitPrice(request.unitPrice());
        return toDto(productRepository.save(product));
    }

    @Transactional
    public void delete(UUID id) {
        Product product = find(id);
        product.setDeleted(true);
        productRepository.save(product);
    }

    private Product find(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }

    private ProductDto toDto(Product product) {
        return new ProductDto(product.getId(), product.getCode(), product.getName(),
                product.getDescription(), product.getUnit(), product.getUnitPrice());
    }
}
