-- V4: Accounting module — chart of accounts, journal entries, journal lines
-- Table prefix: acc_

CREATE TABLE IF NOT EXISTS acc_chart_of_account (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    code          VARCHAR(20) NOT NULL UNIQUE,
    name          VARCHAR(160) NOT NULL,
    type          VARCHAR(20) NOT NULL,
    parent_id     UUID REFERENCES acc_chart_of_account(id),
    description   VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS acc_journal_entry (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    entry_number  VARCHAR(40) NOT NULL UNIQUE,
    entry_date    DATE NOT NULL,
    description   VARCHAR(255),
    reference     VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS acc_journal_line (
    id                UUID PRIMARY KEY,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE,
    created_by        VARCHAR(120),
    is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
    journal_entry_id  UUID NOT NULL REFERENCES acc_journal_entry(id),
    account_id        UUID NOT NULL REFERENCES acc_chart_of_account(id),
    description       VARCHAR(255),
    debit             NUMERIC(14,2) NOT NULL DEFAULT 0,
    credit            NUMERIC(14,2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_acc_coa_parent ON acc_chart_of_account(parent_id);
CREATE INDEX IF NOT EXISTS idx_acc_line_entry ON acc_journal_line(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_acc_line_account ON acc_journal_line(account_id);

-- Seed a minimal chart of accounts
INSERT INTO acc_chart_of_account (id, created_at, code, name, type, description)
VALUES
    (gen_random_uuid(), NOW(), '1000', 'Tiền mặt', 'ASSET', 'Tiền mặt và tương đương tiền'),
    (gen_random_uuid(), NOW(), '1100', 'Tiều khoản ngân hàng', 'ASSET', 'Tiều khoản tại ngân hàng'),
    (gen_random_uuid(), NOW(), '1200', 'Phải thu khách hàng', 'ASSET', 'Công nợ khách hàng'),
    (gen_random_uuid(), NOW(), '1300', 'Hàng tồn kho', 'ASSET', 'Hàng hóa tồn kho'),
    (gen_random_uuid(), NOW(), '2000', 'Phải trả nhà cung cấp', 'LIABILITY', 'Công nợ nhà cung cấp'),
    (gen_random_uuid(), NOW(), '3000', 'Vốn chủ sở hữu', 'EQUITY', 'Vốn góp và lợi nhuân giữ lại'),
    (gen_random_uuid(), NOW(), '4000', 'Doanh thu', 'REVENUE', 'Doanh thu bán hàng và cung cấp dịch vụ'),
    (gen_random_uuid(), NOW(), '5000', 'Chi phí', 'EXPENSE', 'Chi phí hoạt động')
ON CONFLICT (code) DO NOTHING;
