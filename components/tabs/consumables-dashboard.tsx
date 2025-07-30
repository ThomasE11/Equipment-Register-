
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package2, 
  AlertTriangle, 
  DollarSign, 
  TrendingDown,
  Plus,
  Search,
  Filter,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { Consumable, ConsumableStats, ConsumableWishList, CONSUMABLE_CATEGORIES } from '@/lib/types';
import { AddConsumableModal } from '@/components/add-consumable-modal';
import { AddConsumableWishListModal } from '@/components/add-consumable-wish-list-modal';
import { DashboardSkeleton, StatsCardSkeleton, TableSkeleton } from '@/components/ui/skeleton-loader';
import { ErrorMessage } from '@/components/ui/error-message';

export function ConsumablesDashboard() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [wishLists, setWishLists] = useState<ConsumableWishList[]>([]);
  const [stats, setStats] = useState<ConsumableStats>({
    total: 0,
    lowStock: 0,
    expired: 0,
    byCategory: {},
    totalValue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddConsumableModal, setShowAddConsumableModal] = useState(false);
  const [showAddWishListModal, setShowAddWishListModal] = useState(false);

  useEffect(() => {
    fetchConsumablesData();
  }, []);

  const fetchConsumablesData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch consumables
      const consumablesResponse = await fetch('/api/consumables');
      if (consumablesResponse.ok) {
        const consumablesData = await consumablesResponse.json();
        setConsumables(consumablesData);
        calculateStats(consumablesData);
      } else {
        setError('Failed to load consumables data');
        return;
      }

      // Fetch consumable wish lists
      const wishListsResponse = await fetch('/api/consumables/wish-lists');
      if (wishListsResponse.ok) {
        const wishListsData = await wishListsResponse.json();
        setWishLists(wishListsData);
      }
    } catch (error) {
      console.error('Failed to fetch consumables data:', error);
      setError('Failed to load consumables data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (consumablesData: Consumable[]) => {
    const stats: ConsumableStats = {
      total: consumablesData.length,
      lowStock: 0,
      expired: 0,
      byCategory: {},
      totalValue: 0
    };

    const today = new Date();

    consumablesData.forEach(item => {
      // Category stats
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      
      // Total value
      if (item.totalValue) {
        stats.totalValue += item.totalValue;
      }
      
      // Low stock check
      if (item.currentStock <= item.minimumStock) {
        stats.lowStock++;
      }
      
      // Expired check
      if (item.expiryDate && new Date(item.expiryDate) < today) {
        stats.expired++;
      }
    });

    setStats(stats);
  };

  const getStockLevel = (item: Consumable) => {
    const percentage = (item.currentStock / item.minimumStock) * 100;
    if (percentage <= 25) return { level: 'Critical', color: 'bg-red-100 text-red-800' };
    if (percentage <= 50) return { level: 'Low', color: 'bg-orange-100 text-orange-800' };
    if (percentage <= 75) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Good', color: 'bg-green-100 text-green-800' };
  };

  const isExpired = (expiryDate: Date | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate: Date | null) => {
    if (!expiryDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(expiryDate) <= thirtyDaysFromNow && new Date(expiryDate) >= new Date();
  };

  const handleConsumableAdded = () => {
    fetchConsumablesData();
  };

  const handleWishListAdded = () => {
    fetchConsumablesData();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load consumables"
        message={error}
        onRetry={fetchConsumablesData}
        variant="page"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            <Package2 className="h-4 w-4 text-hct-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-purple">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Consumable items tracked</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-hct-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-orange">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground mt-1">Need replenishment</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-hct-red" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-red">{stats.expired}</div>
            <p className="text-xs text-muted-foreground mt-1">Require disposal</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-hct-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-green">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="wish-lists">Wish Lists</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Consumables Inventory</CardTitle>
                <Button 
                  onClick={() => setShowAddConsumableModal(true)}
                  className="bg-hct-purple hover:bg-hct-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Consumable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search consumables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="text-center py-12">
                <Package2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No consumables found</h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking your ambulance service training supplies and consumables.
                </p>
                <Button 
                  onClick={() => setShowAddConsumableModal(true)}
                  className="bg-hct-purple hover:bg-hct-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Consumable
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Consumable Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CONSUMABLE_CATEGORIES.map(category => (
                  <div key={category} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{category}</h4>
                      <Badge variant="outline">{stats.byCategory[category] || 0}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stats.byCategory[category] || 0} items in this category
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wish-lists" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Consumable Wish Lists</CardTitle>
                <Button 
                  onClick={() => setShowAddWishListModal(true)}
                  className="bg-hct-purple hover:bg-hct-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Wish List
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No wish lists found</h3>
                <p className="text-muted-foreground mb-6">
                  Create wish lists for consumables and training supplies you need to purchase.
                </p>
                <Button 
                  onClick={() => setShowAddWishListModal(true)}
                  className="bg-hct-purple hover:bg-hct-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Wish List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Alerts */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-hct-orange" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consumables
                    .filter(item => item.currentStock <= item.minimumStock)
                    .slice(0, 5)
                    .map((item) => {
                      const stockLevel = getStockLevel(item);
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.currentStock} remaining (Min: {item.minimumStock})
                            </p>
                          </div>
                          <Badge className={stockLevel.color}>{stockLevel.level}</Badge>
                        </div>
                      );
                    })}
                  {consumables.filter(item => item.currentStock <= item.minimumStock).length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No low stock items</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expiry Alerts */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-hct-red" />
                  Expiry Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consumables
                    .filter(item => item.expiryDate && (isExpired(item.expiryDate || null) || isExpiringSoon(item.expiryDate || null)))
                    .slice(0, 5)
                    .map((item) => {
                      const expired = isExpired(item.expiryDate || null);
                      const expiringSoon = isExpiringSoon(item.expiryDate || null);
                      const daysToExpiry = item.expiryDate ? 
                        Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                      
                      return (
                        <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${
                          expired ? 'bg-red-50' : 'bg-orange-50'
                        }`}>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {expired ? 'Expired' : `Expires in ${daysToExpiry} days`}
                            </p>
                          </div>
                          <Badge className={expired ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
                            {expired ? 'Expired' : 'Expiring Soon'}
                          </Badge>
                        </div>
                      );
                    })}
                  {consumables.filter(item => item.expiryDate && (isExpired(item.expiryDate || null) || isExpiringSoon(item.expiryDate || null))).length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No expiring items</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Consumable Modal */}
      <AddConsumableModal
        open={showAddConsumableModal}
        onClose={() => setShowAddConsumableModal(false)}
        onSuccess={handleConsumableAdded}
      />

      {/* Add Wish List Modal */}
      <AddConsumableWishListModal
        open={showAddWishListModal}
        onClose={() => setShowAddWishListModal(false)}
        onSuccess={handleWishListAdded}
      />
    </div>
  );
}
