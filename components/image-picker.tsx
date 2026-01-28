"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Upload, Loader2, Pencil, X } from "lucide-react";

export interface ImageOption {
  id: string;
  name: string;
  url: string;
}

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presets: ImageOption[];
  uploads?: ImageOption[];
  onImageUploaded?: (image: ImageOption) => void;
  onImageNameChanged?: (id: string, name: string) => void;
  onImageDeleted?: (id: string) => void;
  allowUpload?: boolean;
  accept?: string;
}

function extractFilename(file: File): string {
  // Remove extension and clean up the name
  const name = file.name.replace(/\.[^/.]+$/, "");
  // Replace underscores/dashes with spaces, capitalize first letter
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ImagePicker({
  label,
  value,
  onChange,
  presets,
  uploads = [],
  onImageUploaded,
  onImageNameChanged,
  onImageDeleted,
  allowUpload = true,
  accept = "image/*",
}: ImagePickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { url } = await response.json();

      // Create new image option with name from filename
      const newImage: ImageOption = {
        id: `upload-${Date.now()}`,
        name: extractFilename(file),
        url,
      };

      // Notify parent of new upload
      onImageUploaded?.(newImage);

      // Auto-select the newly uploaded image
      onChange(url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function startEditing(image: ImageOption) {
    setEditingId(image.id);
    setEditingName(image.name);
  }

  function saveEditing() {
    if (editingId && editingName.trim()) {
      onImageNameChanged?.(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingName("");
  }

  function renderImageTile(image: ImageOption, isUpload: boolean = false) {
    const isSelected = value === image.url;
    const isEditing = editingId === image.id;

    return (
      <div key={image.id} className="relative group">
        <button
          type="button"
          onClick={() => onChange(image.url)}
          className={cn(
            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all w-full",
            "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isSelected
              ? "border-primary ring-2 ring-primary ring-offset-2"
              : "border-border"
          )}
        >
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-full object-cover"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={saveEditing}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEditing();
                  if (e.key === "Escape") cancelEditing();
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-xs bg-black/50 text-white px-1 py-0.5 rounded border border-white/30 focus:outline-none focus:border-white"
                autoFocus
              />
            ) : (
              <span className="text-xs text-white truncate block">
                {image.name}
              </span>
            )}
          </div>
        </button>

        {/* Edit/Delete controls for uploads */}
        {isUpload && !isEditing && (
          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startEditing(image);
              }}
              className="p-1 bg-black/60 rounded hover:bg-black/80 transition-colors"
              title="Edit name"
            >
              <Pencil className="w-3 h-3 text-white" />
            </button>
            {onImageDeleted && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageDeleted(image.id);
                }}
                className="p-1 bg-black/60 rounded hover:bg-red-600 transition-colors"
                title="Remove"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      <div className="grid grid-cols-4 gap-3">
        {/* Preset images */}
        {presets.map((preset) => renderImageTile(preset, false))}

        {/* User uploaded images */}
        {uploads.map((upload) => renderImageTile(upload, true))}

        {/* Upload button - always visible */}
        {allowUpload && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "relative aspect-square rounded-lg border-2 border-dashed transition-all",
              "hover:border-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "flex flex-col items-center justify-center gap-2",
              "border-border"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
