package com.phamdatte.erpdemo.inventory.repository;

import com.phamdatte.erpdemo.inventory.entity.StockMove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StockMoveRepository extends JpaRepository<StockMove, UUID> {
}
