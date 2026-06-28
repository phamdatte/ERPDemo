package com.phamdatte.erpdemo.accounting.repository;

import com.phamdatte.erpdemo.accounting.entity.ChartOfAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChartOfAccountRepository extends JpaRepository<ChartOfAccount, UUID> {
    Optional<ChartOfAccount> findByCode(String code);
    boolean existsByCode(String code);
}
