# Bean & Bloom Coffee House • Thrissur, Kerala
### Decoupled Cafe Management & Online Ordering Ecosystem

An enterprise-ready, decoupled coffee shop system tailored for **Bean & Bloom Coffee House**, located at **Swaraj Round South, Thrissur, Kerala**. The platform is split into two independent web applications: a customer-facing online ordering storefront and a minimal, professional POS & Computer System for baristas and store managers.

---

## 📌 Executive Summary

| Attribute | Specification |
| :--- | :--- |
| **Location** | Swaraj Round South, Opp. Vadakkunnathan Temple, Thrissur, Kerala - 680001 |
| **GSTIN / Tax ID** | `32AABCB1234M1Z5` *(Kerala State Code: 32)* |
| **FSSAI License** | `11322007000123` |
| **Currency** | Indian Rupee (**₹** - INR) |
| **Price Range** | **₹20 to ₹200** *(Strictly enforced)* |
| **Tax Rate** | 5% GST *(CGST 2.5% + SGST 2.5% standard restaurant rate)* |
| **Customer Payment** | **Pay on Pickup Time Only** *(Cash / UPI at counter)* |
| **Customer App Port** | `http://localhost:5173` |
| **POS / Admin App Port** | `http://localhost:5174` |
| **Shared Sync API Port** | `http://localhost:4000` *(Optional live sync)* |

---

## 📁 System Architecture & Directory Structure

```
coffee/
├── customer-site/                 # 🛍️ Customer Online Ordering Storefront
│   ├── public/                    # Favicon & assets
│   ├── src/
│   │   ├── components/            # Hero, Menu, Cart, OrderTracker, BillReceipt, About, Location, Footer
│   │   ├── context/
│   │   │   ├── CartContext.jsx    # Client-side bag management
│   │   │   └── CustomerOrderContext.jsx # Orders, Pay on Pickup, live tracking, dynamic menu
│   │   ├── App.jsx
│   │   ├── index.css              # Tailwind CSS v4 & @media print thermal bill styling
│   │   └── main.jsx
│   ├── package.json               # Configured for Vite port 5173
│   └── vite.config.js
│
├── pos-admin/                     # 🖥️ Minimal, Professional POS & Computer System
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # KDS queue, Floor map, Counter register, Menu manager, Site editor
│   │   │   └── PosReceiptModal.jsx # Official thermal bill receipt generator
│   │   ├── context/
│   │   │   └── AdminContext.jsx   # Live orders, table status, shift stats, menu catalog, store details
│   │   ├── utils/
│   │   │   └── audio.js           # Dual-tone synthesized Web Audio chime (no audio assets required)
│   │   ├── App.jsx
│   │   ├── index.css              # High-contrast Zinc/Slate POS theme
│   │   └── main.jsx
│   ├── package.json               # Configured for Vite port 5174
│   └── vite.config.js
│
├── server/                        # ⚡ Zero-Dependency Shared Real-Time Server
│   ├── server.js                  # Pure Node.js HTTP REST API for orders, tables, items & settings
│   └── db.json                    # Auto-generated JSON database
│
├── package.json                   # Root orchestrator with unified npm scripts
└── README.md                      # Comprehensive system documentation
```

---

## 🚀 Quick Start Guide

You can launch each service independently in separate terminal windows:

