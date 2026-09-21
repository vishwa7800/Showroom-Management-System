'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  VehicleUnitRecord,
  SparePartRecord,
  StockMovementRecord,
  StockTransferRecordItem,
  VendorRecord,
} from '@/lib/db/inventory-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Boxes,
  Layers,
  Truck,
  ArrowRightLeft,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  PieChart,
  Search,
  Printer,
  Sparkles,
  CheckCircle2,
  Wrench,
  TrendingUp,
  Package,
  Activity,
  History,
  Users,
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

export default function InventoryPage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'VEHICLES' | 'SPARES' | 'INWARD' | 'TRANSFERS' | 'MOVEMENTS' | 'VENDORS'
  >('OVERVIEW');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('ALL');
  const [spareCategoryFilter, setSpareCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Datasets
  const [vehicles, setVehicles] = useState<VehicleUnitRecord[]>([]);
  const [spareParts, setSpareParts] = useState<SparePartRecord[]>([]);
  const [movements, setMovements] = useState<StockMovementRecord[]>([]);
  const [transfers, setTransfers] = useState<StockTransferRecordItem[]>([]);
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [valuation, setValuation] = useState<any>(null);

  // Vehicle Inward Modal / Form State
  const [isInwardModalOpen, setIsInwardModalOpen] = useState(false);
  const [inwardForm, setInwardForm] = useState({
    vin: '',
    engineNumber: '',
    modelId: 'mdl_splendor',
    modelName: 'Hero Splendor Plus',
    variantName: 'XTEC Bluetooth',
    color: 'Canvas Black Matte',
    purchasePrice: 65500,
    sellingPrice: 79900,
  });

  // Spare Stock Adjustment Modal State
  const [selectedPartForAdjust, setSelectedPartForAdjust] = useState<SparePartRecord | null>(null);
  const [adjustDelta, setAdjustDelta] = useState(10);
  const [adjustReason, setAdjustReason] = useState('Vendor Stock Consignment Batch #HLV-501');

  // Inter-Branch Transfer Request Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    itemType: 'VEHICLE' as 'VEHICLE' | 'SPARE_PART',
    vehicleUnitId: '',
    itemDescription: '',
    targetBranchId: 'br_dhangadhra',
    targetBranchName: 'Dhangadhra Branch',
    notes: 'Urgent customer booking fulfillment',
  });

  const fetchInventoryData = async () => {
    try {
      setIsLoading(true);
      const [vehRes, spRes, movRes, trfRes, vndRes, valRes] = await Promise.all([
        fetch('/api/inventory/vehicles'),
        fetch('/api/inventory/spare-parts'),
        fetch('/api/inventory/movements'),
        fetch('/api/inventory/transfers'),
        fetch('/api/inventory/vendors'),
        fetch('/api/inventory/reports'),
      ]);

      const [vehData, spData, movData, trfData, vndData, valData] = await Promise.all([
        vehRes.json(),
        spRes.json(),
        movRes.json(),
        trfRes.json(),
        vndRes.json(),
        valRes.json(),
      ]);

      if (vehData.success) setVehicles(vehData.vehicles);
      if (spData.success) setSpareParts(spData.parts);
      if (movData.success) setMovements(movData.movements);
      if (trfData.success) setTransfers(trfData.transfers);
      if (vndData.success) setVendors(vndData.vendors);
      if (valData.success) setValuation(valData.valuation);
    } catch (e) {
      toast('Error', 'Failed to load inventory datasets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [activeBranchId]);

  // Handlers
  const handleInwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/inventory/inward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: inwardForm.vin.toUpperCase(),
          engineNumber: inwardForm.engineNumber.toUpperCase(),
          modelId: inwardForm.modelId,
          modelName: inwardForm.modelName,
          variantName: inwardForm.variantName,
          color: inwardForm.color,
          purchasePrice: Number(inwardForm.purchasePrice),
          sellingPrice: Number(inwardForm.sellingPrice),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Cannot Inward Stock', data.error, 'error');
        return;
      }

      toast(
        'Stock Inward Confirmed',
        `Vehicle ${data.unit.modelName} (VIN: ${data.unit.vin}) added to available stock.`,
        'success'
      );
      setIsInwardModalOpen(false);
      fetchInventoryData();
    } catch (e) {
      toast('Error', 'Network error during stock inward', 'error');
    }
  };

  const handleAdjustStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartForAdjust) return;

    try {
      const res = await fetch('/api/inventory/spare-parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sparePartId: selectedPartForAdjust.id,
          quantityDelta: Number(adjustDelta),
          reason: adjustReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Stock Adjustment Error', data.error, 'error');
        return;
      }

      toast(
        'Spare Stock Updated',
        `Part #${data.part.partNumber} (${data.part.name}) stock updated to ${data.part.currentStock} units.`,
        'success'
      );
      setSelectedPartForAdjust(null);
      fetchInventoryData();
    } catch (e) {
      toast('Error', 'Failed to adjust spare part stock', 'error');
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/inventory/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: transferForm.itemType,
          vehicleUnitId: transferForm.vehicleUnitId || undefined,
          itemDescription: transferForm.itemDescription,
          quantity: 1,
          sourceBranchId: activeBranchId || 'br_halvad',
          sourceBranchName: 'Halvad Branch',
          targetBranchId: transferForm.targetBranchId,
          targetBranchName: transferForm.targetBranchName,
          notes: transferForm.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Transfer Error', data.error, 'error');
        return;
      }

      toast(
        'Transfer Requested',
        `Transfer #${data.transfer.transferCode} initiated to ${data.transfer.targetBranchName}.`,
        'success'
      );
      setIsTransferModalOpen(false);
      fetchInventoryData();
    } catch (e) {
      toast('Error', 'Failed to request stock transfer', 'error');
    }
  };

  const handleConfirmTransferReceipt = async (transferId: string) => {
    try {
      const res = await fetch(`/api/inventory/transfers/${transferId}`, {
        method: 'PATCH',
      });

      const data = await res.json();
      if (data.success) {
        toast(
          'Transfer Confirmed & Received',
          `Item received and added to destination branch available inventory.`,
          'success'
        );
        fetchInventoryData();
      }
    } catch (e) {
      toast('Error', 'Failed to confirm transfer receipt', 'error');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = vehicleStatusFilter === 'ALL' || v.status === vehicleStatusFilter;
    const matchesSearch =
      v.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.engineNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredSpareParts = spareParts.filter((p) => {
    const matchesCat = spareCategoryFilter === 'ALL' || p.category === spareCategoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.compatibleModels.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Inventory & Vehicle Stock Management
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Stock Operations
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            2-Wheeler Units, Chassis/VIN Tracking, Hero Genuine Spares, Inter-Branch Transfers, and Stock Inward.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('inventory.create') && (
            <Button
              size="sm"
              onClick={() => setIsInwardModalOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Stock Inward</span>
            </Button>
          )}

          {can('inventory.transfer') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (vehicles.length > 0) {
                  setTransferForm({
                    itemType: 'VEHICLE',
                    vehicleUnitId: vehicles[0].id,
                    itemDescription: `${vehicles[0].modelName} (VIN: ${vehicles[0].vin})`,
                    targetBranchId: 'br_dhangadhra',
                    targetBranchName: 'Dhangadhra Branch',
                    notes: 'Showroom display transfer',
                  });
                }
                setIsTransferModalOpen(true);
              }}
              className="text-xs h-9 gap-1.5 text-slate-700"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-hero" />
              <span>Inter-Branch Transfer</span>
            </Button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold select-none bg-white px-4 pt-3 rounded-t-lg border-t border-x overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <PieChart className="h-4 w-4" />
          <span>Stock Health & Valuation</span>
        </button>

        <button
          onClick={() => setActiveTab('VEHICLES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'VEHICLES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>Vehicle Units ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SPARES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'SPARES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span>Spare Parts Catalog ({spareParts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TRANSFERS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'TRANSFERS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Inter-Branch Transfers ({transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MOVEMENTS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'MOVEMENTS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="h-4 w-4" />
          <span>Movement Audit Ledger ({movements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('VENDORS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'VENDORS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Suppliers & Vendors ({vendors.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & VALUATION */}
      {activeTab === 'OVERVIEW' && valuation && (
        <div className="space-y-6">
          {/* Valuation KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-hero">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Vehicle Stock Valuation
                </span>
                <Boxes className="h-5 w-5 text-hero" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {formatINR(valuation.vehicleStockValue)}
              </p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                {valuation.availableVehicles} Available Units • {valuation.inTransitVehicles} In Transit
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Spare Parts Valuation
                </span>
                <Wrench className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {formatINR(valuation.sparePartsStockValue)}
              </p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                {valuation.sparePartsCount} Distinct Hero SKUs
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Low-Stock Spares Alert
                </span>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xl font-bold text-amber-900 mt-2">
                {valuation.lowStockPartsCount} Parts Reorder Due
              </p>
              <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                {valuation.outOfStockPartsCount} Out of Stock
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Total Dealership Inventory
                </span>
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {formatINR(valuation.totalValuation)}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                ✓ Stored Asset Baseline
              </span>
            </Card>
          </div>

          {/* Critical Low Stock Alert Banner */}
          {spareParts.some((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Critical Spares Stock & Reorder Notice</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {spareParts
                  .filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK')
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded border border-amber-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-hero">{p.partNumber}</span>
                          <Badge
                            variant={p.status === 'OUT_OF_STOCK' ? 'danger' : 'warning'}
                            className="text-[9px] font-bold"
                          >
                            {p.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="font-semibold text-slate-800 mt-0.5">{p.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Current Stock: <strong className="text-red-600">{p.currentStock}</strong> / Min: {p.minStockLevel} (Suggest: +{p.reorderQuantity})
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPartForAdjust(p);
                          setAdjustDelta(p.reorderQuantity);
                          setAdjustReason(`Purchase Reorder from ${p.vendorName}`);
                        }}
                        className="text-[10px] h-7"
                      >
                        Reorder Stock
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PHYSICAL VEHICLE UNITS LEDGER */}
      {activeTab === 'VEHICLES' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Vehicle Stock Filter:</span>

            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {(['ALL', 'AVAILABLE', 'BOOKED', 'IN_TRANSIT', 'SOLD'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setVehicleStatusFilter(st)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                    vehicleStatusFilter === st
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="text-left p-3.5">VIN / Chassis Number</th>
                      <th className="text-left p-3.5">Engine Number</th>
                      <th className="text-left p-3.5">Model & Variant</th>
                      <th className="text-left p-3.5">Colour</th>
                      <th className="text-left p-3.5">Branch Location</th>
                      <th className="text-right p-3.5">Ex-Showroom</th>
                      <th className="text-center p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-hero">{v.vin}</td>
                        <td className="p-3.5 font-mono text-slate-600 font-medium">
                          {v.engineNumber}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 block">{v.modelName}</span>
                          <span className="text-[10px] text-slate-500">{v.variantName}</span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-800">{v.color}</td>
                        <td className="p-3.5">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Building2 className="h-3 w-3 text-slate-400" />
                            {v.branchName}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900">
                          {formatINR(v.sellingPrice)}
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge
                            variant={
                              v.status === 'AVAILABLE'
                                ? 'success'
                                : v.status === 'BOOKED'
                                ? 'warning'
                                : v.status === 'IN_TRANSIT'
                                ? 'info'
                                : 'outline'
                            }
                            className="text-[9px] font-bold"
                          >
                            {v.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: SPARE PARTS CATALOG */}
      {activeTab === 'SPARES' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Spare Parts Category:</span>

            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {(
                [
                  'ALL',
                  'LUBRICANT',
                  'BRAKES',
                  'ELECTRICALS',
                  'TRANSMISSION',
                  'FILTERS',
                ] as const
              ).map((c) => (
                <button
                  key={c}
                  onClick={() => setSpareCategoryFilter(c)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                    spareCategoryFilter === c
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="text-left p-3.5">Part # & Name</th>
                      <th className="text-left p-3.5">Category</th>
                      <th className="text-left p-3.5">Compatible Models</th>
                      <th className="text-right p-3.5">Unit MRP (₹)</th>
                      <th className="text-center p-3.5">Current Stock</th>
                      <th className="text-center p-3.5">Health Status</th>
                      <th className="text-right p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredSpareParts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <span className="font-bold font-mono text-hero block">{p.partNumber}</span>
                          <span className="font-semibold text-slate-900">{p.name}</span>
                        </td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[9px]">
                            {p.category}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-slate-600 max-w-[200px] truncate">
                          {p.compatibleModels}
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900">
                          {formatINR(p.unitPrice)}
                        </td>
                        <td className="p-3.5 text-center font-bold text-sm">
                          <span
                            className={
                              p.status === 'OUT_OF_STOCK'
                                ? 'text-red-600'
                                : p.status === 'LOW_STOCK'
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }
                          >
                            {p.currentStock} units
                          </span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            Min: {p.minStockLevel}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge
                            variant={
                              p.status === 'IN_STOCK'
                                ? 'success'
                                : p.status === 'LOW_STOCK'
                                ? 'warning'
                                : 'danger'
                            }
                            className="text-[9px] font-bold"
                          >
                            {p.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPartForAdjust(p);
                              setAdjustDelta(10);
                              setAdjustReason('Physical inventory stock reconciliation');
                            }}
                            className="text-[11px] h-7"
                          >
                            Adjust Stock
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: INTER-BRANCH TRANSFERS */}
      {activeTab === 'TRANSFERS' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Inter-Branch Stock Movement & Logistics</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Transfers between Halvad, Dhangadhra, and Jetpur branches with arrival confirmation.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsTransferModalOpen(true)}
              className="text-xs h-8 gap-1.5 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              Request Transfer
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Transfer Code</th>
                    <th className="text-left p-3.5">Item Transferred</th>
                    <th className="text-left p-3.5">Source Branch</th>
                    <th className="text-left p-3.5">Target Destination</th>
                    <th className="text-center p-3.5">Status</th>
                    <th className="text-right p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {transfers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-hero">{t.transferCode}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{t.itemDescription}</span>
                        <span className="text-[10px] text-slate-400">{t.itemType}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{t.sourceBranchName}</td>
                      <td className="p-3.5 font-medium text-slate-900">{t.targetBranchName}</td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={t.status === 'RECEIVED' ? 'success' : 'warning'}
                          className="text-[9px] font-bold"
                        >
                          {t.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        {t.status === 'IN_TRANSIT' ? (
                          <Button
                            size="sm"
                            onClick={() => handleConfirmTransferReceipt(t.id)}
                            className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700"
                          >
                            Confirm Receipt
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Received</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: STOCK MOVEMENTS LEDGER */}
      {activeTab === 'MOVEMENTS' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Immutable Stock Movement Audit Ledger</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Movement Code</th>
                    <th className="text-left p-3.5">Type</th>
                    <th className="text-left p-3.5">Item & Identifier</th>
                    <th className="text-center p-3.5">Qty</th>
                    <th className="text-left p-3.5">Reason & Reference</th>
                    <th className="text-left p-3.5">Recorded By</th>
                    <th className="text-right p-3.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-hero">{m.movementCode}</td>
                      <td className="p-3.5">
                        <Badge
                          variant={
                            m.movementType === 'INWARD'
                              ? 'success'
                              : m.movementType === 'SERVICE_CONSUMPTION'
                              ? 'hero'
                              : 'outline'
                          }
                          className="text-[9px] font-bold"
                        >
                          {m.movementType.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{m.itemName}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {m.itemIdentifier}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-900">
                        {m.quantity}
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-700 block">{m.reason}</span>
                        {m.referenceDoc && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Ref: {m.referenceDoc}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600">{m.actorName}</td>
                      <td className="p-3.5 text-right text-slate-400 text-[11px]">
                        {formatDate(m.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: VENDORS */}
      {activeTab === 'VENDORS' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Hero Spare Parts Suppliers & Vendors</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Vendor Name & Code</th>
                    <th className="text-left p-3.5">Contact Person & Phone</th>
                    <th className="text-left p-3.5">Supplied Categories</th>
                    <th className="text-left p-3.5">Payment Terms</th>
                    <th className="text-center p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vendors.map((vnd) => (
                    <tr key={vnd.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{vnd.name}</span>
                        <span className="font-mono text-[10px] text-hero">{vnd.code}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-800 font-medium block">{vnd.contactPerson}</span>
                        <span className="text-[10px] text-slate-400">{vnd.phone}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">{vnd.suppliedCategories}</td>
                      <td className="p-3.5 font-semibold text-slate-700">{vnd.paymentTerms}</td>
                      <td className="p-3.5 text-center">
                        <Badge variant="success" className="text-[9px] font-bold">
                          {vnd.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL: Stock Inward */}
      <Modal
        isOpen={isInwardModalOpen}
        onClose={() => setIsInwardModalOpen(false)}
        title="Vehicle Stock Inward Receipt"
        description="Inward new 2-wheeler physical stock units directly from factory consignment."
        size="lg"
      >
        <form onSubmit={handleInwardSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                VIN / Chassis Number (Unique)
              </label>
              <Input
                value={inwardForm.vin}
                onChange={(e) =>
                  setInwardForm({ ...inwardForm, vin: e.target.value.toUpperCase() })
                }
                placeholder="e.g. MBLHAW14XN9009999"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Engine Number (Unique)
              </label>
              <Input
                value={inwardForm.engineNumber}
                onChange={(e) =>
                  setInwardForm({ ...inwardForm, engineNumber: e.target.value.toUpperCase() })
                }
                placeholder="e.g. HA10EHN9009999"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hero Model</label>
              <select
                value={inwardForm.modelName}
                onChange={(e) => setInwardForm({ ...inwardForm, modelName: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Hero Splendor Plus">Hero Splendor Plus</option>
                <option value="Hero Passion Pro">Hero Passion Pro</option>
                <option value="Hero HF Deluxe">Hero HF Deluxe</option>
                <option value="Hero Xpulse 200 4V">Hero Xpulse 200 4V</option>
                <option value="Hero Xtreme 160R 4V">Hero Xtreme 160R 4V</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Variant</label>
              <Input
                value={inwardForm.variantName}
                onChange={(e) => setInwardForm({ ...inwardForm, variantName: e.target.value })}
                placeholder="e.g. XTEC Drum"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Colour</label>
              <Input
                value={inwardForm.color}
                onChange={(e) => setInwardForm({ ...inwardForm, color: e.target.value })}
                placeholder="e.g. Canvas Black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Factory Purchase Price (₹)</label>
              <Input
                type="number"
                value={inwardForm.purchasePrice}
                onChange={(e) =>
                  setInwardForm({ ...inwardForm, purchasePrice: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ex-Showroom Price (₹)</label>
              <Input
                type="number"
                value={inwardForm.sellingPrice}
                onChange={(e) =>
                  setInwardForm({ ...inwardForm, sellingPrice: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsInwardModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Confirm Inward & Add to Stock
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Spare Stock Adjustment */}
      {selectedPartForAdjust && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPartForAdjust(null)}
          title="Adjust Spare Part Stock Level"
          description={`Part #${selectedPartForAdjust.partNumber} - ${selectedPartForAdjust.name}`}
          size="md"
        >
          <form onSubmit={handleAdjustStockSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <p>
                <strong>Current Stock:</strong> {selectedPartForAdjust.currentStock} units
              </p>
              <p>
                <strong>Minimum Threshold:</strong> {selectedPartForAdjust.minStockLevel} units
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Quantity Delta (+/-)</label>
                <Input
                  type="number"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Total Stock</label>
                <p className="h-9 px-3 flex items-center font-bold text-slate-900 bg-slate-100 rounded border">
                  {Math.max(0, selectedPartForAdjust.currentStock + Number(adjustDelta))} units
                </p>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reason for Adjustment</label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Consignment inward batch #102"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedPartForAdjust(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Confirm Stock Adjustment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Inter-Branch Stock Transfer Request */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Request Inter-Branch Stock Transfer"
        description="Move available showroom units or spare parts between Halvad, Dhangadhra, and Jetpur."
        size="md"
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Available Unit</label>
            <select
              value={transferForm.vehicleUnitId}
              onChange={(e) => {
                const veh = vehicles.find((v) => v.id === e.target.value);
                setTransferForm({
                  ...transferForm,
                  vehicleUnitId: e.target.value,
                  itemDescription: veh ? `${veh.modelName} (VIN: ${veh.vin})` : '',
                });
              }}
              className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
            >
              {vehicles
                .filter((v) => v.status === 'AVAILABLE')
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.modelName} - {v.color} (VIN: {v.vin})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Destination Target Branch
            </label>
            <select
              value={transferForm.targetBranchId}
              onChange={(e) =>
                setTransferForm({
                  ...transferForm,
                  targetBranchId: e.target.value,
                  targetBranchName:
                    e.target.value === 'br_dhangadhra'
                      ? 'Dhangadhra Branch'
                      : e.target.value === 'br_jetpur'
                      ? 'Jetpur Branch'
                      : 'Halvad Branch',
                })
              }
              className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
            >
              <option value="br_dhangadhra">Dhangadhra Branch</option>
              <option value="br_jetpur">Jetpur Branch</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Transfer Notes</label>
            <Input
              value={transferForm.notes}
              onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
              placeholder="e.g. Urgent customer booking requirement"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTransferModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Dispatch Inter-Branch Transfer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
