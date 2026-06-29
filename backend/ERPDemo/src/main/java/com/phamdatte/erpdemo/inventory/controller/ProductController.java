package com.phamdatte.erpdemo.inventory.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.dto.ProductCreateRequest;
import com.phamdatte.erpdemo.inventory.dto.ProductDto;
import com.phamdatte.erpdemo.inventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/inventory/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductDto>> list(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "20") int size,
                                                      @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(productService.list(page, size, keyword));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductDto> get(@PathVariable UUID id) {
        return ApiResponse.ok(productService.get(id));
    }

    @PostMapping
    public ApiResponse<ProductDto> create(@Valid @RequestBody ProductCreateRequest request) {
        return ApiResponse.ok(productService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductDto> update(@PathVariable UUID id, @Valid @RequestBody ProductCreateRequest request) {
        return ApiResponse.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ApiResponse.ok(null);
    }
}
