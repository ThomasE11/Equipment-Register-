
'use client';

import { useState } from 'react';
import { Equipment, EquipmentFormData, AIAnalysisResult } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/image-upload';
import { EquipmentForm } from '@/components/equipment-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useButtonFeedback } from '@/hooks/use-button-feedback';

interface AddEquipmentModalProps {
  open: boolean;
  onClose: () => void;
  onEquipmentAdded: (equipment: Equipment) => void;
}

export function AddEquipmentModal({ open, onClose, onEquipmentAdded }: AddEquipmentModalProps) {
  const [currentStep, setCurrentStep] = useState<'upload' | 'form'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiData, setAiData] = useState<Partial<EquipmentFormData>>({});
  const [analysisConfidence, setAnalysisConfidence] = useState<number>(0);
  
  const [saveState, saveActions] = useButtonFeedback();

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result: AIAnalysisResult = await response.json();
        
        // Map AI results to form data
        const mappedData: Partial<EquipmentFormData> = {
          name: result.equipmentName || '',
          type: result.equipmentType || '',
          manufacturer: result.manufacturer || '',
          modelNumber: result.modelNumber || '',
          serialNumber: result.serialNumber || '',
          description: result.description || '',
        };
        
        // Parse dates if available
        if (result.maintenanceDate) {
          try {
            mappedData.lastMaintenanceDate = new Date(result.maintenanceDate);
          } catch (e) {
            console.warn('Failed to parse maintenance date:', result.maintenanceDate);
          }
        }
        
        setAiData(mappedData);
        setAnalysisConfidence(result.confidence);
        setCurrentStep('form');
      } else {
        console.error('Failed to analyze image');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFormSubmit = async (formData: EquipmentFormData) => {
    await saveActions.execute(
      async () => {
        const response = await fetch('/api/equipment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save equipment');
        }
        
        const newEquipment = await response.json();
        return newEquipment;
      },
      {
        onSuccess: (newEquipment) => {
          onEquipmentAdded(newEquipment);
          handleClose();
        },
        onError: (error) => {
          console.error('Error saving equipment:', error);
        },
        successDuration: 1000
      }
    );
  };

  const handleClose = () => {
    setCurrentStep('upload');
    setAiData({});
    setAnalysisConfidence(0);
    saveActions.reset();
    onClose();
  };

  const skipToForm = () => {
    setCurrentStep('form');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Add New Equipment</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>1. Upload & Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="form" disabled={currentStep === 'upload'} className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>2. Equipment Details</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="text-center py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Equipment Photo or Document
              </h3>
              <p className="text-sm text-gray-600">
                Our AI will analyze the image to automatically extract equipment details
              </p>
            </div>

            <ImageUpload
              onImageUpload={handleImageUpload}
              isAnalyzing={isAnalyzing}
              className="mb-6"
            />

            <div className="flex justify-center">
              <AnimatedButton 
                variant="outline" 
                onClick={skipToForm}
                disabled={isAnalyzing}
              >
                Skip AI Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </AnimatedButton>
            </div>
          </TabsContent>

          <TabsContent value="form" className="space-y-6">
            {analysisConfidence > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    AI Analysis Complete
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Confidence: {Math.round(analysisConfidence * 100)}% - Review and edit the pre-filled information below
                </p>
              </div>
            )}

            <EquipmentForm
              initialData={aiData}
              onSubmit={handleFormSubmit}
              onCancel={handleClose}
              isLoading={saveState.isLoading}
              isSuccess={saveState.isSuccess}
              isError={saveState.isError}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
