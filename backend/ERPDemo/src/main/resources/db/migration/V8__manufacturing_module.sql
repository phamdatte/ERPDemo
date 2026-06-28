-- V8: Manufacturing module — bill_of_material, bom_line, work_order
-- Table prefix: mfg_

CREATE TABLE IF NOT EXISTS mfg_bill_of_material (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    code            VARCHAR(40) NOT NULL UNIQUE,
    product_id      UUID NOT NULL REFERENCES inv_product(id),
    description     VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS mfg_bom_line (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    bom_id          UUID NOT NULL REFERENCES mfg_bill_of_material(id),
    product_id      UUID NOT NULL REFERENCES inv_product(id),
    quantity        NUMERIC(14,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS mfg_work_order (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    order_number    VARCHAR(40) NOT NULL UNIQUE,
    bom_id          UUID REFERENCES mfg_bill_of_material(id),
    warehouse_id    UUID REFERENCES inv_warehouse(id),
    quantity        NUMERIC(14,2) NOT NULL,
    start_date      DATE,
    end_date        DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    description     VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_mfg_bom_product ON mfg_bill_of_material(product_id);
CREATE INDEX IF NOT EXISTS idx_mfg_bom_line_bom ON mfg_bom_line(bom_id);
CREATE INDEX IF NOT EXISTS idx_mfg_bom_line_product ON mfg_bom_line(product_id);
CREATE INDEX IF NOT EXISTS idx_mfg_wo_bom ON mfg_work_order(bom_id);
CREATE INDEX IF NOT EXISTS idx_mfg_wo_warehouse ON mfg_work_order(warehouse_id);
