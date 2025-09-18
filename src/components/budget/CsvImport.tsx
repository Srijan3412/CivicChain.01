import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const CsvImport: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadStatus('idle');
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const { data, error } = await supabase.functions.invoke('import-csv', {
        body: formData,
      });

      if (error) {
        throw error;
      }

      setUploadStatus('success');
      toast({
        title: "Import Successful",
        description: `${data.recordsImported} budget records imported successfully.`,
      });
      
      // Reset file selection
      setSelectedFile(null);
      const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error importing CSV:', error);
      setUploadStatus('error');
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Import Budget Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Upload a CSV file with columns: Ward, Year, Category, Amount
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('csv-file-input')?.click()}
              className="w-full justify-start"
            >
              <Upload className="h-4 w-4 mr-2" />
              {selectedFile ? selectedFile.name : 'Select CSV File'}
            </Button>
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="min-w-[100px]"
          >
            {isUploading ? 'Importing...' : 'Import'}
          </Button>
        </div>

        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            CSV imported successfully!
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            Failed to import CSV. Please check the file format.
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Expected CSV format:</strong></p>
          <code className="block mt-1 p-2 bg-muted rounded text-xs">
            Ward,Year,Category,Amount<br/>
            1,2023,Infrastructure,500000<br/>
            1,2023,Education,750000
          </code>
        </div>
      </CardContent>
    </Card>
  );
};