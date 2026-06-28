package com.phamdatte.erpdemo.inventory.service;

import com.phamdatte.erpdemo.common.dto.PageResponse;
import com.phamdatte.erpdemo.inventory.dto.StockMoveCreateRequest;
import com.phamdatte.erpdemo.inventory.dto.StockMoveDto;
import com.phamdatte.erpdemo.inventory.entity.StockMove;
import com.phamdatte.erpdemo.inventory.repository.ProductRepository;
import com.phamdatte.erpdemo.inventory.repository.StockMoveRepository;
import com.phamdatte.erpdemo.inventory.repository.WarehouseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class StockMoveService {

    private final StockMoveRepository stockMoveRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public StockMoveService(StockMoveRepository stockMoveRepository,
                            ProductRepository productRepository,
                            WarehouseRepository warehouseRepository) {
        this.stockMoveRepository = stockMoveRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    public PageResponse<StockMoveDto> list(int page, int size) {
        Page<StockMove> result = stockMoveRepository.findAll(PageRequest.of(page, size));
        return PageResponse.of(result.map(this::toDto));
    }

    public StockMoveDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public StockMoveDto create(StockMoveCreateRequest request) {
        var product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + request.productId()));
        var warehouse = warehouseRepository.findById(request.warehouseId())
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found: " + request.warehouseId()));

        StockMove move = new StockMove();
        move.setProduct(product);
        move.setWarehouse(warehouse);
        move.setMoveType(request.moveType());
        move.setQuantity(request.quantity());
        move.setNote(request.note());
        return toDto(stockMoveRepository.save(move));
    }

    private StockMove find(UUID id) {
        return stockMoveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stock move not found: " + id));
    }

    private StockMoveDto toDto(StockMove move) {
        return new StockMoveDto(move.getId(),
                move.getProduct().getId(), move.getProduct().getName(), move.getProduct().getCode(),
                move.getWarehouse().getId(), move.getWarehouse().getName(),
                move.getMoveType(), move.getQuantity(), move.getNote());
    }
}
