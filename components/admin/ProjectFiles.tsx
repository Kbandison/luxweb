'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Image, 
  File, 
  Plus, 
  Download, 
  Eye,
  Upload
} from 'lucide-react'

interface ProjectFile {
  id: string
  filename: string
  file_path: string
  file_type: string
  file_size: number
  is_public: boolean
  uploaded_by: string
  created_at: string
}

interface ProjectFilesProps {
  projectId: string
  clientId: string
  files: ProjectFile[]
}

export function ProjectFiles({ projectId, clientId, files }: ProjectFilesProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return <FileText className="w-4 h-4" />
    } else {
      return <File className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Project Files</h2>
        <Button size="sm" className="bg-primary-light hover:bg-primary-light/80">
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Files</h3>
          <p className="text-gray-400 mb-4">Upload files to share with your client</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-400">
                  {getFileIcon(file.file_type)}
                </div>
                <div>
                  <h3 className="font-medium text-white">{file.filename}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>Uploaded {formatDate(file.created_at)}</span>
                    {file.is_public && (
                      <Badge variant="outline" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}