### 1. Launch Customer Website
```powershell
npm run dev:customer
```
*(Or navigate to folder: `cd customer-site && npm run dev`)*  
👉 Open: **[http://localhost:5173](http://localhost:5173)**

---

### 2. Launch Cafe Computer System / POS Admin
```powershell
npm run dev:pos
```
*(Or navigate to folder: `cd pos-admin && npm run dev`)*  
👉 Open: **[http://localhost:5174](http://localhost:5174)**

---

### 3. (Optional) Launch Real-Time Sync Server
```powershell
npm run server
```
*When running, any order placed on the customer site immediately syncs with the POS screen, and menu changes made in the admin immediately update on the customer site.*  
*(Note: If the server is not running, both applications run standalone using local synchronized persistence).*

---

## ☕ Kerala Thrissur Menu (₹20 to ₹200)

| Category | Item Name | Price | Description |
| :--- | :--- | :--- | :--- |
| **Tea** | Kattan Chai (Black Tea) | **₹20** | Strong brewed Nilgiri black tea |
| **Tea** | Malabar Sulaimani Tea | **₹25** | Spiced black tea with mint, cinnamon & lemon |
| **Tea** | Elaichi Milk Chai | **₹30** | Boiled farm milk with crushed green cardamom |
| **Kaapi** | Traditional Kerala Filter Kaapi | **₹35** | Wayanad robusta & chicory frothed in brass dabarah |
| **Snacks** | Warm Bun Butter Jam | **₹40** | Bakery sweet bun with salted butter & mixed fruit jam |
| **Kaapi** | Sukku Malli Kaapi | **₹40** | Herbal brew with dry ginger, coriander & jaggery |
| **Snacks** | Kerala Pazham Pori (2 Pcs) | **₹45** | Crispy golden fried Nendran banana fritters |
| **Snacks** | Kerala Spiced Plum Cake Slice | **₹50** | Traditional Christmas-style soaked raisin fruit cake |
| **Snacks** | Malabar Chicken Cutlet (2 Pcs) | **₹60** | Crumb-fried spicy minced chicken with tomato relish |
| **Espresso** | Single Origin Espresso | **₹65** | Bold double shot from Wayanad estate beans |
| **Espresso** | Classic Americano | **₹75** | Espresso topped with hot spring water |
| **Snacks** | Fresh Butter Croissant | **₹85** | Flaky pastry baked with pure churned butter |
| **Cold Brew** | South Indian Iced Kaapi | **₹90** | Chilled filter decoction frothed with sweetened milk |
| **Cold Brew** | Malabar Cold Brew (18-Hour) | **₹110** | 18-hour cold steeped spring water brew with cacao notes |
| **Latte** | Cardamom Spiced Latte | **₹120** | Idukki green cardamom steamed with velvet microfoam |
| **Latte** | Vanilla Bloom Latte | **₹130** | Madagascar vanilla with espresso & milk |
| **Latte** | Jaggery Caramel Latte | **₹140** | House-made palm jaggery reduction caramel |
| **Cold Brew** | Thrissur Cold Frappé | **₹150** | Blended espresso with Belgian dark chocolate & cream |

---

## 🛠️ Feature Deep Dive

### 1. Customer Ordering & "Pay on Pickup" Flow
- **Frictionless Checkout**: Customers choose between **Takeaway (Counter Pickup)** and **Dine-In (Table Seating)**.
- **Pay on Pickup Only**: Removed complex card fields and gateways. Customers receive a confirmed order token immediately and pay at the counter via cash or UPI.
- **Live Order Tracker**:
  - Step 1: *Order Received*
  - Step 2: *Brewing Kaapi* (animated bean & steam indicator)
  - Step 3: *Ready at Counter* (chime alert & pickup reminder)
  - Step 4: *Order Completed*
  - Live 12-minute preparation countdown timer.

### 2. POS & Kitchen Display System (KDS)
- **Minimal, Professional UI**: Clean high-contrast dark theme (Zinc/Slate) optimized for quick barista workflows.
- **Order Progression**: One-click status buttons advance orders: `[Start Prep]` ➔ `[Mark Ready]` ➔ `[Complete Order]`.
- **Cash on Pickup Attention Badge**: Unpaid orders feature a `💵 Pay on Pickup Due: ₹XXX` alert with a one-click `[Receive Cash]` settlement button.
- **Sound Alerts**: Web Audio API synthesized chimes for incoming orders and ready-for-pickup notifications.

### 3. Table Occupation Management & Floor Alerts
- **Interactive Floor Map**: Tracks 8 tables across *Swaraj Round View*, *Temple Facing*, *Indoor AC Lounge*, *Verandah Balcony*, and *Courtyard Garden*.
- **Capacity Alert**: Automatic warning banner when table occupancy exceeds **75%**.
- **Long-Stay Alert**: Automatic flag on tables seated for **$>45\text{ minutes}$**.
- **Table Actions**: 1-click status switching between *Available*, *Occupied*, *Reserved*, and *Cleaning*.

### 4. Menu Catalog & "Sold Out" Management
- **Sold Out Toggle**: Baristas can mark any item as **"Sold Out"** with one click. This instantly reflects on the customer website, disabling ordering for that item.
- **Add New Item**: Add items with custom names, categories, descriptions, photos, and prices strictly validated between **₹20 and ₹200**.
- **Edit & Delete**: Full CRUD controls directly on the admin screen.

### 5. Store & Site Details Live Editor
- Store managers can edit shop details right on the admin web window:
  - Cafe Name, Tagline, Street Address, Phone Numbers, Email, GSTIN, FSSAI Number, Operating Hours.
- Clicking **"Save Store Details Live"** instantly synchronizes changes across the customer site headers, footers, location section, and printed bills.

### 6. Thermal Bill & Receipt Printing
- Clean receipt modal conforming to standard Indian cafe tax invoices:
  - Official cafe header, address, phone, GSTIN, FSSAI number.
  - Token number, order ID, timestamp, cashier terminal.
  - Itemized table with quantity, unit rate, and total.
  - 5% GST itemization (2.5% CGST + 2.5% SGST).
  - Native browser printing formatted specifically for 58mm/80mm thermal receipt printers (`@media print` clean paper styling).

---

## 🧪 Production Verification

Both applications build with zero warnings:

```powershell
npm run build
```
```text
✓ customer-site built in ~340ms
✓ pos-admin built in ~220ms
```

To run linting across the entire codebase:
```powershell
npm run lint
```

---

## 📄 License
Private & proprietary. Built for Bean & Bloom Coffee House, Swaraj Round South, Thrissur, Kerala.
