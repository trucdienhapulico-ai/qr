# Roadmap: Mobile QR System (Standalone & Sync)

> Module quét QR báo cáo bảo trì độc lập. Nhanh, nhẹ, và không phụ thuộc server cục bộ lúc nhập liệu.

**Status**: Active (Stable v2.3.0)
**Last Updated**: 2026-05-14

## 🎯 Tầm nhìn & Nguyên tắc
- **Mã QR tinh gọn**: Chỉ chứa dữ liệu thô là UID (ví dụ: `TB001`). **Không** chứa URL.
- **Hệ thống Hybrid**: 
  - Frontend (Giao diện): GitHub Pages (`https://vanhanh-ai.github.io/qr/`).
  - Backend (Database tạm): Google Sheets.
- **Kết nối API**: GAS (Google Apps Script) làm cầu nối xử lý JSON/CORS.
- **Offline First**: Cho phép lưu log tạm vào LocalStorage khi mất mạng và đồng bộ sau.

---

## 🗺️ Các Giai Đoạn Phát Triển

### Phase 1: Xây dựng Frontend & Core UI ✅
- [x] Khởi tạo giao diện tĩnh tối ưu cho Mobile (Glassmorphism UI).
- [x] Tích hợp thư viện quét mã QR và hỗ trợ đèn Flash (Torch).
- [x] Xây dựng form nhập liệu thủ công cho UID.
- [x] Triển khai đa ngôn ngữ (i18n) Tiếng Việt/Tiếng Anh.
- [x] Xuất bản lên GitHub Pages.
- [x] Hệ thống **Remember Me** (Ghi nhớ đăng nhập).

### Phase 2: GAS Backend & Robustness ✅
- [x] Cấu trúc Google Sheets hoàn chỉnh: `Users`, `Devices`, `Logs`, `Checklists`, `WorkOrders`, `AuditLog`.
- [x] Backend xử lý đa nhiệm: Đăng nhập, Ghi log, Quản lý Work Order, Đổi mật khẩu.
- [x] **Robustness**: Xử lý lỗi crash trong Editor, trả về JSON chuẩn cho Frontend.
- [x] **Diagnostic Tool**: Hàm `testConnection()` tự động kiểm tra cấu trúc database.
- [x] **Security**: API Token bảo mật cho các truy vấn nhạy cảm.

### Phase 3: Quản lý Nâng cao & UX 🔄 (In Progress)
- [x] **Mini Log**: Hiển thị 5 hoạt động gần nhất của thiết bị ngay khi quét.
- [x] **Inventory Status**: Chế độ In/Out nhanh (Nhập kho/Xuất lắp đặt).
- [x] **Work Orders (Kanban)**: Giao diện quản lý phiếu sửa chữa dạng thẻ.
- [x] **Haptic Feedback**: Rung và âm thanh khi quét thành công.
- [ ] **Analytics Dashboard**: Biểu đồ thống kê tình trạng thiết bị (Doughnut chart).
- [x] **Maintenance Schedule**: Tự động nhắc lịch bảo trì dựa trên `Cycle` ngày.

### Phase 4: Đồng bộ NAS & Data Ownership 🚀 (Next Step)
- [ ] Xây dựng script đồng bộ (Node.js/Python) chạy trên Synology NAS.
- [ ] Tự động kéo dữ liệu từ Google Sheets về PostgreSQL cục bộ.
- [ ] Xây dựng Webhook từ GAS để báo tin cho NAS khi có dữ liệu mới (Real-time sync).
- [ ] Triển khai lưu trữ hình ảnh bảo trì lên NAS thay vì Google Drive.

### Phase 5: Mở rộng & Tích hợp
- [ ] Tích hợp thông báo qua Telegram/Zalo khi có Work Order khẩn cấp.
- [ ] Chế độ Offline hoàn toàn (PWA - Progressive Web App).
- [ ] Tích hợp AI chẩn đoán lỗi dựa trên hình ảnh báo cáo.
