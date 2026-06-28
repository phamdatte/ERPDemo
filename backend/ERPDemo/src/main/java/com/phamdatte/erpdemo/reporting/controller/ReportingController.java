package com.phamdatte.erpdemo.reporting.controller;

import com.phamdatte.erpdemo.common.dto.ApiResponse;
import com.phamdatte.erpdemo.reporting.dto.DashboardStatDto;
import com.phamdatte.erpdemo.reporting.dto.HeadcountDto;
import com.phamdatte.erpdemo.reporting.dto.InventoryTurnoverDto;
import com.phamdatte.erpdemo.reporting.dto.MonthlyRevenueDto;
import com.phamdatte.erpdemo.reporting.service.ExcelExportService.ColumnDef;
import com.phamdatte.erpdemo.reporting.service.ExcelExportService;
import com.phamdatte.erpdemo.reporting.service.ReportingService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Reporting & Dashboard API.
 * <p>
 * Endpoints:
 * <ul>
 *   <li>GET /api/v1/reporting/dashboard  — stat cards tổng hợp</li>
 *   <li>GET /api/v1/reporting/revenue-by-month?year=2026</li>
 *   <li>GET /api/v1/reporting/headcount</li>
 *   <li>GET /api/v1/reporting/inventory</li>
 *   <li>GET /api/v1/reporting/export/{module} — Excel export cho module</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/reporting")
public class ReportingController {

    private static final MediaType XLSX_TYPE = MediaType.parseMediaType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    private final ReportingService reportingService;
    private final ExcelExportService excelExportService;

