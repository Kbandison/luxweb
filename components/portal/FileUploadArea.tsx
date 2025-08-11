'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'

interface FileUploadAreaProps {
  projects: any[]
}

export function FileUploadArea({ projects }: FileUploadAreaProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [description, setDescription] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    setError(null)
    
    // Filter out files that are too large (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is 50MB.`)
        return false
      }
      return true
    })

    setUploadFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return
    
    setIsUploading(true)
    setError(null)

    try {
      for (const file of uploadFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', selectedProject)
        formData.append('description', description)

        const response = await fetch('/api/portal/files/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }
      }

      // Reset form
      setUploadFiles([])
      setSelectedProject('')
      setDescription('')
      
      // Refresh page to show new files
      window.location.reload()
    } catch (error: any) {
      setError(error.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Upload Files</h2>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-white font-medium mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Support for images, documents, videos and more. Max 50MB per file.
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Selected Files */}
      {uploadFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-white font-medium">Selected Files ({uploadFiles.length})</h3>
          <div className="space-y-2">
            {uploadFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium text-sm">{file.name}</p>
                    <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Upload Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Project (Optional)
              </label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="" className="text-white">General Files</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="text-white">
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description (Optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for these files..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setUploadFiles([])}
              disabled={isUploading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear All
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || uploadFiles.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isUploading ? 'Uploading...' : `Upload ${uploadFiles.length} File${uploadFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}