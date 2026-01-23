import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Image, Video, Link as LinkIcon, X, Upload } from "lucide-react";
import { z } from "zod";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  type: 'photo' | 'video' | 'link';
  url: string;
  thumbnail_url: string | null;
}

interface EditPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | undefined;
  portfolioItems: PortfolioItem[];
  onSave: () => void;
}

const portfolioItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  type: z.enum(['photo', 'video', 'link']),
  url: z.string().trim().min(1, "File or URL is required").max(2000, "URL is too long"),
});

const EditPortfolioDialog = ({ open, onOpenChange, userId, portfolioItems, onSave }: EditPortfolioDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | 'link'>('photo');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setShowAddForm(false);
      setFormData({ title: "", description: "", url: "" });
      setUploadedFileUrl(null);
      setErrors({});
    }
  }, [open]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type based on selected type
    if (selectedType === 'photo' && !file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (selectedType === 'video' && !file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = selectedType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${selectedType === 'video' ? '50MB' : '10MB'}`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // implementation here
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      setUploadedFileUrl(urlData.publicUrl);
      setFormData(prev => ({ ...prev, url: urlData.publicUrl }));

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    try {
      portfolioItemSchema.parse({
        title: formData.title,
        description: formData.description || undefined,
        type: selectedType,
        url: formData.url,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleAdd = async () => {
    if (!userId) return;
    if (!validateForm()) return;

    setIsLoading(true);

    // implementation here
    const { error } = await supabase
      .from('portfolio_items')
      .insert({
        user_id: userId,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        type: selectedType,
        url: formData.url.trim(),
      });

    setIsLoading(false);

    if (error) {
      console.error('Add portfolio item error:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Item added",
      description: "Portfolio item has been added",
    });

    setFormData({ title: "", description: "", url: "" });
    setUploadedFileUrl(null);
    setShowAddForm(false);
    onSave();
  };

  const handleDelete = async (id: string) => {
    // implementation here
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete portfolio item error:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Item deleted",
      description: "Portfolio item has been removed",
    });

    onSave();
  };

  const getTypeIcon = (type: 'photo' | 'video' | 'link') => {
    switch (type) {
      case 'photo': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setFormData({ title: "", description: "", url: "" });
    setUploadedFileUrl(null);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Existing Items */}
          {portfolioItems.length > 0 && (
            <div className="space-y-2">
              {portfolioItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {item.type === 'photo' && item.url ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Form */}
          {showAddForm ? (
            <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Add Item</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetForm}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2">
                  {(['photo', 'video', 'link'] as const).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedType(type);
                        setUploadedFileUrl(null);
                        setFormData(prev => ({ ...prev, url: "" }));
                      }}
                      className="flex-1 gap-2"
                    >
                      {getTypeIcon(type)}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Project name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              {/* File Upload for Photo/Video */}
              {(selectedType === 'photo' || selectedType === 'video') && (
                <div className="space-y-2">
                  <Label>Upload {selectedType === 'photo' ? 'Image' : 'Video'}</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={selectedType === 'photo' ? 'image/*' : 'video/*'}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {uploadedFileUrl ? (
                    <div className="relative rounded-xl overflow-hidden bg-muted">
                      {selectedType === 'photo' ? (
                        <img src={uploadedFileUrl} alt="Preview" className="w-full h-32 object-cover" />
                      ) : (
                        <video src={uploadedFileUrl} className="w-full h-32 object-cover" />
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleFileClick}
                        className="absolute bottom-2 right-2"
                        disabled={isUploading}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFileClick}
                      disabled={isUploading}
                      className="w-full h-24 flex-col gap-2 border-dashed"
                    >
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Click to upload {selectedType === 'photo' ? 'image' : 'video'}
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                  {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
                </div>
              )}

              {/* URL Input for Links */}
              {selectedType === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className={errors.url ? "border-destructive" : ""}
                  />
                  {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              <Button onClick={handleAdd} disabled={isLoading || isUploading} className="w-full">
                {isLoading ? "Adding..." : "Add Item"}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Portfolio Item
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPortfolioDialog;
