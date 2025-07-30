
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  Package,
  DollarSign
} from 'lucide-react';
import { ProcurementRequest, ProcurementStats, WishList } from '@/lib/types';
import { AddProcurementModal } from '@/components/add-procurement-modal';
import { AddProcurementWishListModal } from '@/components/add-procurement-wish-list-modal';

export function ProcurementDashboard() {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [wishLists, setWishLists] = useState<WishList[]>([]);
  const [stats, setStats] = useState<ProcurementStats>({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    byStatus: {},
    byCategory: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [showAddWishListModal, setShowAddWishListModal] = useState(false);

  useEffect(() => {
    fetchProcurementData();
  }, []);

  const fetchProcurementData = async () => {
    try {
      // Fetch procurement requests
      const requestsResponse = await fetch('/api/procurement/requests');
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);
        calculateStats(requestsData);
      }

      // Fetch wish lists
      const wishListsResponse = await fetch('/api/procurement/wish-lists');
      if (wishListsResponse.ok) {
        const wishListsData = await wishListsResponse.json();
        setWishLists(wishListsData);
      }
    } catch (error) {
      console.error('Failed to fetch procurement data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (requestsData: ProcurementRequest[]) => {
    const stats: ProcurementStats = {
      total: requestsData.length,
      pending: 0,
      approved: 0,
      completed: 0,
      byStatus: {},
      byCategory: {}
    };

    requestsData.forEach(request => {
      // Status stats
      stats.byStatus[request.status] = (stats.byStatus[request.status] || 0) + 1;
      
      // Category stats
      stats.byCategory[request.category] = (stats.byCategory[request.category] || 0) + 1;
      
      // Count specific statuses
      if (request.status === 'SUBMITTED' || request.status === 'UNDER_REVIEW') {
        stats.pending++;
      } else if (request.status === 'APPROVED') {
        stats.approved++;
      } else if (request.status === 'COMPLETED') {
        stats.completed++;
      }
    });

    setStats(stats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'ORDERED': return 'bg-purple-100 text-purple-800';
      case 'RECEIVED': return 'bg-indigo-100 text-indigo-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestAdded = () => {
    fetchProcurementData();
  };

  const handleWishListAdded = () => {
    fetchProcurementData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center animate-fade-in">
          <ShoppingCart className="h-12 w-12 text-hct-green mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-medium">Loading procurement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <ShoppingCart className="h-4 w-4 text-hct-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-green">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All procurement requests</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-hct-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-orange">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-hct-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-blue">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for procurement</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <Package className="h-4 w-4 text-hct-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-teal">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="wish-lists">Wish Lists</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Requests */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-hct-green" />
                  Recent Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-muted-foreground">{request.category}</p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No recent requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-hct-blue" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(status)} variant="secondary">
                          {status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Procurement Requests</CardTitle>
                <Button 
                  onClick={() => setShowAddRequestModal(true)}
                  className="bg-hct-green hover:bg-hct-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
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
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No requests found</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first procurement request.
                </p>
                <Button 
                  onClick={() => setShowAddRequestModal(true)}
                  className="bg-hct-green hover:bg-hct-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wish-lists" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Wish Lists</CardTitle>
                <Button 
                  onClick={() => setShowAddWishListModal(true)}
                  className="bg-hct-green hover:bg-hct-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Wish List
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No wish lists found</h3>
                <p className="text-muted-foreground mb-6">
                  Create wish lists to organize and track your procurement needs.
                </p>
                <Button 
                  onClick={() => setShowAddWishListModal(true)}
                  className="bg-hct-green hover:bg-hct-green/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Wish List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Procurement Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No active orders</h3>
                <p className="text-muted-foreground">
                  Track your procurement orders and delivery status here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Procurement Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Reports Coming Soon</h3>
                <p className="text-muted-foreground">
                  Comprehensive procurement analytics and reporting will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Request Modal */}
      <AddProcurementModal
        open={showAddRequestModal}
        onClose={() => setShowAddRequestModal(false)}
        onSuccess={handleRequestAdded}
      />

      {/* Add Wish List Modal */}
      <AddProcurementWishListModal
        open={showAddWishListModal}
        onClose={() => setShowAddWishListModal(false)}
        onSuccess={handleWishListAdded}
      />
    </div>
  );
}
