# Contact Manager — Ứng dụng Quản lý Danh bạ

> Dự án cá nhân xây dựng bằng **React.js**, phục vụ môn **FER202** và portfolio xin vị trí **Intern ReactJS**.

Ứng dụng web quản lý danh bạ liên hệ với đầy đủ luồng đăng nhập, CRUD, lọc/tìm kiếm, thùng rác, chia sẻ danh bạ giữa người dùng.

---

## Thông tin dự án

| | |
|---|---|
| **Sinh viên** | HungHQHE180380 |
| **Môn học** | FER202 — Front-End Development with ReactJS |
| **Vai trò** | Full-stack Front-end (UI + tích hợp API) |
| **Thời gian** | 2026 |

---

## Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| **React 19** | Xây dựng giao diện component-based |
| **Vite** | Bundler, dev server nhanh |
| **React Router DOM v7** | Điều hướng đa trang |
| **Bootstrap 5 + React Bootstrap** | Layout, Modal, Form, Pagination |
| **Bootstrap Icons** | Icon UI |
| **Axios** | Gọi REST API |
| **JSON Server** | Mock backend / API giả lập |
| **ESLint** | Kiểm tra chất lượng code |

---

## Tính năng chính

### Xác thực người dùng
- Đăng ký tài khoản với validation form (email, SĐT VN, mật khẩu, điều khoản)
- Đăng nhập / đăng xuất
- Lưu session user vào `localStorage`

### Quản lý danh bạ
- Xem danh sách liên hệ dạng bảng
- Thêm / sửa / xóa liên hệ (Modal)
- Đánh dấu yêu thích (toggle star)
- Phân loại nhóm: Gia đình, Bạn bè, Công việc, Khác
- Lọc theo nhóm, yêu thích
- Tìm kiếm theo tên hoặc email
- Sắp xếp theo họ
- Phân trang (10 liên hệ/trang)
- Thống kê tổng quan (card: tổng liên hệ, nhóm, yêu thích, SĐT)

### Thùng rác (Soft delete)
- Xóa liên hệ → chuyển vào thùng rác (có thể khôi phục)
- Khôi phục liên hệ về danh bạ
- Xóa hoàn toàn khỏi thùng rác (không thể khôi phục)

### Chia sẻ danh bạ
- Chọn nhiều liên hệ bằng checkbox
- Chia sẻ qua email người nhận
- Người nhận nhận thông báo trong app
- Chấp nhận một phần / chấp nhận tất cả / từ chối nhận

### Xử lý lỗi
- Hiển thị thông báo lỗi API trên giao diện
- Fallback mảng rỗng khi `data` null
- Redirect về login nếu chưa đăng nhập

---

## Cấu trúc thư mục

```
src/
├── components/          # Component tái sử dụng (Input, Modal...)
│   ├── ModalAddContact.jsx
│   ├── ModalEdit.jsx
│   ├── ModalDelete.jsx
│   ├── ModalShareContact.jsx
│   └── ModalAcceptShare.jsx
├── layout/              # Layout dashboard
│   ├── Tabbar.jsx       # Sidebar điều hướng
│   ├── WorkSpace.jsx    # Fetch data, state trung tâm
│   ├── TableContact.jsx # Bảng danh bạ + filter
│   ├── TableTrash.jsx   # Bảng thùng rác
│   ├── ListCard.jsx     # Card thống kê
│   └── NotificationShare.jsx
├── pages/               # Các trang chính
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashBoard.jsx
│   └── SettingProfile.jsx
├── ultils/
│   └── validator.js     # Validation form tái sử dụng
├── main.jsx             # Entry + routing
└── App.jsx
database.json            # Dữ liệu mock (users, contacts, trash, shares)
```

---

## Kiến trúc & kỹ năng thể hiện

- **Component composition**: Tách UI thành component nhỏ, dễ bảo trì
- **State management**: `useState`, `useEffect`, pattern `reload` để refetch data
- **Conditional rendering**: Hiển thị tab theo query param `?tab=`
- **Form handling**: Controlled components + validation phía client
- **REST API integration**: CRUD qua Axios + JSON Server
- **UX patterns**: Modal xác nhận, thông báo, phân trang, multi-select

---

## Cài đặt & chạy dự án

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Bước 1: Clone & cài dependency

```bash
git clone https://github.com/HoangHung231004/Assignment_FER202.git
cd Assignment_FER202
npm install
```

### Bước 2: Cấu hình môi trường

Tạo file `.env` ở thư mục gốc:

```env
VITE_API_BASE_URL=http://localhost:9999
```

### Bước 3: Chạy JSON Server (terminal 1)

```bash
npx json-server --watch database.json --port 9999
```

### Bước 4: Chạy React app (terminal 2)

```bash
npm run dev
```

Mở trình duyệt: `http://localhost:5173`

### Build production

```bash
npm run build
npm run preview
```

---

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| User A | `hunghoang042310a5@gmail.com` | `123456` |
| User B | `tranthibinh@gmail.com` | `123456` |

**Gợi ý test chia sẻ:** Đăng nhập User A → chọn liên hệ → Chia sẻ → nhập email User B → Đăng xuất → Đăng nhập User B → xem thông báo.

---

## API Endpoints (JSON Server)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/users?email=&password=` | Đăng nhập |
| POST | `/users` | Đăng ký |
| GET | `/contacts/:userId` | Lấy danh bạ |
| PATCH | `/contacts/:userId` | Cập nhật danh bạ |
| GET | `/trash/:userId` | Lấy thùng rác |
| PATCH | `/trash/:userId` | Cập nhật thùng rác |
| GET | `/groups` | Lấy nhóm |
| GET | `/shares?toUserId=&status=` | Lấy lời mời chia sẻ |
| POST | `/shares` | Gửi chia sẻ |
| PATCH | `/shares/:id` | Cập nhật trạng thái chia sẻ |

---

## Screenshots

> _(Thêm ảnh chụp màn hình: Trang chủ, Dashboard, Thùng rác, Chia sẻ — để README trông chuyên nghiệp hơn khi gửi CV)_

---

## Hướng phát triển tiếp theo

- [x] Hoàn thiện trang Cài đặt (đổi mật khẩu, cập nhật profile)
- [x] Tự tạo `contacts` / `trash` khi đăng ký user mới
- [x] Gom API calls vào `services/`
- [ ] Chuyển sang TypeScript
- [ ] Viết unit test với Vitest + React Testing Library
- [ ] Deploy lên Vercel / Netlify

---

## Liên hệ

- **GitHub:** [HoangHung231004](https://github.com/HoangHung231004)
- **Email:** hunghoang042310a5@gmail.com

---

*Dự án được xây dựng trong quá trình học ReactJS tại FPT University — FER202.*
