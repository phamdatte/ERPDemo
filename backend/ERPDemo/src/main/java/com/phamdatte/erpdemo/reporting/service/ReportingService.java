package com.phamdatte.erpdemo.reporting.service;

import com.phamdatte.erpdemo.reporting.dto.DashboardStatDto;
import com.phamdatte.erpdemo.reporting.dto.HeadcountDto;
import com.phamdatte.erpdemo.reporting.dto.InventoryTurnoverDto;
import com.phamdatte.erpdemo.reporting.dto.MonthlyRevenueDto;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Reporting service — dùng native query để tổng hợp dữ liệu từ nhiều module.
 * DTO là concrete class (không interface projection) để tránh proxy & checked-exception issues.
 */
@Service
public class ReportingService {

    private final NamedParameterJdbcTemplate jdbc;

    public ReportingService(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // ---- Dashboard stats ----

    private record DashboardRow(String module, String label, Long count, BigDecimal amount, String icon) {}

    public List<DashboardStatDto> dashboardStats() {
        String sql = """
            SELECT 'HR' AS module, 'Nhân viên' AS label,
                   COUNT(*) AS count,
                   COALESCE(SUM(base_salary), 0) AS amount,
                   'users' AS icon
            FROM hr_employee WHERE is_deleted = false
            UNION ALL
            SELECT 'SALE', 'Đơn bán',
                   COUNT(*),
                   COALESCE(SUM(total_amount), 0),
                   'shopping-cart'
            FROM sale_sales_order WHERE is_deleted = false
            UNION ALL
            SELECT 'INVENTORY', 'Sản phẩm',
                   COUNT(*),
                   COALESCE(SUM(unit_price), 0),
                   'boxes'
            FROM inv_product WHERE is_deleted = false
            UNION ALL
            SELECT 'ACCOUNTING', 'Bút toán',
                   COUNT(*),
                   COALESCE(SUM(debit), 0),
                   'book-open'
            FROM acc_journal_line jl
            JOIN acc_journal_entry je ON je.id = jl.journal_entry_id
            WHERE je.is_deleted = false AND jl.is_deleted = false
            UNION ALL
            SELECT 'PROCUREMENT', 'Nhà cung cấp',
                   COUNT(*),
                   0,
                   'truck'
            FROM inv_vendor WHERE is_deleted = false
            UNION ALL
            SELECT 'MANUFACTURING', 'Lệnh sản xuất',
                   COUNT(*),
                   COALESCE(SUM(quantity), 0),
                   'settings'
            FROM mfg_work_order WHERE is_deleted = false
            """;

        return jdbc.query(sql, (RowMapper<DashboardRow>) (rs, n) -> new DashboardRow(
                rs.getString("module"),
                rs.getString("label"),
                rs.getLong("count"),
                rs.getBigDecimal("amount"),
                rs.getString("icon")
        )).stream().map(r -> new DashboardStatDto(r.module, r.label, r.count, r.amount, r.icon)).toList();
    }

    // ---- Revenue by month ----

    private record RevenueRow(int year, int month, long invoiceCount, BigDecimal totalAmount, BigDecimal paidAmount) {}

    public List<MonthlyRevenueDto> revenueByMonth(int year) {
        String sql = """
            SELECT EXTRACT(YEAR FROM invoice_date)::int AS year,
                   EXTRACT(MONTH FROM invoice_date)::int AS month,
                   COUNT(*) AS invoice_count,
                   COALESCE(SUM(total_amount), 0) AS total_amount,
                   COALESCE(SUM(CASE WHEN status = 'PAID' THEN total_amount ELSE 0 END), 0) AS paid_amount
            FROM sale_invoice
            WHERE is_deleted = false
              AND EXTRACT(YEAR FROM invoice_date) = :year
            GROUP BY EXTRACT(YEAR FROM invoice_date), EXTRACT(MONTH FROM invoice_date)
            ORDER BY month
            """;

        Map<String, Object> params = new HashMap<>();
        params.put("year", year);

        return jdbc.query(sql, params, (RowMapper<RevenueRow>) (rs, n) -> new RevenueRow(
                rs.getInt("year"),
                rs.getInt("month"),
                rs.getLong("invoice_count"),
                rs.getBigDecimal("total_amount"),
                rs.getBigDecimal("paid_amount")
        )).stream().map(r -> new MonthlyRevenueDto(r.year, r.month, r.invoiceCount, r.totalAmount, r.paidAmount)).toList();
    }

    // ---- Headcount by department ----

    private record HeadcountRow(UUID departmentId, String departmentCode, String departmentName,
                                long employeeCount, long activeEmployees, BigDecimal totalSalary) {}

    public List<HeadcountDto> headcountByDepartment() {
        String sql = """
            SELECT d.id AS department_id,
                   d.code AS department_code,
                   d.name AS department_name,
                   COUNT(e.id) AS employee_count,
                   COUNT(CASE WHEN e.status = 'ACTIVE' THEN 1 END) AS active_employees,
                   COALESCE(SUM(e.base_salary), 0) AS total_salary
            FROM hr_department d
            LEFT JOIN hr_employee e ON e.department_id = d.id AND e.is_deleted = false
            WHERE d.is_deleted = false
            GROUP BY d.id, d.code, d.name
            ORDER BY employee_count DESC
            """;

        return jdbc.query(sql, (RowMapper<HeadcountRow>) (rs, n) -> new HeadcountRow(
                rs.getObject("department_id", UUID.class),
                rs.getString("department_code"),
                rs.getString("department_name"),
                rs.getLong("employee_count"),
                rs.getLong("active_employees"),
                rs.getBigDecimal("total_salary")
        )).stream().map(r -> new HeadcountDto(r.departmentId, r.departmentCode, r.departmentName,
                r.employeeCount, r.activeEmployees, r.totalSalary)).toList();
    }

    // ---- Inventory by product ----

    private record InventoryRow(UUID productId, String productCode, String productName, String unit,
                                String warehouseName, BigDecimal stockIn, BigDecimal stockOut) {}

    public List<InventoryTurnoverDto> inventoryByProduct() {
        String sql = """
            SELECT p.id AS product_id,
                   p.code AS product_code,
                   p.name AS product_name,
                   p.unit,
                   w.name AS warehouse_name,
                   COALESCE(SUM(CASE WHEN sm.move_type = 'IN' THEN sm.quantity ELSE 0 END), 0) AS stock_in,
                   COALESCE(SUM(CASE WHEN sm.move_type = 'OUT' THEN sm.quantity ELSE 0 END), 0) AS stock_out
            FROM inv_product p
            CROSS JOIN inv_warehouse w
            LEFT JOIN inv_stock_move sm ON sm.product_id = p.id AND sm.warehouse_id = w.id AND sm.is_deleted = false
            WHERE p.is_deleted = false AND w.is_deleted = false
            GROUP BY p.id, p.code, p.name, p.unit, w.name
            ORDER BY p.code, w.code
            """;

        return jdbc.query(sql, (RowMapper<InventoryRow>) (rs, n) -> new InventoryRow(
                rs.getObject("product_id", UUID.class),
                rs.getString("product_code"),
                rs.getString("product_name"),
                rs.getString("unit"),
                rs.getString("warehouse_name"),
                rs.getBigDecimal("stock_in"),
                rs.getBigDecimal("stock_out")
        )).stream().map(r -> new InventoryTurnoverDto(r.productId, r.productCode, r.productName, r.unit,
                r.warehouseName, r.stockIn, r.stockOut)).toList();
    }
}
