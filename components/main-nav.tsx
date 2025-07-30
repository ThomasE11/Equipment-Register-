
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Wrench, 
  Package2, 
  Calendar, 
  FileText,
  Home,
  TrendingUp
} from 'lucide-react';

export interface MainNavProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    description: 'Equipment inventory overview',
    color: 'text-hct-blue',
    bgColor: 'bg-hct-blue/10',
    borderColor: 'border-hct-blue'
  },
  {
    id: 'procurement',
    name: 'Procurement',
    icon: ShoppingCart,
    description: 'Purchase requests & wish lists',
    color: 'text-hct-green',
    bgColor: 'bg-hct-green/10',
    borderColor: 'border-hct-green'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: Wrench,
    description: 'Enhanced maintenance tracking',
    color: 'text-hct-orange',
    bgColor: 'bg-hct-orange/10',
    borderColor: 'border-hct-orange'
  },
  {
    id: 'consumables',
    name: 'Consumables',
    icon: Package2,
    description: 'Training supplies inventory',
    color: 'text-hct-purple',
    bgColor: 'bg-hct-purple/10',
    borderColor: 'border-hct-purple'
  },
  {
    id: 'reservations',
    name: 'Reservations',
    icon: Calendar,
    description: 'Equipment booking system',
    color: 'text-hct-red',
    bgColor: 'bg-hct-red/10',
    borderColor: 'border-hct-red'
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FileText,
    description: 'Document repository',
    color: 'text-hct-teal',
    bgColor: 'bg-hct-teal/10',
    borderColor: 'border-hct-teal'
  }
];

export function MainNav({ className, activeTab, onTabChange }: MainNavProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <nav className={cn('flex space-x-1 sm:space-x-2 lg:space-x-4 min-w-0', className)}>
      {navigation.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        const isHovered = hoveredTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onTabChange(item.id)}
            onMouseEnter={() => setHoveredTab(item.id)}
            onMouseLeave={() => setHoveredTab(null)}
            className={cn(
              'relative flex items-center space-x-2 text-sm font-medium transition-all duration-200 flex-shrink-0',
              'px-2 py-2 sm:px-3 sm:py-2', // Responsive padding
              'hover:shadow-md hover:scale-105',
              isActive 
                ? `${item.bgColor} ${item.color} ${item.borderColor} border shadow-md scale-105`
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <IconComponent className={cn(
              'h-4 w-4 flex-shrink-0',
              isActive ? item.color : 'text-muted-foreground'
            )} />
            <span className="hidden sm:block whitespace-nowrap">{item.name}</span>
            
            {/* Active indicator */}
            {isActive && (
              <div className={cn(
                'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full',
                item.color.replace('text-', 'bg-')
              )} />
            )}
            
            {/* Hover tooltip for small screens */}
            {isHovered && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 sm:hidden">
                <div className="bg-popover text-popover-foreground p-2 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground text-xs">{item.description}</div>
                </div>
              </div>
            )}
          </Button>
        );
      })}
    </nav>
  );
}
