# Cost Calculation System - Klimrod CFO

## Overview
The cost calculation system automatically calculates recipe costs based on ingredient costs and labor time. This provides accurate profitability analysis for menu items.

## Components

### 1. Ingredient Cost Tracking (Chef Management > INGREDIENTS)
- **New Field**: `cost` (cost per unit)
- Each ingredient now includes its cost per unit (e.g., $3.50/KG, $0.25/UNIT)
- Required field when adding new ingredients
- Displayed in table: "COST PER UNIT" column with right-aligned $ values

### 2. Hourly Labor Rate Configuration (Recipes Section)
- **Location**: Yellow configuration panel at top of Recipes section
- **Default**: $20/hour
- **Storage**: Restaurant-scoped in localStorage: `hourly_labor_rate_${restaurantId}`
- Used to calculate labor costs based on prep + cook time
- Editable per restaurant

### 3. Auto-Calculated Recipe Cost
When creating or editing a recipe, the cost is **automatically calculated** using:

```
TOTAL COST = Ingredients Cost + Labor Cost
```

Where:
- **Ingredients Cost** = Σ (quantity × ingredient_unit_cost)
- **Labor Cost** = ((prep_time + cook_time) / 60) × hourly_labor_rate

#### Example:
```
Ingredient 1: 2 KG @ $3.50/KG = $7.00
Ingredient 2: 0.5 L @ $5.00/L = $2.50
Prep Time: 15 minutes
Cook Time: 30 minutes
Labor Rate: $20/hour

Ingredients Cost: $9.50
Labor Cost: (45 min / 60) × $20 = $15.00
TOTAL COST: $24.50
```

### 4. Recipe Form Features
- **Ingredient Input**: Uses datalist autocomplete showing available ingredients with their costs
- **Cost Field**: 
  - Background: Yellow (bg-yellow-50) to indicate auto-calculation
  - Label: "COST (AUTO)"
  - Behavior: Updates automatically when ingredients or times change
  - Override: Can be manually edited if needed
- **Real-time Updates**: Cost recalculates immediately when:
  - Adding/removing ingredients
  - Changing ingredient quantities
  - Modifying prep or cook time
  - Updating hourly labor rate

### 5. Cost Breakdown Display
Each recipe in the library shows:

#### Cost Row:
- **COST**: Total recipe cost
- **SELLING PRICE**: Menu price
- **MARGIN**: Dollar amount and percentage
  - Formula: `(selling_price - cost) / selling_price × 100`
  - Example: $35 - $24.50 = $10.50 (30%)

#### Cost Breakdown Row (Yellow background):
- **INGREDIENTS**: Sum of all ingredient costs
- **LABOR**: Time-based labor cost with details
  - Format: "$15.00 (45 MIN @ $20/HR)"

#### Ingredients List:
Each ingredient shows:
- Quantity, unit, and name
- Individual cost (right-aligned in gray)
- Example: "2 KG TOMATOES ... $7.00"

## Data Storage

### Ingredients
```json
{
  "id": "1234567890",
  "name": "TOMATOES",
  "category": "VEGETABLES",
  "unit": "KG",
  "cost": 3.50,
  "vendor1": "VENDOR A",
  "vendor2": "",
  "vendor3": ""
}
```
Storage key: `ingredients_${restaurantId}`

### Hourly Labor Rate
Storage key: `hourly_labor_rate_${restaurantId}`
Value: Number (e.g., 20)

### Recipes
```json
{
  "id": "1234567890",
  "name": "PASTA CARBONARA",
  "category": "ENTREES",
  "ingredients": [
    {"name": "SPAGHETTI", "quantity": "0.5", "unit": "KG"},
    {"name": "EGGS", "quantity": "4", "unit": "UNIT"}
  ],
  "prepTime": 15,
  "cookTime": 30,
  "cost": 24.50,
  "sellingPrice": 35.00
}
```
Storage key: `recipes_${restaurantId}`

## Business Intelligence Features

### 1. Profitability Analysis
- **Margin Calculation**: Automatic profit margin display
- **Percentage View**: See margin as both dollar amount and percentage
- **Quick Comparison**: Identify high-margin vs low-margin items

### 2. Cost Transparency
- **Ingredient Breakdown**: See which ingredients cost the most
- **Labor vs Materials**: Compare ingredient costs to labor costs
- **Cost Optimization**: Identify opportunities to reduce costs

