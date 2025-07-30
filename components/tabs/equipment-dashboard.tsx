
'use client';

import { useState, useEffect } from 'react';
import { Equipment, EquipmentStats, EQUIPMENT_TYPES } from '@/lib/types';
import { EquipmentCard } from '@/components/equipment-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  Calendar, 
  MapPin,
  Monitor,
  Activity,
  Heart,
  Zap,
  ShieldCheck,
  Grid3X3,
  List,
  LayoutGrid
} from 'lucide-react';
import { EquipmentDetailModal } from '@/components/equipment-detail-modal';
import { DashboardSkeleton, StatsCardSkeleton, CardSkeleton } from '@/components/ui/skeleton-loader';
import { ErrorMessage } from '@/components/ui/error-message';
import { AnimatedCard } from '@/components/ui/animated-card';

// Equipment categories with icons and colors
const EQUIPMENT_CATEGORIES = [
  { 
    id: 'all', 
    name: 'All Equipment', 
    icon: LayoutGrid, 
    color: 'hct-blue',
    types: EQUIPMENT_TYPES
  },
  { 
    id: 'monitors', 
    name: 'Monitors', 
    icon: Monitor, 
    color: 'hct-green',
    types: ['Monitor']
  },
  { 
    id: 'simulators', 
    name: 'Simulators', 
    icon: Activity, 
    color: 'hct-blue',
    types: ['Simulator']
  },
  { 
    id: 'mannequins', 
    name: 'Mannequins', 
    icon: Heart, 
    color: 'hct-red',
    types: ['Mannequin']
  },
  { 
    id: 'emergency', 
    name: 'Emergency Equipment', 
    icon: Zap, 
    color: 'hct-red',
    types: ['Defibrillator', 'Jump Bag']
  },
  { 
    id: 'life-support', 
    name: 'Life Support', 
    icon: ShieldCheck, 
    color: 'hct-green',
    types: ['Ventilator', 'IV Pump', 'Oxygen Equipment']
  },
  { 
    id: 'transport', 
    name: 'Transport', 
    icon: Package, 
    color: 'hct-blue',
    types: ['Stretcher']
  }
];

