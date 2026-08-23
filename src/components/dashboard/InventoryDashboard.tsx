'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { getInventoryDashboardData } from '@/lib/db/dashboard-data';
import {
  Package,
  AlertTriangle,
  ArrowRightLeft,
  Truck,
  Bike,
  Plus,
  ArrowDownLeft,
  Wrench,
  CheckCircle2,
  Boxes,
} from 'lucide-react';

interface InventoryDashboardProps {
  onQuickAction: (actionKey: string) => void;
}

export function InventoryDashboard({ onQuickAction }: InventoryDashboardProps) {
  const data = getInventoryDashboardData();

  return (
    <div className="space-y-6">
      {/* Inventory Manager Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Vehicle & Spare Parts Inventory
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Inventory & Spares Head
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Showroom stock levels, factory consignment inward, critical spares replenishment, and branch transfers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onQuickAction('ADD_STOCK_INWARD')}
            className="gap-1.5 text-xs font-semibold h-9"
          >
            <Plus className="h-4 w-4" />
            Add Stock Inward
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('TRANSFER_STOCK')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <ArrowRightLeft className="h-4 w-4 text-hero" />
            Branch Stock Transfer
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('ADD_VENDOR')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <Truck className="h-4 w-4 text-emerald-600" />
            Register Vendor
          </Button>
        </div>
      </div>

      {/* Inventory KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-hero">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Stock Valuation
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.totalStockValue)}
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {data.kpis.totalBikesInStock} Bikes in showroom yard
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-hero-50 text-hero flex items-center justify-center">
              <Boxes className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 bg-rose-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Low / Out-of-Stock Spares
              </p>
              <h3 className="text-2xl font-bold text-rose-900 mt-1">
                {data.kpis.lowStockItemsCount} <span className="text-xs font-normal text-rose-600">Items</span>
              </h3>
              <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3" /> {data.kpis.outOfStockCount} items at 0 stock
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Incoming Factory Consignment
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.incomingUnitsExpected} <span className="text-xs font-normal text-slate-400">Bikes</span>
              </h3>
              <span className="text-[11px] text-blue-600 font-medium mt-1 block">
                In-transit from Hero MotoCorp plant
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Spare Parts Catalog Units
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.totalSparePartsUnits} <span className="text-xs font-normal text-slate-400">SKUs</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                Hero Genuine Parts (HGP) Active
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wrench className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRITICAL LOW STOCK & REORDER ALERTS TABLE */}
      <Card className="border-2 border-rose-300">
        <CardHeader className="bg-rose-50/70 flex flex-row items-center justify-between pb-3 border-b border-rose-200">
          <div>
            <CardTitle className="text-sm flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Critical Low Stock & Out-of-Stock Replenishment Alerts
            </CardTitle>
            <p className="text-xs text-rose-700 mt-0.5">
              Items below minimum safety threshold. Trigger purchase reorders to prevent workshop delays.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onQuickAction('ADD_STOCK_INWARD')}
            className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
          >
            + Create Purchase Reorder
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Part # / Model</th>
                  <th className="text-left p-3.5">Item Name & Category</th>
                  <th className="text-center p-3.5">Current Stock</th>
                  <th className="text-center p-3.5">Min Safety Threshold</th>
                  <th className="text-center p-3.5">Suggested Reorder</th>
                  <th className="text-right p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.criticalStock.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.status === 'OUT_OF_STOCK'
                        ? 'bg-rose-50/50 hover:bg-rose-50'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="p-3.5 font-bold font-mono text-hero">
                      {item.partNumberOrModel}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{item.itemName}</span>
                      <span className="text-[11px] text-slate-400">{item.category}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={item.currentStock === 0 ? 'danger' : 'warning'}
                        className="font-bold text-[10px]"
                      >
                        {item.currentStock === 0 ? '0 (Out of Stock)' : `${item.currentStock} Units Left`}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-center font-medium text-slate-600">
                      {item.minThreshold} Units
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-900">
                      +{item.reorderQuantity} Units
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        onClick={() => onQuickAction('ADD_STOCK_INWARD')}
                        className="text-[11px] h-7"
                      >
                        Reorder Now
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Inward & Inter-Branch Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 text-xs">
            {data.recentMovements.map((mv) => (
              <div key={mv.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{mv.item}</span>
                    <span className="text-[10px] text-slate-400">
                      Ref: {mv.ref} • {mv.date}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {mv.type.replace(/_/g, ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
