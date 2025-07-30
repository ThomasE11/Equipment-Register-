
'use client';

import { useState } from 'react';
import { MainNav } from './main-nav';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-nav';
import { Package, PlusCircle } from 'lucide-react';
import { AddEquipmentModal } from '@/components/add-equipment-modal';
import { Equipment } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

// Import tab components (will be created)
import { EquipmentDashboard } from './tabs/equipment-dashboard';
import { ProcurementDashboard } from './tabs/procurement-dashboard';
import { MaintenanceDashboard } from './tabs/maintenance-dashboard';
import { ConsumablesDashboard } from './tabs/consumables-dashboard';
import { ReservationsDashboard } from './tabs/reservations-dashboard';
import { DocumentsDashboard } from './tabs/documents-dashboard';

export function ComprehensiveDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleEquipmentAdded = (newEquipment: Equipment) => {
    // Handle equipment added - this will be passed to child components
    setShowAddModal(false);
  };

  const renderActiveTab = () => {
    const tabVariants = {
      hidden: { 
        opacity: 0, 
        y: 20,
        transition: {
          duration: 0.2
        }
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        transition: {
          duration: 0.2
        }
      }
    };

    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <EquipmentDashboard />
          </motion.div>
        );
      case 'procurement':
        return (
          <motion.div
            key="procurement"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ProcurementDashboard />
          </motion.div>
        );
      case 'maintenance':
        return (
          <motion.div
            key="maintenance"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <MaintenanceDashboard />
          </motion.div>
        );
      case 'consumables':
        return (
          <motion.div
            key="consumables"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ConsumablesDashboard />
          </motion.div>
        );
      case 'reservations':
        return (
          <motion.div
            key="reservations"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ReservationsDashboard />
          </motion.div>
        );
      case 'documents':
        return (
          <motion.div
            key="documents"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DocumentsDashboard />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="dashboard"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <EquipmentDashboard />
          </motion.div>
        );
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Equipment Dashboard';
      case 'procurement':
        return 'Procurement Management';
      case 'maintenance':
        return 'Maintenance Management';
      case 'consumables':
        return 'Consumables Management';
      case 'reservations':
        return 'Equipment Reservations';
      case 'documents':
        return 'Document Repository';
      default:
        return 'Equipment Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 glass">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Mobile Header - Stacked Layout */}
          <div className="sm:hidden">
            {/* Top row - Logo and User Actions */}
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-hct-blue/10 border border-hct-blue/20">
                  <Package className="h-5 w-5 text-hct-blue" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-hct-red via-hct-blue to-hct-green bg-clip-text text-transparent">
                    Lab Management
                  </h1>
                  <p className="text-xs text-muted-foreground">HCT Clinical System</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
            
            {/* Second row - Add Equipment Button */}
            <div className="flex h-12 items-center">
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-hct-blue hover:bg-hct-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </div>

          {/* Desktop Header - Single Row Layout */}
          <div className="hidden sm:flex h-16 items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-hct-blue/10 border border-hct-blue/20">
                  <Package className="h-6 w-6 text-hct-blue" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-hct-red via-hct-blue to-hct-green bg-clip-text text-transparent">
                    Comprehensive Lab Management
                  </h1>
                  <p className="text-sm text-muted-foreground">HCT Clinical Equipment System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-hct-blue hover:bg-hct-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Add Equipment</span>
                <span className="md:hidden">Add</span>
              </Button>
              <UserNav />
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex h-14 items-center border-t border-border/50 overflow-x-auto">
            <MainNav 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              className="flex-1"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{getTabTitle()}</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {activeTab === 'dashboard' && 'Manage your equipment inventory with comprehensive tracking and analytics.'}
            {activeTab === 'procurement' && 'Handle purchase requests, wish lists, and procurement tracking.'}
            {activeTab === 'maintenance' && 'Enhanced maintenance management with contact and manufacturer details.'}
            {activeTab === 'consumables' && 'Track ambulance service training supplies and consumables inventory.'}
            {activeTab === 'reservations' && 'Manage equipment bookings, check-in/out, and rental tracking.'}
            {activeTab === 'documents' && 'Organize and manage all your documents, manuals, and records.'}
          </p>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            {renderActiveTab()}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onEquipmentAdded={handleEquipmentAdded}
      />
    </div>
  );
}
