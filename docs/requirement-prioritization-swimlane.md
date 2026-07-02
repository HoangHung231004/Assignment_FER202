# Requirement Prioritization Process – Swimlane Diagram

> **Tool:** Visual Paradigm (UML Activity Diagram with Swimlanes)  
> **Swimlanes:** Customer Representatives → Business Analyst → Developers → Project Manager

---

## 1. Swimlanes (4 lanes)

| # | Swimlane | Vai trò |
|---|----------|---------|
| 1 | **Customer Representatives** | Xác định yêu cầu, ước lượng Benefit/Penalty, nhận danh sách ưu tiên cuối |
| 2 | **Business Analyst** | Thu thập danh sách, tính Total Value, tính Priority Score |
| 3 | **Developers** | Ước lượng Cost và Technical Risk |
| 4 | **Project Manager** | Review ranking, phê duyệt hoặc yêu cầu đánh giá lại |

---

## 2. Luồng xử lý (Process Flow)

```
Start
 │
 ├─ [Customer Representatives]
 │    Identify Requirements
 │    → Estimate Benefit (1–9)
 │    → Estimate Penalty (1–9)
 │
 ├─ [Business Analyst]
 │    Create Requirement List
 │    → Calculate Total Value
 │
 ├─ [Developers]
 │    Estimate Cost (1–9)
 │    → Estimate Technical Risk (1–9)
 │
 ├─ [Business Analyst]
 │    Calculate Priority Score
 │
 ├─ [Project Manager]
 │    Review Priority Ranking
 │    → <Approved?>
 │         ├─ No  → Request Reassessment → (quay lại Estimate Cost / Technical Risk)
 │         └─ Yes → Approve Prioritized Requirements
 │
 ├─ [Customer Representatives]
 │    Receive Final Priority List
 │
End
```

---

## 3. Activities chính (từ slide)

| Activity | Swimlane | Mô tả |
|----------|----------|-------|
| **Estimate Benefit** | Customer Representatives | Thang điểm 1–9 |
| **Estimate Penalty** | Customer Representatives | Thang điểm 1–9 |
| **Calculate Total Value** | Business Analyst | Tổng hợp giá trị từ Benefit & Penalty |
| **Estimate Cost** | Developers | Thang điểm 1–9 |
| **Estimate Technical Risk** | Developers | Thang điểm 1–9 |
| **Calculate Priority Score** | Business Analyst | Tính điểm ưu tiên cuối |
| **Review Priority Ranking** | Project Manager | Xem xét thứ tự ưu tiên |
| **Approve Prioritized Requirements** | Project Manager | Phê duyệt danh sách (khi Approved = Yes) |

---

## 4. Decision node

| Decision | Yes | No |
|----------|-----|-----|
| **Approved?** | Approve Prioritized Requirements → Receive Final Priority List → End | Request Reassessment → quay lại **Estimate Cost** & **Estimate Technical Risk** (Developers) |

---

## 5. File đính kèm (tải về)

| File | Mục đích |
|------|----------|
| [`requirement-prioritization-swimlane.svg`](./requirement-prioritization-swimlane.svg) | Sơ đồ swimlane PNG/SVG — mở trực tiếp hoặc chèn vào báo cáo |
| [`requirement-prioritization-swimlane.puml`](./requirement-prioritization-swimlane.puml) | PlantUML — import hoặc render thành ảnh |

---

## 6. Hướng dẫn vẽ trong Visual Paradigm

### Bước 1 – Tạo diagram mới
1. **File → New Project** (hoặc mở project hiện có)
2. **Diagram → New → UML → Activity Diagram**
3. Đặt tên: `Requirement Prioritization Swimlane`

### Bước 2 – Thêm 4 Swimlanes
1. Kéo **Swimlane** từ palette vào canvas (4 hàng)
2. Đặt tên lần lượt:
   - `Customer Representatives`
   - `Business Analyst`
   - `Developers`
   - `Project Manager`

> **Lưu ý:** Lane **Customer Representatives** xuất hiện 2 lần (đầu và cuối flow). Trong VP có thể:
> - Dùng 1 lane và kéo activity xuống cuối, hoặc
> - Tách thành 2 lane cùng tên như sơ đồ SVG đính kèm.

### Bước 3 – Thêm Initial / Final node
- **Initial node** (●) → lane Customer Representatives (đầu)
- **Activity Final node** (◎) → lane Customer Representatives (cuối)

### Bước 4 – Thêm Activities (theo thứ tự flow)

**Customer Representatives**
1. Identify Requirements
2. Estimate Benefit *(note: 1–9)*
3. Estimate Penalty *(note: 1–9)*

**Business Analyst**
4. Create Requirement List
5. Calculate Total Value
6. Calculate Priority Score *(sau Developers)*

**Developers**
7. Estimate Cost *(note: 1–9)*
8. Estimate Technical Risk *(note: 1–9)*

**Project Manager**
9. Review Priority Ranking
10. **Decision:** Approved? *(Decision/Merge node hình thoi)*
11. Approve Prioritized Requirements *(nhánh Yes)*
12. Request Reassessment *(nhánh No)*

**Customer Representatives (cuối)**
13. Receive Final Priority List

### Bước 5 – Nối Control Flow
```
Start → Identify Requirements → Estimate Benefit → Estimate Penalty
  → Create Requirement List → Calculate Total Value
  → Estimate Cost → Estimate Technical Risk
  → Calculate Priority Score
  → Review Priority Ranking → Approved?
      Yes → Approve Prioritized Requirements → Receive Final Priority List → End
      No  → Request Reassessment → Estimate Cost (loop)
```

### Bước 6 – Export
- **File → Export → Export Current Diagram → PNG / PDF / SVG**

---

## 7. Sơ đồ tham chiếu (ASCII)

```
                    REQUIREMENT PRIORITIZATION – SWIMLANE
================================================================================
Customer Rep  | (●) → [Identify Req] → [Est Benefit] → [Est Penalty] ─────┐
              |                                                            │
Business      |              [Create List] → [Calc Total Value] → [Calc Score]
Analyst       |                                    ↑              ↑        │
              |                                    └──────────────┘        │
Developers    |                         [Est Cost] → [Est Tech Risk] ──────┘
              |
Project Mgr   |                                    [Review Ranking] → ◇ Approved?
              |                                         ↑    No │      │ Yes
              |                                         └──[Reassess]│
              |                                                    [Approve]
Customer Rep  |                              [Receive Final List] ←──┘
              | (◎)
================================================================================
```

---

*Tạo cho Assignment FER202 – Requirement Prioritization Process*
