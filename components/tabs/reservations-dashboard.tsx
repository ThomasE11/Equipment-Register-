
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Users,
  Package,
  Activity
} from 'lucide-react';
import { Reservation, ReservationStats, Equipment } from '@/lib/types';
import { AddReservationModal } from '@/components/add-reservation-modal';

export function ReservationsDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [stats, setStats] = useState<ReservationStats>({
    total: 0,
    active: 0,
    overdue: 0,
    upcoming: 0,
    byStatus: {}
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReservationModal, setShowAddReservationModal] = useState(false);

  useEffect(() => {
    fetchReservationsData();
  }, []);

  const fetchReservationsData = async () => {
    try {
      // Fetch reservations
      const reservationsResponse = await fetch('/api/reservations');
      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        setReservations(reservationsData);
        calculateStats(reservationsData);
      }

      // Fetch equipment
      const equipmentResponse = await fetch('/api/equipment');
      if (equipmentResponse.ok) {
        const equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData);
      }
    } catch (error) {
      console.error('Failed to fetch reservations data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (reservationsData: Reservation[]) => {
    const stats: ReservationStats = {
      total: reservationsData.length,
      active: 0,
      overdue: 0,
      upcoming: 0,
      byStatus: {}
    };

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    reservationsData.forEach(reservation => {
      // Status stats
      stats.byStatus[reservation.status] = (stats.byStatus[reservation.status] || 0) + 1;
      
      // Count specific statuses
      if (reservation.status === 'IN_PROGRESS') {
        stats.active++;
      } else if (reservation.status === 'OVERDUE') {
        stats.overdue++;
      }
      
      // Count upcoming reservations
      const startDate = new Date(reservation.startDate);
      if (startDate >= today && startDate <= nextWeek) {
        stats.upcoming++;
      }
    });

    setStats(stats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilReturn = (endDate: Date) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReservationAdded = () => {
    fetchReservationsData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center animate-fade-in">
          <CalendarIcon className="h-12 w-12 text-hct-red mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-medium">Loading reservations data...</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reservations</CardTitle>
            <CalendarIcon className="h-4 w-4 text-hct-red" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-red">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time reservations</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <Activity className="h-4 w-4 text-hct-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-green">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently checked out</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-hct-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-orange">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground mt-1">Past return date</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-hct-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-blue">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Reservations */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-hct-green" />
                  Active Reservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reservations
                    .filter(reservation => reservation.status === 'IN_PROGRESS')
                    .slice(0, 5)
                    .map((reservation) => {
                      const daysUntilReturn = getDaysUntilReturn(reservation.endDate);
                      return (
                        <div key={reservation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium">{reservation.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {reservation.user?.name} • {reservation.purpose}
                            </p>
                          </div>
                          <Badge className={`${
                            daysUntilReturn < 0 ? 'bg-red-100 text-red-800' :
                            daysUntilReturn === 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {daysUntilReturn < 0 ? `${Math.abs(daysUntilReturn)} days overdue` :
                             daysUntilReturn === 0 ? 'Due today' :
                             `Due in ${daysUntilReturn} days`}
                          </Badge>
                        </div>
                      );
                    })}
                  {reservations.filter(reservation => reservation.status === 'IN_PROGRESS').length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No active reservations</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Items */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-hct-red" />
                  Overdue Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reservations
                    .filter(reservation => {
                      const daysUntilReturn = getDaysUntilReturn(reservation.endDate);
                      return daysUntilReturn < 0;
                    })
                    .slice(0, 5)
                    .map((reservation) => {
                      const daysOverdue = Math.abs(getDaysUntilReturn(reservation.endDate));
                      return (
                        <div key={reservation.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium">{reservation.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {reservation.user?.name} • {reservation.purpose}
                            </p>
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            {daysOverdue} days overdue
                          </Badge>
                        </div>
                      );
                    })}
                  {reservations.filter(reservation => getDaysUntilReturn(reservation.endDate) < 0).length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No overdue items</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Reservation Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedDate ? `Reservations for ${selectedDate.toDateString()}` : 'Select a date'}
                  </CardTitle>
                  <Button 
                    onClick={() => setShowAddReservationModal(true)}
                    className="bg-hct-red hover:bg-hct-red/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Reservation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No reservations found</h3>
                  <p className="text-muted-foreground">
                    {selectedDate ? 'No reservations scheduled for this date.' : 'Select a date to view reservations.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Reservations</CardTitle>
                <Button 
                  onClick={() => setShowAddReservationModal(true)}
                  className="bg-hct-red hover:bg-hct-red/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Reservation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No active reservations</h3>
                <p className="text-muted-foreground mb-6">
                  Equipment check-outs and active reservations will appear here.
                </p>
                <Button 
                  onClick={() => setShowAddReservationModal(true)}
                  className="bg-hct-red hover:bg-hct-red/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Reservation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-hct-red" />
                Overdue Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-hct-green mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No overdue items</h3>
                <p className="text-muted-foreground">
                  All equipment has been returned on time. Great job!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Reservation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No reservation history</h3>
                <p className="text-muted-foreground">
                  Past reservations and check-in/out history will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Reservation Modal */}
      <AddReservationModal
        open={showAddReservationModal}
        onClose={() => setShowAddReservationModal(false)}
        onSuccess={handleReservationAdded}
      />
    </div>
  );
}