export function EquipmentDashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [stats, setStats] = useState<EquipmentStats>({
    total: 0,
    maintenanceDue: 0,
    overdue: 0,
    byLocation: {},
    byStatus: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchTerm, locationFilter, statusFilter, categoryFilter]);

  const fetchEquipment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/equipment');
      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
        calculateStats(data);
      } else {
        setError('Failed to load equipment data');
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
      setError('Failed to load equipment data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (equipmentData: Equipment[]) => {
    const today = new Date();
    const stats: EquipmentStats = {
      total: equipmentData.length,
      maintenanceDue: 0,
      overdue: 0,
      byLocation: {},
      byStatus: {}
    };

    equipmentData.forEach(item => {
      // Location stats
      stats.byLocation[item.location] = (stats.byLocation[item.location] || 0) + 1;
      
      // Status stats
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
      
      // Maintenance stats
      if (item.nextMaintenanceDate) {
        const nextMaintenance = new Date(item.nextMaintenanceDate);
        const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntil < 0) {
          stats.overdue++;
        } else if (daysUntil <= 30) {
          stats.maintenanceDue++;
        }
      }
    });

    setStats(stats);
  };

  const filterEquipment = () => {
    let filtered = equipment;

    // Category filter
    if (categoryFilter !== 'all') {
      const category = EQUIPMENT_CATEGORIES.find(cat => cat.id === categoryFilter);
      if (category) {
        filtered = filtered.filter(item => category.types.includes(item.type as any));
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(item => item.location === locationFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'maintenance-due') {
        filtered = filtered.filter(item => {
          if (!item.nextMaintenanceDate) return false;
          const today = new Date();
          const nextMaintenance = new Date(item.nextMaintenanceDate);
          const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntil <= 30;
        });
      } else if (statusFilter === 'overdue') {
        filtered = filtered.filter(item => {
          if (!item.nextMaintenanceDate) return false;
          const today = new Date();
          const nextMaintenance = new Date(item.nextMaintenanceDate);
          const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntil < 0;
        });
      } else {
        filtered = filtered.filter(item => item.status === statusFilter);
      }
    }

    setFilteredEquipment(filtered);
  };

  const handleEquipmentUpdated = (updatedEquipment: Equipment) => {
    setEquipment(prev => prev.map(item => 
      item.id === updatedEquipment.id ? updatedEquipment : item
    ));
    setSelectedEquipment(updatedEquipment);
  };

  const getCategoryStats = (categoryId: string) => {
    if (categoryId === 'all') return equipment.length;
    const category = EQUIPMENT_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return 0;
    return equipment.filter(item => category.types.includes(item.type as any)).length;
  };

  const handleTotalEquipmentClick = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const handleMaintenanceDueClick = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setStatusFilter('maintenance-due');
    setCategoryFilter('all');
  };

  const handleOverdueClick = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setStatusFilter('overdue');
    setCategoryFilter('all');
  };

  const handleLocationsClick = () => {
    const locations = Object.keys(stats.byLocation);
    if (locations.length === 0) return;
    
    if (locationFilter === 'all') {
      setLocationFilter(locations[0]);
    } else {
      const currentIndex = locations.indexOf(locationFilter);
      const nextIndex = (currentIndex + 1) % locations.length;
      if (nextIndex === 0) {
        setLocationFilter('all');
      } else {
        setLocationFilter(locations[nextIndex]);
      }
    }
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load equipment"
        message={error}
        onRetry={fetchEquipment}
        variant="page"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard 
          className="border-border/50 hover:bg-muted/50 cursor-pointer"
          onClick={handleTotalEquipmentClick}
          delay={0}
          hoverScale={1.05}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
            <Package className="h-4 w-4 text-hct-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-blue animate-count-up">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Active inventory items</p>
            <p className="text-xs text-hct-blue/70 mt-1 font-medium">Click to show all</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard 
          className="border-border/50 hover:bg-muted/50 cursor-pointer"
          onClick={handleMaintenanceDueClick}
          delay={0.1}
          hoverScale={1.05}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Due</CardTitle>
            <Calendar className="h-4 w-4 text-hct-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-orange animate-count-up">{stats.maintenanceDue}</div>
            <p className="text-xs text-muted-foreground mt-1">Due within 30 days</p>
            <p className="text-xs text-hct-orange/70 mt-1 font-medium">Click to filter</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard 
          className="border-border/50 hover:bg-muted/50 cursor-pointer"
          onClick={handleOverdueClick}
          delay={0.2}
          hoverScale={1.05}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-hct-red" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-red animate-count-up">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground mt-1">Maintenance overdue</p>
            <p className="text-xs text-hct-red/70 mt-1 font-medium">Click to filter</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard 
          className="border-border/50 hover:bg-muted/50 cursor-pointer"
          onClick={handleLocationsClick}
          delay={0.3}
          hoverScale={1.05}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-hct-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-green animate-count-up">
              {Object.keys(stats.byLocation).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {locationFilter === 'all' ? 'Active lab locations' : `Showing: ${locationFilter}`}
            </p>
            <p className="text-xs text-hct-green/70 mt-1 font-medium">Click to cycle</p>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Category Filter */}
      <AnimatedCard className="border-border/50 p-4 sm:p-6" delay={0.4}>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Equipment Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {EQUIPMENT_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            const isActive = categoryFilter === category.id;
            const count = getCategoryStats(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`category-filter p-3 sm:p-4 rounded-xl border transition-all duration-200 text-center hover:shadow-md hover:scale-105 ${
                  isActive 
                    ? `bg-hct-blue border-hct-blue text-white shadow-lg ring-2 ring-offset-2 ring-offset-background ring-opacity-50` 
                    : 'bg-card hover:bg-muted border-border/50'
                }`}
              >
                <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 ${isActive ? 'text-white' : 'text-hct-blue'}`} />
                <div className={`text-xs font-medium ${isActive ? 'text-white' : 'text-foreground'}`}>
                  {category.name}
                </div>
                <div className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {count} items
                </div>
              </button>
            );
          })}
        </div>
      </AnimatedCard>

      {/* Controls */}
      <AnimatedCard className="border-border/50 p-4 sm:p-6" delay={0.5}>
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment, manufacturer, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border/50 focus:border-hct-blue"
            />
          </div>

          {/* Active Filters Indicator */}
          {(searchTerm || locationFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-hct-blue border-hct-blue">
                <Filter className="h-3 w-3 mr-1" />
                Filters Active
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTotalEquipmentClick}
                className="text-hct-red hover:text-hct-red hover:border-hct-red"
              >
                Clear All
              </Button>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-48 border-border/50">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {Object.keys(stats.byLocation).map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-border/50">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="IN_SERVICE">In Service</SelectItem>
                <SelectItem value="OUT_OF_ORDER">Out of Order</SelectItem>
                <SelectItem value="maintenance-due">Maintenance Due</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 bg-muted rounded-lg p-1 w-fit">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-hct-blue text-white' : ''}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-hct-blue text-white' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Equipment Display */}
      {filteredEquipment.length === 0 ? (
        <AnimatedCard className="border-border/50 p-12 text-center" delay={0.6}>
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No equipment found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            No equipment matches your current filters. Try adjusting your search criteria.
          </p>
        </AnimatedCard>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Equipment Inventory</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Showing {filteredEquipment.length} of {equipment.length} items
              </p>
            </div>
          </div>

          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              : "grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
          }>
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onClick={() => setSelectedEquipment(item)}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        equipment={selectedEquipment}
        open={!!selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        onEquipmentUpdated={handleEquipmentUpdated}
      />
    </div>
  );
}