    public ReportingController(ReportingService reportingService, ExcelExportService excelExportService) {
        this.reportingService = reportingService;
        this.excelExportService = excelExportService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<List<DashboardStatDto>> dashboard() {
        return ApiResponse.ok(reportingService.dashboardStats());
    }

    @GetMapping("/revenue-by-month")
    public ApiResponse<List<MonthlyRevenueDto>> revenueByMonth(@RequestParam(defaultValue = "2026") int year) {
        return ApiResponse.ok(reportingService.revenueByMonth(year));
    }

    @GetMapping("/headcount")
    public ApiResponse<List<HeadcountDto>> headcount() {
        return ApiResponse.ok(reportingService.headcountByDepartment());
    }

    @GetMapping("/inventory")
    public ApiResponse<List<InventoryTurnoverDto>> inventory() {
        return ApiResponse.ok(reportingService.inventoryByProduct());
    }

    /**
     * Excel export theo module: hr, sales, inventory, accounting, procurement.
     */
    @GetMapping("/export/{module}")
    public ResponseEntity<byte[]> exportExcel(@PathVariable String module) throws Exception {
        String filename = URLEncoder.encode("export_" + module + ".xlsx", StandardCharsets.UTF_8).replace("+", "%20");

        byte[] body;
        switch (module.toLowerCase()) {
            case "hr" -> body = exportHr();
            case "sales" -> body = exportSales();
            case "inventory" -> body = exportInventory();
            case "accounting" -> body = exportAccounting();
            case "procurement" -> body = exportProcurement();
            default -> throw new IllegalArgumentException("Unknown module: " + module);
        }

        return ResponseEntity.ok()
                .contentType(XLSX_TYPE)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(body);
    }

    // --- Module exports ---

    private byte[] exportHr() throws Exception {
        return excelExportService.exportToExcel("Hanh chinh nhan su",
                List.of(
                        new ColumnDef("Ma NV", "employee_code"),
                        new ColumnDef("Ho ten", "full_name"),
                        new ColumnDef("Phong ban", "department_name"),
                        new ColumnDef("Email", "email"),
                        new ColumnDef("SDT", "phone"),
                        new ColumnDef("Ngay vao lam", "hire_date"),
                        new ColumnDef("Luong co ban", "base_salary")
                ),
                """
                SELECT e.employee_code, e.full_name, d.name AS department_name,
                       e.email, e.phone, e.hire_date, e.base_salary
                FROM hr_employee e
                LEFT JOIN hr_department d ON d.id = e.department_id
                WHERE e.is_deleted = false
                ORDER BY e.employee_code
                """,
                new HashMap<>());
    }

    private byte[] exportSales() throws Exception {
        return excelExportService.exportToExcel("Doanh thu ban hang",
                List.of(
                        new ColumnDef("So don", "order_number"),
                        new ColumnDef("Khach hang", "customer_name"),
                        new ColumnDef("Ngay", "order_date"),
                        new ColumnDef("Trang thai", "status"),
                        new ColumnDef("Tong tien", "total_amount")
                ),
                """
                SELECT so.order_number, c.name AS customer_name, so.order_date, so.status,
                       COALESCE(SUM(sol.line_total), 0) AS total_amount
                FROM sale_sales_order so
                JOIN sale_customer c ON c.id = so.customer_id
                LEFT JOIN sale_sales_order_line sol ON sol.order_id = so.id
                WHERE so.is_deleted = false
                GROUP BY so.id, so.order_number, c.name, so.order_date, so.status
                ORDER BY so.order_date DESC, so.order_number
                """,
                new HashMap<>());
    }

    private byte[] exportInventory() throws Exception {
        return excelExportService.exportToExcel("San pham ton kho",
                List.of(
                        new ColumnDef("Ma SP", "code"),
                        new ColumnDef("Ten san pham", "name"),
                        new ColumnDef("Don vi", "unit"),
                        new ColumnDef("Don gia", "unit_price"),
                        new ColumnDef("Nha cung cap", "vendor_code")
                ),
                """
                SELECT p.code, p.name, p.unit, p.unit_price, v.code AS vendor_code
                FROM inv_product p
                LEFT JOIN inv_vendor v ON v.id = p.id
                WHERE p.is_deleted = false
                ORDER BY p.code
                """,
                new HashMap<>());
    }

    private byte[] exportAccounting() throws Exception {
        return excelExportService.exportToExcel("But toan ke toan",
                List.of(
                        new ColumnDef("So but toan", "entry_number"),
                        new ColumnDef("Ngay", "entry_date"),
                        new ColumnDef("No", "debit"),
                        new ColumnDef("Co", "credit"),
                        new ColumnDef("Tai khoan", "account_code"),
                        new ColumnDef("Mo ta", "description")
                ),
                """
                SELECT je.entry_number, je.entry_date,
                       jl.debit, jl.credit,
                       coa.code AS account_code,
                       jl.description
                FROM acc_journal_line jl
                JOIN acc_journal_entry je ON je.id = jl.journal_entry_id
                JOIN acc_chart_of_account coa ON coa.id = jl.account_id
                WHERE je.is_deleted = false AND jl.is_deleted = false
                ORDER BY je.entry_date DESC, je.entry_number
                """,
                new HashMap<>());
    }

    private byte[] exportProcurement() throws Exception {
        return excelExportService.exportToExcel("Don dat mua",
                List.of(
                        new ColumnDef("So don", "order_number"),
                        new ColumnDef("Nha cung cap", "vendor_name"),
                        new ColumnDef("Ngay", "order_date"),
                        new ColumnDef("Trang thai", "status"),
                        new ColumnDef("Tong tien", "total_amount")
                ),
                """
                SELECT po.order_number, v.name AS vendor_name, po.order_date, po.status,
                       COALESCE(SUM(pol.line_total), 0) AS total_amount
                FROM inv_purchase_order po
                JOIN inv_vendor v ON v.id = po.vendor_id
                LEFT JOIN inv_purchase_order_line pol ON pol.order_id = po.id
                WHERE po.is_deleted = false
                GROUP BY po.id, po.order_number, v.name, po.order_date, po.status
                ORDER BY po.order_date DESC, po.order_number
                """,
                new HashMap<>());
    }
}
