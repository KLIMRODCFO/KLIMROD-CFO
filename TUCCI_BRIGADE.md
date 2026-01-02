# 🏢 TUCCI Restaurant Brigade Database

## Overview

The TUCCI Brigade database is the primary employee directory for the TUCCI restaurant. This database is automatically loaded into the KlimRod CFO platform and synchronized across all modules that require employee information.

## Database Location

- **File:** `app/lib/tucciBrigade.ts`
- **Total Employees:** 61 active staff members
- **Data Format:** TypeScript interface with Tucci employee data

## Data Structure

### TucciEmployee Interface

```typescript
interface TucciEmployee {
  id: string                              // Employee ID (EMP001, EMP002, etc.)
  firstName: string                       // First name
  lastName: string                        // Last name
  name: string                           // Full name (firstName + lastName)
  email: string                          // Email address
  phone: string                          // Phone number
  position: string                       // Job position/title
  department: string                     // Department (FOH, BOH, KITCHEN, ADMIN)
  hireDate: string                       // Date of hire (MM/DD/YYYY)
  status: 'active' | 'inactive' | 'terminated'  // Employment status
  employmentType: string                 // FULL TIME or PART TIME
}
```

## Departments

- **FOH (Front of House):** Servers, Bartenders, Hosts, Bussers, Food Runners
- **BOH (Back of House):** Kitchen staff, Prep cooks, Line cooks
- **KITCHEN:** Chef positions
- **ADMIN:** Administrative staff

## Module Integration

### 1. **HR Module** (`app/hr/page.tsx`)
- **Automatic Loading:** TUCCI employees are automatically loaded into the EMPLOYEES DIRECTORY on first app launch
- **Persistence:** Data is stored in localStorage with key `directory_employees`
- **Features:**
  - View all TUCCI brigade members
  - Edit employee details (phone, position, start date, status)
  - Mark employees as active/inactive
  - Add new employees through the EMPLOYEES DIRECTORY tab

### 2. **Sales Report Module** (`app/sales-report/page.tsx`)
- **Employee Dropdown:** When adding sales data, users can select from a dropdown of all TUCCI employees
- **Auto-Population:** Selecting an employee automatically fills the position field
- **Features:**
  - Quick employee selection for sales data entry
  - Automatic position lookup
  - Fallback to manual entry if needed

### 3. **HR Submodules**
The TUCCI brigade data is available for:
- **TIMECARD:** Track shifts for TUCCI staff
- **PAYROLL:** Generate payroll from timecard data
- **CC GRATUITY REPORT:** Record credit card tips by employee
- **EMPLOYEES DIRECTORY:** Manage employee information

## Data Initialization

On the first application launch:
1. The system checks for `tucci_initialized` flag in localStorage
2. If not present, it loads all 61 TUCCI employees into `directory_employees`
3. Sets the `tucci_initialized` flag to prevent re-initialization
4. Subsequent app launches use the stored directory data

## How to Add New Employees

### Method 1: Through HR Application Form
Navigate to **HR → APPLICATION** and fill out the employee application form. This creates a new employee record.

### Method 2: Through Employees Directory
Navigate to **HR → DIRECTORY**, fill out the form, and click "AGREGAR EMPLEADO" to add a new staff member.

### Method 3: Direct Database Edit
Edit `app/lib/tucciBrigade.ts` and add a new entry to the `tucciEmployees` array, then rebuild the application.

## Current Staff by Department

### Executive Team (1)
- **JESUS MORALES** - EXECUTIVE CHEF (Since 1/1/2020)

### Sous Chefs & Cooks (30+)
Kitchen staff including Line Cooks, Prep Cooks, Food Runners, and Kitchen Support

### Front of House Staff (20+)
Servers, Bartenders, Bussers, Hosts from multiple shifts (Full Time and Part Time)

### Admin Staff (2+)
Support personnel for operations and administration

## Export Functions

The database provides utility functions for easy access:

```typescript
// Get employees formatted for Directory (DirectoryEmployee format)
getTucciEmployeesForDirectory(): DirectoryEmployee[]

// Get employees formatted for Sales Report (simplified format with id, name, position)
getTucciEmployeesForSales(): SalesEmployee[]
```

## Data Persistence

- **localStorage Key:** `directory_employees`
- **Backup:** Original TUCCI data is in the source code and survives data resets
- **Sync:** Employee changes in the directory are synced to all modules in real-time

## Updates & Maintenance

When updating TUCCI employee data:
1. Edit the `tucciEmployees` array in `app/lib/tucciBrigade.ts`
2. Update the corresponding localStorage via the HR module
3. Changes apply immediately to all modules using the data

## Future Enhancements

- [ ] Supabase integration for persistent cloud storage
- [ ] Employee photo uploads
- [ ] Role-based access control (Manager, Chef, Server, Admin)
- [ ] Automated payroll calculations based on hire date and position
- [ ] Department-specific reports and analytics

---

**Last Updated:** December 31, 2025
**Status:** ✅ Production Ready
