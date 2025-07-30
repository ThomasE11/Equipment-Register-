
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Building,
  Phone,
  Mail
} from 'lucide-react';
import { Equipment, MaintenanceRecord, ContactPerson, Manufacturer } from '@/lib/types';
import { AddMaintenanceContactModal } from '@/components/add-maintenance-contact-modal';

export function MaintenanceDashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      // Fetch equipment with maintenance data
      const equipmentResponse = await fetch('/api/equipment');
      if (equipmentResponse.ok) {
        const equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData);
      }

      // Fetch contact persons
      const contactsResponse = await fetch('/api/maintenance/contacts');
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContactPersons(contactsData);
      }

      // Fetch manufacturers
      const manufacturersResponse = await fetch('/api/maintenance/manufacturers');
      if (manufacturersResponse.ok) {
        const manufacturersData = await manufacturersResponse.json();
        setManufacturers(manufacturersData);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMaintenanceStats = () => {
    const today = new Date();
    const stats = {
      total: equipment.length,
      dueWithin30: 0,
      overdue: 0,
      upToDate: 0
    };

    equipment.forEach(item => {
      if (item.nextMaintenanceDate) {
        const nextMaintenance = new Date(item.nextMaintenanceDate);
        const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntil < 0) {
          stats.overdue++;
        } else if (daysUntil <= 30) {
          stats.dueWithin30++;
        } else {
          stats.upToDate++;
        }
      }
    });

    return stats;
  };

  const stats = getMaintenanceStats();

  const handleContactAdded = () => {
    fetchMaintenanceData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center animate-fade-in">
          <Wrench className="h-12 w-12 text-hct-orange mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-medium">Loading maintenance data...</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-hct-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-orange">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Under maintenance tracking</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Within 30 Days</CardTitle>
            <Calendar className="h-4 w-4 text-hct-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-blue">{stats.dueWithin30}</div>
            <p className="text-xs text-muted-foreground mt-1">Maintenance scheduled</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-hct-red" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-red">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Up to Date</CardTitle>
            <CheckCircle className="h-4 w-4 text-hct-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-green">{stats.upToDate}</div>
            <p className="text-xs text-muted-foreground mt-1">Good maintenance status</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overdue Items */}
                {stats.overdue > 0 && (
                  <div className="border-l-4 border-hct-red pl-4">
                    <h4 className="font-medium text-hct-red mb-2">Overdue Maintenance</h4>
                    <div className="space-y-2">
                      {equipment
                        .filter(item => {
                          if (!item.nextMaintenanceDate) return false;
                          const today = new Date();
                          const nextMaintenance = new Date(item.nextMaintenanceDate);
                          return nextMaintenance < today;
                        })
                        .map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.location}</p>
                            </div>
                            <Badge variant="destructive">
                              {item.nextMaintenanceDate ? 
                                Math.abs(Math.ceil((new Date(item.nextMaintenanceDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                                : 0} days overdue
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Due Within 30 Days */}
                {stats.dueWithin30 > 0 && (
                  <div className="border-l-4 border-hct-blue pl-4">
                    <h4 className="font-medium text-hct-blue mb-2">Due Within 30 Days</h4>
                    <div className="space-y-2">
                      {equipment
                        .filter(item => {
                          if (!item.nextMaintenanceDate) return false;
                          const today = new Date();
                          const nextMaintenance = new Date(item.nextMaintenanceDate);
                          const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          return daysUntil >= 0 && daysUntil <= 30;
                        })
                        .map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.location}</p>
                            </div>
                            <Badge variant="outline">
                              {item.nextMaintenanceDate ? 
                                Math.ceil((new Date(item.nextMaintenanceDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                : 0} days
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {stats.overdue === 0 && stats.dueWithin30 === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-hct-green mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">All equipment up to date</h3>
                    <p className="text-muted-foreground">
                      No maintenance required within the next 30 days.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact Persons</CardTitle>
                <Button 
                  onClick={() => setShowAddContactModal(true)}
                  className="bg-hct-orange hover:bg-hct-orange/90"
                >
                  <User className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {contactPersons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contactPersons.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{contact.name}</h4>
                        <Badge variant="outline">{contact.role || 'Contact'}</Badge>
                      </div>
                      {contact.company && (
                        <p className="text-sm text-muted-foreground mb-2">{contact.company}</p>
                      )}
                      <div className="space-y-1">
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No contacts added</h3>
                  <p className="text-muted-foreground mb-6">
                    Add maintenance contacts and support personnel for better equipment management.
                  </p>
                  <Button 
                    onClick={() => setShowAddContactModal(true)}
                    className="bg-hct-orange hover:bg-hct-orange/90"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Add First Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manufacturers" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manufacturers</CardTitle>
                <Button className="bg-hct-orange hover:bg-hct-orange/90">
                  <Building className="h-4 w-4 mr-2" />
                  Add Manufacturer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No manufacturers added</h3>
                <p className="text-muted-foreground mb-6">
                  Add manufacturer details for better equipment support and maintenance tracking.
                </p>
                <Button className="bg-hct-orange hover:bg-hct-orange/90">
                  <Building className="h-4 w-4 mr-2" />
                  Add First Manufacturer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Maintenance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No maintenance records</h3>
                <p className="text-muted-foreground">
                  Maintenance history will appear here as you perform and log maintenance activities.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Contact Modal */}
      <AddMaintenanceContactModal
        open={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onSuccess={handleContactAdded}
      />
    </div>
  );
}
