-- V5: Inventory module — product, warehouse, stock_move
-- Table prefix: inv_

CREATE TABLE IF NOT EXISTS inv_warehouse (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    code          VARCHAR(40) NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    description   VARCHAR(255),
    address       VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS inv_product (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    code          VARCHAR(40) NOT NULL UNIQUE,
    name          VARCHAR(160) NOT NULL,
    description   VARCHAR(255),
    unit          VARCHAR(20),
    unit_price    NUMERIC(14,2)
);

CREATE TABLE IF NOT EXISTS inv_stock_move (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    product_id      UUID NOT NULL REFERENCES inv_product(id),
    warehouse_id    UUID NOT NULL REFERENCES inv_warehouse(id),
    move_type       VARCHAR(10) NOT NULL,
    quantity        NUMERIC(14,2) NOT NULL,
    note            VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_inv_move_product ON inv_stock_move(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_move_warehouse ON inv_stock_move(warehouse_id);

INSERT INTO inv_warehouse (id, created_at, code, name, description)
VALUES
    (gen_random_uuid(), NOW(), 'MAIN', 'Kho chính', 'Kho tổng mặc định')
ON CONFLICT (code) DO NOTHING;
