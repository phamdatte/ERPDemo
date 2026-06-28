-- V3: HR module — department, position, employee, contract, attendance
-- Table prefix: hr_

CREATE TABLE IF NOT EXISTS hr_department (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    code          VARCHAR(40) NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    description   VARCHAR(255),
    parent_id     UUID REFERENCES hr_department(id),
    manager_id    UUID
);

CREATE TABLE IF NOT EXISTS hr_position (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    code          VARCHAR(40) NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    description   VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS hr_employee (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    employee_code   VARCHAR(40) NOT NULL UNIQUE,
    full_name       VARCHAR(160) NOT NULL,
    email           VARCHAR(160),
    phone           VARCHAR(30),
    gender          VARCHAR(10),
    date_of_birth   DATE,
    hire_date       DATE NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    department_id   UUID REFERENCES hr_department(id),
    position_id     UUID REFERENCES hr_position(id),
    base_salary     NUMERIC(14,2)
);

CREATE TABLE IF NOT EXISTS hr_contract (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    employee_id     UUID NOT NULL REFERENCES hr_employee(id),
    contract_type   VARCHAR(40) NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE,
    salary          NUMERIC(14,2),
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS hr_attendance (
    id              UUID PRIMARY KEY,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE,
    created_by      VARCHAR(120),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    employee_id     UUID NOT NULL REFERENCES hr_employee(id),
    work_date       DATE NOT NULL,
    check_in        TIME,
    check_out       TIME,
    status          VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    note            VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_hr_employee_department ON hr_employee(department_id);
CREATE INDEX IF NOT EXISTS idx_hr_employee_position ON hr_employee(position_id);
CREATE INDEX IF NOT EXISTS idx_hr_contract_employee ON hr_contract(employee_id);
CREATE INDEX IF NOT EXISTS idx_hr_attendance_employee ON hr_attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_hr_attendance_date ON hr_attendance(work_date);
