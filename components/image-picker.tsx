"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Upload, Loader2 } from "lucide-react";

interface ImageOption {
  id: string;
  name: string;
  url: string;
}

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presets: ImageOption[];
  allowUpload?: boolean;
  accept?: string;
}

export function ImagePicker({
  label,
  value,
  onChange,
  presets,
  allowUpload = true,
  accept = "image/*",
}: ImagePickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current value is a preset or custom upload
  const isPreset = presets.some((p) => p.url === value);
  const isCustom = value && !isPreset;

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
      onChange(url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      <div className="grid grid-cols-4 gap-3">
        {/* Preset images */}
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.url)}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
              "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              value === preset.url
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-border"
            )}
          >
            <img
              src={preset.url}
              alt={preset.name}
              className="w-full h-full object-cover"
            />
            {value === preset.url && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <span className="text-xs text-white truncate block">
                {preset.name}
              </span>
            </div>
          </button>
        ))}

        {/* Upload button */}
        {allowUpload && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "relative aspect-square rounded-lg border-2 border-dashed transition-all",
              "hover:border-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "flex flex-col items-center justify-center gap-2",
              isCustom ? "border-primary bg-primary/10" : "border-border"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : isCustom ? (
              <>
                <img
                  src={value}
                  alt="Custom upload"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              </>
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
