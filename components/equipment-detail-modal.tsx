
'use client';

import { useState } from 'react';
import { Equipment, MaintenanceRecord } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentForm } from '@/components/equipment-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  Wrench, 
  Calendar, 
  MapPin, 
  Package, 
  AlertTriangle,
  Clock,
  User,
  DollarSign,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  open: boolean;
  onClose: () => void;
  onEquipmentUpdated: (equipment: Equipment) => void;
}

export function EquipmentDetailModal({ 
  equipment, 
  open, 
  onClose, 
  onEquipmentUpdated 
}: EquipmentDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!equipment) return null;

  const getMaintenanceStatus = () => {
    if (!equipment.nextMaintenanceDate) return { status: 'unknown', label: 'No Schedule', variant: 'secondary' as const };
    
    const today = new Date();
    const nextMaintenance = new Date(equipment.nextMaintenanceDate);
    const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return { status: 'overdue', label: `${Math.abs(daysUntil)} days overdue`, variant: 'danger' as const };
    } else if (daysUntil <= 30) {
      return { status: 'due-soon', label: `Due in ${daysUntil} days`, variant: 'warning' as const };
    } else {
      return { status: 'ok', label: `Due ${format(nextMaintenance, 'MMM dd, yyyy')}`, variant: 'success' as const };
    }
  };

  const maintenanceStatus = getMaintenanceStatus();
  const primaryImage = equipment.images?.find(img => img.isPrimary) || equipment.images?.[0];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/equipment/${equipment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updatedEquipment = await response.json();
        onEquipmentUpdated(updatedEquipment);
        setIsEditing(false);
      } else {
        console.error('Failed to update equipment');
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-blue-600" />
              <span>Edit Equipment</span>
            </DialogTitle>
          </DialogHeader>

          <EquipmentForm
            equipment={equipment}
            onSubmit={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span>{equipment.name}</span>
              <Badge variant={maintenanceStatus.variant}>
                {maintenanceStatus.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {maintenanceStatus.label}
              </Badge>
            </DialogTitle>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Equipment Details</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Image */}
            {primaryImage && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={primaryImage.url}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                    <p className="text-sm text-gray-900">{equipment.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manufacturer</label>
                    <p className="text-sm text-gray-900">{equipment.manufacturer || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Model Number</label>
                    <p className="text-sm text-gray-900">{equipment.modelNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Serial Number</label>
                    <p className="text-sm text-gray-900">{equipment.serialNumber || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                    <p className="text-sm text-gray-900">{equipment.location}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                    <p className="text-sm text-gray-900">{equipment.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Condition</label>
                    <p className="text-sm text-gray-900">{equipment.condition.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Acquisition Date</label>
                    <p className="text-sm text-gray-900">
                      {equipment.acquisitionDate ? format(new Date(equipment.acquisitionDate), 'MMM dd, yyyy') : 'Not specified'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Maintenance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <Wrench className="h-4 w-4 mr-2" />
                  Maintenance Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Maintenance</label>
                  <p className="text-sm text-gray-900">
                    {equipment.lastMaintenanceDate 
                      ? format(new Date(equipment.lastMaintenanceDate), 'MMM dd, yyyy')
                      : 'No record'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Maintenance</label>
                  <p className="text-sm text-gray-900">
                    {equipment.nextMaintenanceDate 
                      ? format(new Date(equipment.nextMaintenanceDate), 'MMM dd, yyyy')
                      : 'Not scheduled'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interval</label>
                  <p className="text-sm text-gray-900">
                    {equipment.maintenanceInterval ? `${equipment.maintenanceInterval} days` : 'Not set'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Description and Notes */}
            {(equipment.description || equipment.notes) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {equipment.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{equipment.description}</p>
                    </CardContent>
                  </Card>
                )}
                
                {equipment.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{equipment.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            {equipment.maintenanceRecords && equipment.maintenanceRecords.length > 0 ? (
              <div className="space-y-4">
                {equipment.maintenanceRecords
                  .sort((a, b) => new Date(b.performedDate).getTime() - new Date(a.performedDate).getTime())
                  .map((record) => (
                    <Card key={record.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{record.type.replace('_', ' ')}</Badge>
                              <Badge 
                                variant={record.status === 'COMPLETED' ? 'success' : 'secondary'}
                              >
                                {record.status}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">{record.description}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(record.performedDate), 'MMM dd, yyyy')}
                              </div>
                              {record.performedBy && (
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {record.performedBy}
                                </div>
                              )}
                              {record.cost && (
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  ${record.cost.toFixed(2)}
                                </div>
                              )}
                            </div>
                            {record.notes && (
                              <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                            )}
                          </div>
                          {record.nextDueDate && (
                            <div className="text-right">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Due</label>
                              <p className="text-sm text-gray-900">
                                {format(new Date(record.nextDueDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Wrench className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records</h3>
                <p className="text-gray-600">
                  No maintenance history has been recorded for this equipment yet.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
