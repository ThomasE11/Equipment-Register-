
'use client';

import { useState, useEffect } from 'react';
import { Equipment, EquipmentFormData, EQUIPMENT_LOCATIONS, EQUIPMENT_TYPES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Save, X } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';

interface EquipmentFormProps {
  equipment?: Equipment;
  initialData?: Partial<EquipmentFormData>;
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}

export function EquipmentForm({ 
  equipment, 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  isSuccess = false,
  isError = false
}: EquipmentFormProps) {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    type: '',
    description: '',
    location: '',
    manufacturer: '',
    serialNumber: '',
    modelNumber: '',
    acquisitionDate: undefined,
    lastMaintenanceDate: undefined,
    nextMaintenanceDate: undefined,
    maintenanceInterval: undefined,
    warrantyExpiration: undefined,
    status: 'ACTIVE',
    condition: 'GOOD',
    notes: '',
    ...initialData,
    ...(equipment && {
      name: equipment.name,
      type: equipment.type,
      description: equipment.description || '',
      location: equipment.location,
      manufacturer: equipment.manufacturer || '',
      serialNumber: equipment.serialNumber || '',
      modelNumber: equipment.modelNumber || '',
      acquisitionDate: equipment.acquisitionDate,
      lastMaintenanceDate: equipment.lastMaintenanceDate,
      nextMaintenanceDate: equipment.nextMaintenanceDate,
      maintenanceInterval: equipment.maintenanceInterval,
      warrantyExpiration: equipment.warrantyExpiration,
      status: equipment.status,
      condition: equipment.condition,
      notes: equipment.notes || '',
    })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof EquipmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const parseInputDate = (dateString: string) => {
    return dateString ? new Date(dateString) : undefined;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter equipment name"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Equipment Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment type" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select lab location" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => handleInputChange('manufacturer', e.target.value)}
              placeholder="Enter manufacturer"
            />
          </div>

          <div>
            <Label htmlFor="modelNumber">Model Number</Label>
            <Input
              id="modelNumber"
              value={formData.modelNumber}
              onChange={(e) => handleInputChange('modelNumber', e.target.value)}
              placeholder="Enter model number"
            />
          </div>

          <div>
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              placeholder="Enter serial number"
            />
          </div>
        </div>

        {/* Dates and Status */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="acquisitionDate">Acquisition Date</Label>
            <Input
              id="acquisitionDate"
              type="date"
              value={formatDateForInput(formData.acquisitionDate)}
              onChange={(e) => handleInputChange('acquisitionDate', parseInputDate(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
            <Input
              id="lastMaintenanceDate"
              type="date"
              value={formatDateForInput(formData.lastMaintenanceDate)}
              onChange={(e) => handleInputChange('lastMaintenanceDate', parseInputDate(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="nextMaintenanceDate">Next Maintenance Date</Label>
            <Input
              id="nextMaintenanceDate"
              type="date"
              value={formatDateForInput(formData.nextMaintenanceDate)}
              onChange={(e) => handleInputChange('nextMaintenanceDate', parseInputDate(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="maintenanceInterval">Maintenance Interval (days)</Label>
            <Input
              id="maintenanceInterval"
              type="number"
              value={formData.maintenanceInterval || ''}
              onChange={(e) => handleInputChange('maintenanceInterval', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g., 365"
            />
          </div>

          <div>
            <Label htmlFor="warrantyExpiration">Warranty Expiration</Label>
            <Input
              id="warrantyExpiration"
              type="date"
              value={formatDateForInput(formData.warrantyExpiration)}
              onChange={(e) => handleInputChange('warrantyExpiration', parseInputDate(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="IN_SERVICE">In Service</SelectItem>
                <SelectItem value="OUT_OF_ORDER">Out of Order</SelectItem>
                <SelectItem value="DECOMMISSIONED">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCELLENT">Excellent</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="FAIR">Fair</SelectItem>
                <SelectItem value="POOR">Poor</SelectItem>
                <SelectItem value="NEEDS_REPAIR">Needs Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Description and Notes */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter equipment description"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Enter any additional notes"
            rows={3}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <AnimatedButton 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </AnimatedButton>
        <AnimatedButton 
          type="submit" 
          disabled={isLoading || !formData.name || !formData.type || !formData.location}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          loadingText="Saving..."
          successText="Saved!"
          errorText="Error"
        >
          <Save className="h-4 w-4 mr-2" />
          {equipment ? 'Update Equipment' : 'Save Equipment'}
        </AnimatedButton>
      </div>
    </form>
  );
}
