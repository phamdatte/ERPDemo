-- =============================================================================
-- V9__seed_data.sql — Demo seed data (idempotent: INSERT ... ON CONFLICT)
-- =============================================================================

-- =========================================================================
-- ADMIN — additional users (admin user already exists: 828ec506-...)
-- roles exist:
--   35481e0b-...  ROLE_ADMIN   Administrator
--   69c6bb64-...  ROLE_MANAGER Manager
--   1a75f507-...  ROLE_USER    User
-- =========================================================================
INSERT INTO adm_user (id, created_at, created_by, is_deleted, username, email, password_hash, full_name, active)
VALUES
  ('c0000000-0000-0000-0000-000000000099', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false,
      'manager', 'manager@phamdatte.com',
      '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2',
      'Nguyen Van Quan Ly', true),
  ('c0000000-0000-0000-0000-000000000098', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false,
      'accountant', 'accountant@phamdatte.com',
      '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2',
      'Tran Thi Ke Toan', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO adm_user_role (user_id, role_id) VALUES
  ('c0000000-0000-0000-0000-000000000099', '69c6bb64-04e9-4185-80de-de2474995dcd'),
  ('c0000000-0000-0000-0000-000000000098', '1a75f507-aed8-4aee-9771-9e9041701aa5')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- HR — Departments
-- =========================================================================
INSERT INTO hr_department (id, created_at, created_by, is_deleted, name, code, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Cong nghe thong tin',     'IT',    'Phat trien phan mem'),
  ('a0000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Nhan su',                  'HR',    'Tuyen dung & nhan su'),
  ('a0000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Kinh doanh',               'SALES', 'Ban hang'),
  ('a0000000-0000-0000-0000-000000000004', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Tai chinh Ke toan',        'FIN',   'Tai chinh')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- HR — Positions
-- =========================================================================
INSERT INTO hr_position (id, created_at, created_by, is_deleted, code, name, description) VALUES
  ('b0000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'POS_DEV',   'Lap trinh vien',       'Vi tri lap trinh vien'),
  ('b0000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'POS_PM',    'Quan ly du an',        'Vi tri quan ly du an'),
  ('b0000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'POS_HRM',   'Quan ly nhan su',      'Vi tri quan ly nhan su'),
  ('b0000000-0000-0000-0000-000000000004', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'POS_SALES', 'Nhan vien kinh doanh',  'Vi tri kinh doanh'),
  ('b0000000-0000-0000-0000-000000000005', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'POS_ACC',   'Ke toan vien',          'Vi tri ke toan')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- HR — Employees
-- =========================================================================
INSERT INTO hr_employee
  (id, created_at, created_by, is_deleted, employee_code, full_name, email, phone, department_id, position_id, status, hire_date, base_salary)
VALUES
  ('c0000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'NV001', 'Pham Van Dat',  'dat@phamdatte.com',  '0901001001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ACTIVE', '2023-01-15', 25000000),
  ('c0000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'NV002', 'Le Thi Hoa',    'hoa@phamdatte.com',  '0901001002', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'ACTIVE', '2022-06-01', 30000000),
  ('c0000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'NV003', 'Tran Van Minh', 'minh@phamdatte.com', '0901001003', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'ACTIVE', '2023-03-10', 18000000),
  ('c0000000-0000-0000-0000-000000000004', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'NV004', 'Hoang Thi Lan', 'lan@phamdatte.com',  '0901001004', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005', 'ACTIVE', '2021-09-20', 22000000),
  ('c0000000-0000-0000-0000-000000000005', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'NV005', 'Ngo Van Tuan',  'tuan@phamdatte.com', '0901001005', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'ACTIVE', '2020-04-05', 40000000)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- HR — Contracts
-- =========================================================================
INSERT INTO hr_contract (id, created_at, created_by, is_deleted, employee_id, contract_type, start_date, end_date, salary, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000001', 'PERMANENT',  '2023-01-15', null,         25000000, 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000002', 'PERMANENT',  '2022-06-01', null,         30000000, 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000003', 'FIXED_TERM', '2023-03-10', '2025-03-10', 18000000, 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000004', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000004', 'PERMANENT',  '2021-09-20', null,         22000000, 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000005', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000005', 'PERMANENT',  '2020-04-05', null,         40000000, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- HR — Attendance (last 5 working days for e1)
-- =========================================================================
INSERT INTO hr_attendance (id, created_at, created_by, is_deleted, employee_id, work_date, check_in, check_out, status, note) VALUES
  ('c2000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000001', (current_date - interval '4 days')::date, '08:00', '17:30', 'PRESENT', null),
  ('c2000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000001', (current_date - interval '3 days')::date, '08:05', '17:45', 'PRESENT', null),
  ('c2000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000001', (current_date - interval '2 days')::date, '07:55', '17:00', 'PRESENT', null),
  ('c2000000-0000-0000-0000-000000000004', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000001', (current_date - interval '1 day')::date, '08:30', '17:30', 'LATE',    null),
  ('c2000000-0000-0000-0000-000000000005', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'c0000000-0000-0000-0000-000000000001', current_date::date,                     '08:00', null,     'PRESENT', null)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- ACCOUNTING — Journal entries
-- =========================================================================
INSERT INTO acc_journal_entry (id, created_at, created_by, is_deleted, entry_number, entry_date, description, reference) VALUES
  ('d1000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'JE-2026-001', current_date - interval '10 days', 'Luong nhan vien thang 6', 'PAYROLL-06-2026'),
  ('d1000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'JE-2026-002', current_date - interval '5 days',  'Mua van phong pham',     'PO-2026-001'),
  ('d1000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'JE-2026-003', current_date - interval '2 days',  'Thu tien khach hang',    'SO-2026-001')
ON CONFLICT (id) DO NOTHING;

-- Journal lines (only when accounts 627/334 exist)
INSERT INTO acc_journal_line (id, created_at, created_by, is_deleted, journal_entry_id, account_id, description, debit, credit)
SELECT 'd2000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'd1000000-0000-0000-0000-000000000001', id, 'Chi luong nhan vien', 100000000, 0
FROM acc_chart_of_account WHERE code = '627' AND is_deleted = false
ON CONFLICT (id) DO NOTHING;

INSERT INTO acc_journal_line (id, created_at, created_by, is_deleted, journal_entry_id, account_id, description, debit, credit)
SELECT 'd2000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'd1000000-0000-0000-0000-000000000001', id, 'Phai tra nhan vien', 0, 100000000
FROM acc_chart_of_account WHERE code = '334' AND is_deleted = false
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- INVENTORY — Warehouses (second)
-- =========================================================================
INSERT INTO inv_warehouse (id, created_at, created_by, is_deleted, code, name, description, address) VALUES
  ('d0000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'MAIN-HN', 'Kho mien Bac', 'Kho tong khu vuc Ha Noi', '45 Tran Duy Hung, Cau Giay, Ha Noi')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- INVENTORY — Products
-- =========================================================================
INSERT INTO inv_product (id, created_at, created_by, is_deleted, name, code, unit, unit_price) VALUES
  ('e0000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Laptop Dell Inspiron 15', 'PRD-001', 'Cai', 18500000),
  ('e0000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Chuot Logitech M330',     'PRD-002', 'Cai', 450000),
  ('e0000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Ban phim co Keychron K2', 'PRD-003', 'Cai', 2200000),
  ('e0000000-0000-0000-0000-000000000004', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'Man hinh LG 27" 4K',      'PRD-004', 'Cai', 9500000),
  ('e0000000-0000-0000-0000-000000000005', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'O cung SSD 1TB',          'PRD-005', 'Cai', 1800000)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- INVENTORY — Stock moves (use existing warehouse 291b4a52-...)
-- =========================================================================
INSERT INTO inv_stock_move (id, created_at, created_by, is_deleted, product_id, warehouse_id, move_type, quantity, note) VALUES
  ('e1000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'e0000000-0000-0000-0000-000000000001', '291b4a52-84da-4eb2-95e8-fde1523bf12d', 'IN',  30,  'Nhap hang lo dau'),
  ('e1000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'e0000000-0000-0000-0000-000000000001', '291b4a52-84da-4eb2-95e8-fde1523bf12d', 'OUT', 5,   'Xuat ban cho khach'),
  ('e1000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'e0000000-0000-0000-0000-000000000002', '291b4a52-84da-4eb2-95e8-fde1523bf12d', 'IN',  200, 'Nhap hang phu kien'),
  ('e1000000-0000-0000-0000-000000000004', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'e0000000-0000-0000-0000-000000000002', '291b4a52-84da-4eb2-95e8-fde1523bf12d', 'OUT', 50,  'Xuat ban'),
  ('e1000000-0000-0000-0000-000000000005', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'e0000000-0000-0000-0000-000000000005', '291b4a52-84da-4eb2-95e8-fde1523bf12d', 'IN',  200, 'Nhap SSD moi')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- PROCUREMENT — Vendors
-- =========================================================================
INSERT INTO inv_vendor (id, created_at, created_by, is_deleted, code, name, contact_name, phone, email, address) VALUES
  ('f0000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'VEND-DELL', 'Cong ty TNHH Dell VN',          'Mr. Hung',  '02838200001', 'sales@dell.vn',          'Q.7, TP.HCM'),
  ('f0000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'VEND-LOG',  'Logitech Vietnam',               'Ms. Mai',   '02838200002', 'vn@logitech.com',        'Q.1, TP.HCM'),
  ('f0000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'VEND-KC',   'Cong ty phan phoi Keychron VN', 'Mr. Binh',  '02838200003', 'info@keychron.vn',       'Q.Binh Thanh, TP.HCM')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- PROCUREMENT — Purchase orders
-- =========================================================================
INSERT INTO inv_purchase_order (id, created_at, created_by, is_deleted, order_number, vendor_id, order_date, status, description) VALUES
  ('f1000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'PO-2026-001', 'f0000000-0000-0000-0000-000000000001', current_date - interval '15 days', 'RECEIVED', 'Dat mua 30 laptop Dell'),
  ('f1000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'PO-2026-002', 'f0000000-0000-0000-0000-000000000002', current_date - interval '10 days', 'RECEIVED', 'Dat mua 200 chuot Logitech'),
  ('f1000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'PO-2026-003', 'f0000000-0000-0000-0000-000000000003', current_date - interval '2 days',  'APPROVED', 'Dat mua 100 ban phim Keychron')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inv_purchase_order_line (id, created_at, created_by, is_deleted, order_id, product_id, quantity, unit_price, line_total) VALUES
  ('f2000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'f1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 30,  17000000, 510000000),
  ('f2000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'f1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 200, 350000,   70000000),
  ('f2000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'f1000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 100, 1800000,  180000000)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SALES — Customers
-- =========================================================================
INSERT INTO sale_customer (id, created_at, created_by, is_deleted, code, name, contact_name, phone, email, address) VALUES
  ('f1000000-0000-0000-0001-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'CUST-ABC', 'Cong ty ABC',       'Mr. An',    '0909123001', 'an@abc.com',       'Q.1, TP.HCM'),
  ('f1000000-0000-0000-0001-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'CUST-XYZ', 'Cong ty XYZ',       'Ms. Binh',  '0909123002', 'binh@xyz.com',     'Q.3, TP.HCM'),
  ('f1000000-0000-0000-0001-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'CUST-VT',  'Cong ty Viet Tien', 'Mr. Cuong', '0909123003', 'cuong@viettien.com', 'Q.Go Vap, TP.HCM')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SALES — Sales orders
-- =========================================================================
INSERT INTO sale_sales_order (id, created_at, created_by, is_deleted, order_number, customer_id, order_date, status, description) VALUES
  ('f3000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'SO-2026-001', 'f1000000-0000-0000-0001-000000000001', current_date - interval '12 days', 'DELIVERED', 'Ban 5 laptop cho ABC'),
  ('f3000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'SO-2026-002', 'f1000000-0000-0000-0001-000000000002', current_date - interval '7 days',  'CONFIRMED', 'Ban 20 chuot cho XYZ'),
  ('f3000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'SO-2026-003', 'f1000000-0000-0000-0001-000000000003', current_date - interval '1 day',   'DRAFT',     'Ban 10 man hinh cho Viet Tien')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sale_sales_order_line (id, created_at, created_by, is_deleted, order_id, product_id, quantity, unit_price, line_total) VALUES
  ('f4000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'f3000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 5,  18500000, 92500000),
  ('f4000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'f3000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 20, 450000,   9000000),
  ('f4000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'f3000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000004', 10, 9500000,  95000000)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SALES — Invoices
-- =========================================================================
INSERT INTO sale_invoice (id, created_at, created_by, is_deleted, invoice_number, customer_id, order_id, invoice_date, status, total_amount) VALUES
  ('f5000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'INV-2026-001', 'f1000000-0000-0000-0001-000000000001', 'f3000000-0000-0000-0000-000000000001', current_date - interval '10 days', 'PAID',   92500000),
  ('f5000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'INV-2026-002', 'f1000000-0000-0000-0001-000000000002', 'f3000000-0000-0000-0000-000000000002', current_date - interval '5 days',  'UNPAID', 9000000)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- MANUFACTURING — Bill of materials
-- =========================================================================
INSERT INTO mfg_bill_of_material (id, created_at, created_by, is_deleted, code, product_id, description) VALUES
  ('a7000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'BOM-LAPTOP-001', 'e0000000-0000-0000-0000-000000000001', 'Dinh muc lap rap Laptop'),
  ('a7000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'BOM-KB-001',     'e0000000-0000-0000-0000-000000000003', 'Dinh muc lap rap ban phim')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mfg_bom_line (id, created_at, created_by, is_deleted, bom_id, product_id, quantity) VALUES
  ('a8000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'a7000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 1),
  ('a8000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'a7000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 1),
  ('a8000000-0000-0000-0000-000000000003', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'a7000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 1)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- MANUFACTURING — Work orders
-- =========================================================================
INSERT INTO mfg_work_order (id, created_at, created_by, is_deleted, order_number, bom_id, warehouse_id, quantity, start_date, end_date, status, description) VALUES
  ('a9000000-0000-0000-0000-000000000001', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'WO-2026-001', 'a7000000-0000-0000-0000-000000000001', '291b4a52-84da-4eb2-95e8-fde1523bf12d', 10, current_date - interval '5 days',  current_date - interval '2 days',  'COMPLETED',   'Lap rap 10 laptop'),
  ('a9000000-0000-0000-0000-000000000002', now(), '828ec506-25db-470f-b1a8-c86d903a54b2', false, 'WO-2026-002', 'a7000000-0000-0000-0000-000000000002', '291b4a52-84da-4eb2-95e8-fde1523bf12d', 50, current_date - interval '1 day',  current_date + interval '3 days',  'IN_PROGRESS', 'Lap rap 50 ban phim')
ON CONFLICT (id) DO NOTHING;
