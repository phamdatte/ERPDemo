-- V7: Sales module — customer, sales_order, sales_order_line, invoice
-- Table prefix: sale_

CREATE TABLE IF NOT EXISTS sale_customer (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    code            VARCHAR(40) NOT NULL UNIQUE,
    name            VARCHAR(160) NOT NULL,
    contact_name    VARCHAR(120),
    phone           VARCHAR(30),
    email           VARCHAR(160),
    address         VARCHAR(255),
    tax_code        VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS sale_sales_order (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    order_number    VARCHAR(40) NOT NULL UNIQUE,
    customer_id     UUID NOT NULL REFERENCES sale_customer(id),
    order_date      DATE NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    description     VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS sale_sales_order_line (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    order_id        UUID NOT NULL REFERENCES sale_sales_order(id),
    product_id      UUID NOT NULL REFERENCES inv_product(id),
    quantity        NUMERIC(14,2) NOT NULL,
    unit_price      NUMERIC(14,2) NOT NULL,
    line_total      NUMERIC(14,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_invoice (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    invoice_number  VARCHAR(40) NOT NULL UNIQUE,
    customer_id     UUID NOT NULL REFERENCES sale_customer(id),
    order_id        UUID REFERENCES sale_sales_order(id),
    invoice_date    DATE NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    total_amount    NUMERIC(14,2) NOT NULL,
    description     VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_sale_so_customer ON sale_sales_order(customer_id);
CREATE INDEX IF NOT EXISTS idx_sale_so_line_order ON sale_sales_order_line(order_id);
CREATE INDEX IF NOT EXISTS idx_sale_so_line_product ON sale_sales_order_line(product_id);
CREATE INDEX IF NOT EXISTS idx_sale_inv_customer ON sale_invoice(customer_id);
CREATE INDEX IF NOT EXISTS idx_sale_inv_order ON sale_invoice(order_id);
