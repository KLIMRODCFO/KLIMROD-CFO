# 📦 Invoice Line Items Feature

## Overview
Cada factura ahora puede tener un **desglose detallado por item/producto** que incluye:
- Nombre del producto
- Cantidad en **CASES** (cajas)
- Cantidad en **BOTTLES** (botellas)
- Precio unitario
- Precio total por item

## ✨ Features

### 1. **Automatic Extraction (OCR)**
El scanner de facturas automáticamente detecta y extrae:
- Delivery Number (Order #, Invoice #)
- Payment Terms (NET 30, NET 60, COD, etc.)
- Line items con cantidades y precios

**Ejemplo de texto reconocido:**
```
TOMATOES 12 cs $45.50 $546.00
OLIVE OIL 6 bottles $12.99 $77.94
CHICKEN BREAST 20 cases $89.00 $1780.00
```

### 2. **Manual Entry**
- Botón **"➕ Add Item"** para agregar productos manualmente
- Campos editables para cada item:
  - Product Name
  - Cases (cajas)
  - Bottles (botellas)
  - Unit Price
- Botón **"🗑️ Remove"** para eliminar items

### 3. **Smart Calculations**
- Total automático por item = (Cases + Bottles) × Unit Price
- Subtotal de todos los items
- Comparación con monto total de factura

### 4. **Expandable Invoice Table**
- Click en **▶** para expandir factura
- Ver todos los items en tabla detallada
- Columns: #, Product, Cases, Bottles, Unit Price, Total
- Items total calculation

## 📋 How to Use

### Step 1: Scan Invoice
1. Go to **Financial Intelligence > Invoice Allocation**
2. Click **"📸 Scan Invoice"**
3. Upload invoice image (photo or PDF screenshot)
4. OCR will extract vendor, date, delivery #, payment terms, and items

### Step 2: Review & Edit Items
- Review extracted items in "Line Items / Productos" section
- Edit any incorrect data
- Add missing items manually with **"➕ Add Item"**
- Remove incorrect items with **"🗑️"**

### Step 3: Save Invoice
- Click **"💾 Guardar Factura"**
- Invoice saved with all line items
- Items visible in expanded invoice view

## 🔍 Invoice Details View

When you expand an invoice (click ▶), you'll see:

### Top Section
- Payment Terms
- Delivery Number
- Created Date
- Description

### Line Items Table
```
# | Product            | 📦 Cases | 🍾 Bottles | Unit Price | Total
1 | TOMATOES          |    12    |     -      | $45.50     | $546.00
2 | OLIVE OIL         |    -     |     6      | $12.99     | $77.94
3 | CHICKEN BREAST    |    20    |     -      | $89.00     | $1,780.00
                                               Items Total: | $2,403.94
```

## 💡 Tips for Best Results

### OCR Scanning
- **High contrast**: Good lighting, clear text
- **Flat surface**: No wrinkles or shadows
- **Close up**: Invoice fills most of frame
- **Straight angle**: Not tilted or skewed

### Data Entry
- Use **Cases** for bulk items (vegetables, meats, dry goods)
- Use **Bottles** for beverages and liquids
- Can use both (e.g., 2 cases + 6 bottles)
- Unit price should be per case/bottle

## 📊 Use Cases

### 1. Cost Analysis
- Track price changes per product over time
- Compare unit prices between vendors
- Identify most expensive items

### 2. Inventory Management
- Know exact quantities ordered
- Track cases vs bottles separately
- Match against received goods

### 3. Recipe Costing
- Link invoice items to recipe ingredients
- Calculate true cost per dish
- Update menu prices based on ingredient costs

### 4. Vendor Comparison
- Compare same product from different vendors
- Analyze payment terms impact
- Evaluate delivery reliability (via delivery #)

## 🚀 Future Enhancements

### Planned Features
- [ ] Export line items to Excel
- [ ] Link items to ingredients database
- [ ] Price history tracking per product
- [ ] Automatic cost alerts (price increases)
- [ ] Vendor performance scoring
- [ ] Barcode scanning for products
- [ ] AI-powered product categorization

### Database Integration (Next Phase)
Currently stored in **localStorage**, migration to Supabase will enable:
- Multi-user access
- Historical reporting
- Advanced analytics
- Mobile synchronization

## 🔧 Technical Details

### Data Structure
```typescript
interface InvoiceItem {
  id: string
  product_name: string
  cases?: number
  bottles?: number
  unit_price: number
  total_price: number
}

interface Invoice {
  id: string
  vendor: string
  amount: number
  date: string
  delivery_number: string
  payment_terms: string
  category: string
  description: string
  items: InvoiceItem[]
  status: 'pending' | 'approved' | 'paid'
  created_at: string
}
```

### OCR Parsing Logic
```javascript
// Regex for line items
/([A-Za-z\s\-']+)\s+(\d+)\s*(cs|case|cases|bt|bottle|bottles|ea|each)?\s*\$?\s*(\d+[.,]\d{2})\s*\$?\s*(\d+[.,]\d{2})/gi

// Captures:
// 1. Product name
// 2. Quantity
// 3. Unit type (cases/bottles)
// 4. Unit price
// 5. Total price
```

## ❓ FAQ

**Q: What if OCR doesn't detect all items?**
A: You can manually add missing items with the "➕ Add Item" button.

**Q: Can I edit items after scanning?**
A: Yes! All fields are editable before saving.

**Q: What's the difference between Cases and Bottles?**
A: Use **Cases** for bulk packaging (typically 6-24 units per case). Use **Bottles** for individual units.

**Q: Does the items total have to match the invoice amount?**
A: Not necessarily. Invoice amount may include taxes, shipping, or fees not reflected in line items.

**Q: Can I delete an invoice?**
A: Yes, click the 🗑️ button in the invoice table.

**Q: Where is this data stored?**
A: Currently in browser localStorage. Future updates will sync to Supabase database.

## 📱 Mobile Access

To use this feature on your phone:
1. Deploy app to Vercel
2. Access via public URL (e.g., klimrod-cfo.vercel.app)
3. Use phone camera for better invoice photos
4. All features work on mobile browsers

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Author:** Klimrod CFO Development Team
