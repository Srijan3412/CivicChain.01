import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Upload, Camera, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const categories = [
  'Road Maintenance',
  'Drainage Issues', 
  'Street Lighting',
  'Waste Management',
  'Public Parks',
  'Traffic Management',
  'Water Supply',
  'Other'
];

const Feedback = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const uploadImages = async (files: FileList): Promise<string[]> => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('citizen_reports')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('citizen_reports')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !category) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in description and select a category.",
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrls: string[] = [];
      
      // Upload images if any
      if (files && files.length > 0) {
        toast({
          title: "Uploading Images",
          description: "Please wait while we upload your images...",
        });
        imageUrls = await uploadImages(files);
      }

      // Insert into database
      const { error } = await supabase
        .from('citizen_reports')
        .insert({
          description: description.trim(),
          category,
          image_urls: imageUrls,
          user_id: null // Allow anonymous submissions
        });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Report Submitted Successfully",
        description: "Thank you for your feedback. We will review your report.",
      });

      // Reset form
      setDescription('');
      setCategory('');
      setFiles(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit your report. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Check className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your report has been submitted successfully. Our team will review it and take appropriate action.
              </p>
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
            <MessageSquare className="mr-2 h-4 w-4" />
            Citizen Engagement
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Share Your <span className="bg-gradient-primary bg-clip-text text-transparent">Voice</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Report issues in your community. Help us improve municipal services by sharing 
            your concerns and observations with local government.
          </p>
        </div>

        {/* Report Form */}
        <Card className="max-w-2xl mx-auto bg-gradient-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              Submit a Report
            </CardTitle>
            <p className="text-muted-foreground">Help improve your community by reporting issues that need attention.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail (e.g., 'Large pothole on Main Street near the intersection with Oak Avenue')"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-input">Images (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Camera className="h-4 w-4" />
                    <span>Up to 10 images</span>
                  </div>
                </div>
                {files && files.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {files.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading || !description.trim() || !category}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-lg"
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-5 w-5" />
                {loading ? 'Submitting Report...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Anonymous Reporting</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No registration required. Report issues anonymously and help improve your community.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <Camera className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Photo Evidence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Include photos to help us better understand and address the issue quickly.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Check className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Quick Response</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reports are reviewed regularly and appropriate action is taken by relevant departments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;