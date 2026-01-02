
"use client";




import { useState } from 'react';

type BalanceSheetData = {
  cash: number;
  receivables: number;
  inventory: number;
  fixedAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  equity: number;
};
type FormEvent = React.ChangeEvent<HTMLInputElement>;
type SaveHandler = (data: any) => void;

function BalanceSheetForm({ data, onSave }: { data: BalanceSheetData; onSave: SaveHandler }) {
  const [form, setForm] = useState<BalanceSheetData>({ ...data });
  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  const handleSave = () => {
    onSave(form);
    alert('Balance Sheet guardado!');
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">Balance Sheet</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-3">ASSETS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">CASH</label>
              <input type="number" name="cash" value={form.cash} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">RECEIVABLES</label>
              <input type="number" name="receivables" value={form.receivables} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">INVENTORY</label>
              <input type="number" name="inventory" value={form.inventory} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">FIXED ASSETS</label>
              <input type="number" name="fixedAssets" value={form.fixedAssets} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">LIABILITIES</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">ACCOUNTS PAYABLE</label>
              <input type="number" name="accountsPayable" value={form.accountsPayable} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">SHORT TERM DEBT</label>
              <input type="number" name="shortTermDebt" value={form.shortTermDebt} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">EQUITY</h3>
          <div>
            <label className="block text-sm font-semibold mb-1">TOTAL EQUITY</label>
            <input type="number" name="equity" value={form.equity} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800 mt-6">GUARDAR</button>
    </div>
  );
}

type CashFlowData = {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netCashChange: number;
};

function CashFlowForm({ data, onSave }: { data: CashFlowData; onSave: SaveHandler }) {
  const [form, setForm] = useState<CashFlowData>({ ...data });
  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  const handleSave = () => {
    onSave(form);
    alert('Cash Flow Statement guardado!');
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">Cash Flow Statement</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">OPERATING ACTIVITIES</label>
          <input type="number" name="operatingActivities" value={form.operatingActivities} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">INVESTING ACTIVITIES</label>
          <input type="number" name="investingActivities" value={form.investingActivities} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">FINANCING ACTIVITIES</label>
          <input type="number" name="financingActivities" value={form.financingActivities} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">NET CASH CHANGE</label>
          <input type="number" name="netCashChange" value={form.netCashChange} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR</button>
    </div>
  );
}

// ...otros formularios: EquityStatementForm, InventoryValuationForm, ReceivablesAgingForm, PayablesAgingForm, DepreciationScheduleForm...

export default function Page() {
  // Funciones vacías y datos iniciales para evitar errores
  const emptyBalanceSheet: BalanceSheetData = {
    cash: 0,
    receivables: 0,
    inventory: 0,
    fixedAssets: 0,
    accountsPayable: 0,
    shortTermDebt: 0,
    equity: 0,
  };
  const emptyCashFlow: CashFlowData = {
    operatingActivities: 0,
    investingActivities: 0,
    financingActivities: 0,
    netCashChange: 0,
  };
  const noop = () => {};
  return (
    <div className="space-y-12">
      <BalanceSheetForm data={emptyBalanceSheet} onSave={noop} />
      <CashFlowForm data={emptyCashFlow} onSave={noop} />
      {/* Aquí puedes agregar los otros formularios originales que desees mostrar */}
    </div>
  );
}



