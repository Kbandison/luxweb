'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download, Upload, File, Image, Archive, Video, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ProjectFilesProps {
  files: any[]
  projectId: string
}

const getFileIcon = (fileType: string) => {
  if (fileType?.startsWith('image/')) return Image
  if (fileType?.startsWith('video/')) return Video
  if (fileType?.includes('zip') || fileType?.includes('archive')) return Archive
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function ProjectFiles({ files, projectId }: ProjectFilesProps) {
  const [uploadMode, setUploadMode] = useState(false)
  
  // Filter only public files that the client can see
  const publicFiles = files.filter(file => file.is_public)

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(`/api/portal/files/download/${fileId}`)
      
      if (!response.ok) {
        throw new Error('Download failed')
      }

      // Create blob from response
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const handlePreview = (file: any) => {
    // Open preview in new tab
    const previewUrl = `/api/portal/files/preview/${file.id}`
    window.open(previewUrl, '_blank')
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Project Files</h2>
        <Button
          size="sm"
          onClick={() => setUploadMode(!uploadMode)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Upload Area */}
      {uploadMode && (
        <div className="mb-6 p-6 border-2 border-dashed border-gray-600 rounded-xl bg-gray-800/20">
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 mb-2">Drop files here or click to upload</p>
            <p className="text-gray-500 text-sm">
              Share files with your development team
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setUploadMode(false)}
              className="mt-4 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Files List */}
      {publicFiles.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No shared files yet</p>
          <p className="text-gray-500 text-sm">
            Files shared by your development team will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {publicFiles.map((file) => {
            const FileIcon = getFileIcon(file.file_type)
            const isImage = file.file_type?.startsWith('image/')
            
            return (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">
                      {file.original_filename || file.filename}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{formatFileSize(file.file_size || 0)}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {file.description && (
                      <p className="text-gray-500 text-xs mt-1 truncate">
                        {file.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Preview Button for Images */}
                  {isImage && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(file)}
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {/* Download Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(file.id, file.original_filename || file.filename)}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* File Stats */}
      {publicFiles.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            {publicFiles.length} file{publicFiles.length !== 1 ? 's' : ''} shared
          </p>
        </div>
      )}
    </div>
  )
}