### 3. Pricing Strategy
- **Data-Driven Pricing**: Set selling prices based on accurate costs
- **Target Margin**: Ensure each item meets profitability targets
- **Competitive Pricing**: Balance cost, margin, and market pricing

### 4. Dynamic Recalculation
- **Ingredient Price Changes**: When ingredient costs change, manually update recipes
- **Labor Rate Adjustments**: Changing labor rate requires manual recipe review
- **Real-time Feedback**: See cost impact immediately when editing

## Usage Workflow

### Step 1: Set Up Ingredients with Costs
1. Go to Chef Management > INGREDIENTS
2. Add ingredients with their cost per unit
3. Example: "OLIVE OIL" - OILS & FATS - L - $8.50

### Step 2: Configure Labor Rate
1. Go to Chef Management > RECIPES
2. Set hourly labor rate in yellow configuration box
3. Example: $20/hour (or $25 for experienced chef)

### Step 3: Create Recipe
1. Click "+ ADD RECIPE"
2. Enter basic info (name, category, description)
3. Enter prep time and cook time (in minutes)
4. Add ingredients:
   - Type ingredient name (autocomplete from inventory)
   - Enter quantity and select unit
   - Click "+ ADD INGREDIENT"
5. **Cost auto-calculates** as you add ingredients and times
6. Enter selling price
7. Add instructions and notes
8. Save recipe

### Step 4: Analyze Profitability
1. Review recipe in library
2. Check COST BREAKDOWN row:
   - Ingredients cost
   - Labor cost
3. Review MARGIN:
   - Dollar amount
   - Percentage
4. Adjust selling price or optimize recipe if needed

## Future Enhancements

### Potential Features:
1. **Overhead Percentage**: Add utilities, rent allocation (10-15% typical)
2. **Batch Costing**: Calculate cost for different serving sizes
3. **Historical Costs**: Track ingredient price changes over time
4. **Cost Alerts**: Notify when ingredient prices increase significantly
5. **Menu Optimization**: Suggest high-margin items to promote
6. **Vendor Comparison**: Compare ingredient costs across vendors
7. **Waste Factor**: Include estimated ingredient waste percentage
8. **Seasonal Adjustments**: Track cost variations by season

## Technical Implementation

### Auto-Calculation Logic
```typescript
useEffect(() => {
  const calculateCost = () => {
    let ingredientsCost = 0
    
    // Sum ingredient costs
    ingredients.forEach(ing => {
      const matchingIngredient = availableIngredients.find(
        ai => ai.name.toLowerCase() === ing.name.toLowerCase()
      )
      if (matchingIngredient && matchingIngredient.cost) {
        const quantity = parseFloat(ing.quantity) || 0
        ingredientsCost += quantity * matchingIngredient.cost
      }
    })
    
    // Calculate labor cost
    const totalMinutes = (parseInt(form.prepTime) || 0) + (parseInt(form.cookTime) || 0)
    const laborCost = (totalMinutes / 60) * hourlyLaborRate
    
    // Update form
    const totalCost = ingredientsCost + laborCost
    if (totalCost > 0) {
      setForm(prev => ({ ...prev, cost: totalCost.toFixed(2) }))
    }
  }
  
  calculateCost()
}, [ingredients, form.prepTime, form.cookTime, hourlyLaborRate, availableIngredients])
```

### Data Integration
- **Reads From**: `ingredients_${restaurantId}` (Chef Management)
- **Writes To**: `recipes_${restaurantId}` (Recipe storage)
- **Config**: `hourly_labor_rate_${restaurantId}` (Labor rate setting)
- **Cross-System**: Recipes section loads ingredients automatically

## Business Value

### For Restaurant Owners:
- **Accurate Costing**: Know true cost of every dish
- **Profit Maximization**: Identify and promote high-margin items
- **Menu Pricing**: Set prices based on data, not guesswork
- **Cost Control**: Track when costs increase, take action

### For Chefs:
- **Recipe Management**: Professional recipe documentation
- **Portion Control**: Standardized quantities reduce waste
- **Training Tool**: Clear instructions for kitchen staff
- **Innovation**: Experiment with recipes, see cost impact

### For Operations:
- **Inventory Planning**: Know what ingredients drive costs
- **Vendor Negotiation**: Use cost data in vendor discussions
- **Menu Engineering**: Design profitable menus strategically
- **Financial Reporting**: Accurate COGS (Cost of Goods Sold)

---

**Implementation Date**: January 2025
**Status**: Active
**Version**: 1.0
