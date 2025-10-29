"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  partId?: number
  currentImageUrl?: string
  onUploadSuccess?: (imageUrl: string) => void
  onUploadError?: (error: string) => void
  onImageDelete?: () => void
  className?: string
}

export function ImageUpload({ 
  partId, 
  currentImageUrl, 
  onUploadSuccess, 
  onUploadError,
  onImageDelete,
  className = ""
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (isValidImageFile(file)) {
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        onUploadError?.('Only JPEG, PNG, and WebP images are allowed')
      }
    }
  }, [onUploadError])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidImageFile(file)) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    } else if (file) {
      onUploadError?.('Only JPEG, PNG, and WebP images are allowed')
    }
  }, [onUploadError])

  const isValidImageFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return false
    }
    
    if (file.size > maxSize) {
      return false
    }
    
    return true
  }

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !partId) return

    setIsUploading(true)
    setUploadProgress(0)
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

    try {
      // Simulate progress (since we can't track real progress with fetch)
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
            }
            return 90
          }
          return prev + 10
        })
      }, 100)

      const { uploadApi } = await import("@/lib/api")
      const result = await uploadApi.uploadImage(selectedFile, partId)
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setUploadProgress(100)
      
      setTimeout(() => {
        setIsUploading(false)
        setSelectedFile(null)
        setPreviewUrl(null)
        onUploadSuccess?.(result.images.medium)
      }, 500)
      
    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setIsUploading(false)
      setUploadProgress(0)
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
    }
  }, [selectedFile, partId, onUploadSuccess, onUploadError])

  const handleDelete = useCallback(async () => {
    if (!partId) return

    try {
      const { uploadApi } = await import("@/lib/api")
      await uploadApi.deleteImage(partId)
      onImageDelete?.()
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Delete failed')
    }
  }, [partId, onImageDelete, onUploadError])

  const clearSelection = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
  }, [])

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Current Image Display */}
          {currentImageUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Image</label>
              <div className="relative group">
                <img
                  src={`http://localhost:5000${currentImageUrl}`}
                  alt="Current part image"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="m-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {currentImageUrl ? "Replace Image" : "Upload Image"}
            </label>
            
            {/* Preview */}
            {previewUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploading...</p>
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpload} className="flex-1">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <Button variant="outline" onClick={clearSelection}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm font-medium">Drop image here or click to browse</p>
                        <p className="text-xs text-muted-foreground">
                          JPEG, PNG, WebP up to 5MB
                        </p>
                      </div>
                      <Button 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        variant="outline"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {uploadProgress === 0 && selectedFile && (
            <div className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>File type or size not supported</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
