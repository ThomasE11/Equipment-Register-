
'use client';

import { Equipment } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Wrench, AlertTriangle, User, Package } from 'lucide-react';
import { format } from 'date-fns';

interface EquipmentCardProps {
  equipment: Equipment;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
}

export function EquipmentCard({ equipment, onClick, viewMode = 'grid' }: EquipmentCardProps) {
  const getMaintenanceStatus = () => {
    if (!equipment.nextMaintenanceDate) return { status: 'unknown', label: 'No Schedule', color: 'muted' };
    
    const today = new Date();
    const nextMaintenance = new Date(equipment.nextMaintenanceDate);
    const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return { 
        status: 'overdue', 
        label: `${Math.abs(daysUntil)} days overdue`, 
        color: 'hct-red' 
      };
    } else if (daysUntil <= 30) {
      return { 
        status: 'due-soon', 
        label: `Due in ${daysUntil} days`, 
        color: 'hct-orange' 
      };
    } else {
      return { 
        status: 'ok', 
        label: `Due ${format(nextMaintenance, 'MMM dd, yyyy')}`, 
        color: 'hct-green' 
      };
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT': return 'hct-green';
      case 'GOOD': return 'hct-blue';
      case 'FAIR': return 'hct-orange';
      case 'POOR': 
      case 'NEEDS_REPAIR': return 'hct-red';
      default: return 'muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'IN_SERVICE': return 'hct-green';
      case 'INACTIVE': return 'hct-orange';
      case 'OUT_OF_ORDER':
      case 'DECOMMISSIONED': return 'hct-red';
      default: return 'muted';
    }
  };

  const maintenanceStatus = getMaintenanceStatus();
  const primaryImage = equipment.images?.find(img => img.isPrimary) || equipment.images?.[0];

  if (viewMode === 'list') {
    return (
      <Card 
        className="equipment-card cursor-pointer group border-border/50 hover:border-hct-blue/50"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Image Section */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={equipment.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-hct-blue transition-colors truncate">
                    {equipment.name}
                  </h3>
                  <p className="text-muted-foreground">{equipment.type}</p>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Badge className={`text-xs bg-${getStatusColor(equipment.status)}/10 text-${getStatusColor(equipment.status)} border-${getStatusColor(equipment.status)}/20`}>
                    {equipment.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={`text-xs bg-${getConditionColor(equipment.condition)}/10 text-${getConditionColor(equipment.condition)} border-${getConditionColor(equipment.condition)}/20`}>
                    {equipment.condition}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-hct-blue" />
                  <span>{equipment.location}</span>
                </div>
                
                {equipment.manufacturer && (
                  <div className="flex items-center text-muted-foreground">
                    <User className="w-4 h-4 mr-2 text-hct-green" />
                    <span className="truncate">{equipment.manufacturer}</span>
                  </div>
                )}
                
                {equipment.lastMaintenanceDate && (
                  <div className="flex items-center text-muted-foreground">
                    <Wrench className="w-4 h-4 mr-2 text-hct-orange" />
                    <span>Last: {format(new Date(equipment.lastMaintenanceDate), 'MMM dd')}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-2 text-${maintenanceStatus.color}`} />
                  <span className={`text-${maintenanceStatus.color} text-xs font-medium`}>
                    {maintenanceStatus.label}
                  </span>
                  {maintenanceStatus.status === 'overdue' && (
                    <AlertTriangle className="w-3 h-3 ml-1 text-hct-red" />
                  )}
                </div>
              </div>

              {equipment.description && (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {equipment.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card 
      className="equipment-card cursor-pointer group border-border/50 hover:border-hct-blue/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold group-hover:text-hct-blue transition-colors truncate">
              {equipment.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{equipment.type}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={`text-xs bg-${maintenanceStatus.color}/10 text-${maintenanceStatus.color} border-${maintenanceStatus.color}/20`}>
              {maintenanceStatus.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {maintenanceStatus.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {primaryImage && (
          <div className="relative aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
            <img
              src={primaryImage.url}
              alt={equipment.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={`text-xs bg-${getStatusColor(equipment.status)}/10 text-${getStatusColor(equipment.status)} border-${getStatusColor(equipment.status)}/20`}>
              {equipment.status.replace('_', ' ')}
            </Badge>
            <Badge className={`text-xs bg-${getConditionColor(equipment.condition)}/10 text-${getConditionColor(equipment.condition)} border-${getConditionColor(equipment.condition)}/20`}>
              {equipment.condition}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-hct-blue flex-shrink-0" />
              <span className="truncate">{equipment.location}</span>
            </div>
            
            {equipment.manufacturer && (
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-2 text-hct-green flex-shrink-0" />
                <span className="truncate">{equipment.manufacturer}</span>
              </div>
            )}
            
            {equipment.lastMaintenanceDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Wrench className="w-4 h-4 mr-2 text-hct-orange flex-shrink-0" />
                <span className="truncate">Last: {format(new Date(equipment.lastMaintenanceDate), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        
        {equipment.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {equipment.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