// Equity Statement Form
function EquityStatementForm({ data, onSave }: any) {
  const [form, setForm] = useState({
    openingBalance: 0,
    // Archivo eliminado por limpieza total de financial-intelligence
    netIncome: 0,
    distributions: 0,
    closingBalance: 0,
    ...data
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleSave = () => {
    onSave(form)
    alert('Statement of Changes in Equity guardado!')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">Statement of Changes in Equity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">OPENING BALANCE</label>
          <input type="number" name="openingBalance" value={form.openingBalance} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">CAPITAL CONTRIBUTIONS</label>
          <input type="number" name="capitalContributions" value={form.capitalContributions} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">NET INCOME</label>
          <input type="number" name="netIncome" value={form.netIncome} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">DISTRIBUTIONS</label>
          <input type="number" name="distributions" value={form.distributions} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="col-span-full">
          <label className="block text-sm font-semibold mb-1">CLOSING BALANCE</label>
          <input type="number" name="closingBalance" value={form.closingBalance} onChange={handleChange} className="w-full border px-3 py-2 rounded" disabled />
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR</button>
    </div>
  )
}

// Inventory Valuation Form
function InventoryValuationForm({ data, onSave }: any) {
  const [form, setForm] = useState({
    foodInventory: 0,
    beverageInventory: 0,
    totalInventoryValue: 0,
    cogsAdjustments: 0,
    ...data
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleSave = () => {
    onSave(form)
    alert('Inventory Valuation Report guardado!')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">Inventory Valuation Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">FOOD INVENTORY VALUE</label>
          <input type="number" name="foodInventory" value={form.foodInventory} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">BEVERAGE INVENTORY VALUE</label>
          <input type="number" name="beverageInventory" value={form.beverageInventory} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">TOTAL INVENTORY VALUE</label>
          <input type="number" name="totalInventoryValue" value={form.totalInventoryValue} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">COGS ADJUSTMENTS</label>
          <input type="number" name="cogsAdjustments" value={form.cogsAdjustments} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR</button>
    </div>
  )
}

// Receivables Aging Form
function ReceivablesAgingForm({ data, onSave }: any) {
  const [form, setForm] = useState({
    current: 0,
    days30: 0,
    days60: 0,
    days90Plus: 0,
    ...data
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleSave = () => {
    onSave(form)
    alert('Accounts Receivable Aging guardado!')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">Accounts Receivable Aging</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">CURRENT (0-30 DAYS)</label>
          <input type="number" name="current" value={form.current} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">31-60 DAYS</label>
          <input type="number" name="days30" value={form.days30} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">61-90 DAYS</label>
          <input type="number" name="days60" value={form.days60} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">90+ DAYS</label>
          <input type="number" name="days90Plus" value={form.days90Plus} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR</button>
    </div>
  )
}

// Payables Aging Form
function PayablesAgingForm({ data, onSave }: any) {
  const [form, setForm] = useState({
    current: 0,
    days30: 0,
    days60: 0,
    days90Plus: 0,
    ...data
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleSave = () => {
    onSave(form)
    alert('Accounts Payable Aging guardado!')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">Accounts Payable Aging</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">CURRENT (0-30 DAYS)</label>
          <input type="number" name="current" value={form.current} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">31-60 DAYS</label>
          <input type="number" name="days30" value={form.days30} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">61-90 DAYS</label>
          <input type="number" name="days60" value={form.days60} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">90+ DAYS</label>
          <input type="number" name="days90Plus" value={form.days90Plus} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR</button>
    </div>
  )
}

// Depreciation Schedule Form
function DepreciationScheduleForm({ data, onSave }: any) {
  const [form, setForm] = useState({
    assetCost: 0,
    usefulLife: 0,
    residualValue: 0,
    annualDepreciation: 0,
    accumulatedDepreciation: 0,
    ...data
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleSave = () => {
    onSave(form)
    alert('Depreciation & Fixed Assets Schedule guardado!')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b-2 border-black pb-3">Depreciation & Fixed Assets Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-1">ASSET COST</label>
          <input type="number" name="assetCost" value={form.assetCost} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">USEFUL LIFE (YEARS)</label>
          <input type="number" name="usefulLife" value={form.usefulLife} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">RESIDUAL VALUE</label>
          <input type="number" name="residualValue" value={form.residualValue} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">ANNUAL DEPRECIATION</label>
          <input type="number" name="annualDepreciation" value={form.annualDepreciation} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="col-span-full">
          <label className="block text-sm font-semibold mb-1">ACCUMULATED DEPRECIATION</label>
          <input type="number" name="accumulatedDepreciation" value={form.accumulatedDepreciation} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800">GUARDAR</button>
    </div>
  )
}

