package com.phamdatte.erpdemo.reporting.service;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

/**
 * Generic Excel export service — dùng Apache POI.
 * Nhận danh sách cột + native query → trả file .xlsx dạng byte[].
 */
@Service
public class ExcelExportService {

    private final NamedParameterJdbcTemplate jdbc;

    public ExcelExportService(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * Định nghĩa 1 cột Excel.
     */
    public record ColumnDef(String header, String property) {}

    /**
     * Export dữ liệu từ native query ra file Excel.
     *
     * @param title  tiêu đề sheet
     * @param cols   danh sách cột
     * @param sql    native query — các cột phải alias đúng tên property
     * @param params tham số query
     * @return byte[] file .xlsx
     */
    public byte[] exportToExcel(String title, List<ColumnDef> cols, String sql, Map<String, Object> params) throws Exception {
        // Chọn NamedParameterJdbcTemplate.query với Map<String,Object> row mapper
        List<Map<String, Object>> rows = jdbc.queryForList(sql, params);

        try (Workbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet(title);

            // Header style
            CellStyle headerStyle = wb.createCellStyle();
            Font font = wb.createFont();
            font.setBold(true);
            font.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Header row
            Row header = sheet.createRow(0);
            int colIdx = 0;
            for (ColumnDef col : cols) {
                Cell cell = header.createCell(colIdx++);
                cell.setCellValue(col.header());
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowIdx = 1;
            for (Map<String, Object> row : rows) {
                Row r = sheet.createRow(rowIdx++);
                colIdx = 0;
                for (ColumnDef col : cols) {
                    Object val = row.get(col.property());
                    Cell cell = r.createCell(colIdx++);
                    if (val == null) {
                        cell.setCellValue("");
                    } else if (val instanceof Number) {
                        cell.setCellValue(((Number) val).doubleValue());
                    } else {
                        cell.setCellValue(val.toString());
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < cols.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                wb.write(bos);
                return bos.toByteArray();
            }
        }
    }
}
