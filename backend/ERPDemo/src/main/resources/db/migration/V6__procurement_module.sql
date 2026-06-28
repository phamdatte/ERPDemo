-- V6: Procurement module — vendor, purchase_order, purchase_order_line
-- Table prefix: inv_

CREATE TABLE IF NOT EXISTS inv_vendor (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    code          VARCHAR(40) NOT NULL UNIQUE,
    name          VARCHAR(160) NOT NULL,
    contact_name  VARCHAR(120),
    phone         VARCHAR(30),
    email         VARCHAR(160),
    address       VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS inv_purchase_order (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    order_number    VARCHAR(40) NOT NULL UNIQUE,
    vendor_id       UUID NOT NULL REFERENCES inv_vendor(id),
    order_date      DATE NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    description     VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS inv_purchase_order_line (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    order_id        UUID NOT NULL REFERENCES inv_purchase_order(id),
    product_id      UUID NOT NULL REFERENCES inv_product(id),
    quantity        NUMERIC(14,2) NOT NULL,
    unit_price      NUMERIC(14,2) NOT NULL,
    line_total      NUMERIC(14,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inv_po_vendor ON inv_purchase_order(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inv_po_line_order ON inv_purchase_order_line(order_id);
CREATE INDEX IF NOT EXISTS idx_inv_po_line_product ON inv_purchase_order_line(product_id);
