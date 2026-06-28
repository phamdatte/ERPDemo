package com.phamdatte.erpdemo.accounting.repository;

import com.phamdatte.erpdemo.accounting.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, UUID> {
    Optional<JournalEntry> findByEntryNumber(String entryNumber);
    boolean existsByEntryNumber(String entryNumber);
}
