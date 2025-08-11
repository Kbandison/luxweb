'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  Image,
  Video,
  Archive,
  File as FileIcon,
  Grid3X3,
  List,
  Filter
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface FilesListProps {
  files: any[]
}

const getFileIcon = (fileType: string) => {
  if (fileType?.startsWith('image/')) return Image
  if (fileType?.startsWith('video/')) return Video
  if (fileType?.includes('zip') || fileType?.includes('archive')) return Archive
  return FileIcon
}

const getFileTypeFilter = (fileType: string) => {
  if (fileType?.startsWith('image/')) return 'images'
  if (fileType?.startsWith('video/')) return 'videos'
  if (fileType?.includes('pdf') || fileType?.includes('doc') || fileType?.includes('text')) return 'documents'
  if (fileType?.includes('zip') || fileType?.includes('archive')) return 'archives'
  return 'other'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FilesList({ files }: FilesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique projects for filter
  const projects = Array.from(new Set(files.map(f => f.project?.project_name).filter(Boolean)))

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesSearch = (file.original_filename || file.filename)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || getFileTypeFilter(file.file_type) === typeFilter
    const matchesProject = projectFilter === 'all' || file.project?.project_name === projectFilter
    
    return matchesSearch && matchesType && matchesProject
  })

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
      // TODO: Show user-friendly error message
    }
  }

  const handlePreview = (file: any) => {
    // Open preview in new tab
    const previewUrl = `/api/portal/files/preview/${file.id}`
    window.open(previewUrl, '_blank')
  }

  if (files.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Files Shared Yet</h3>
          <p className="text-gray-400 mb-6">
            Files shared by your development team will appear here. You can also upload files to share with them.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and View Controls */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="all" className="text-white">All Types</SelectItem>
                <SelectItem value="images" className="text-white">Images</SelectItem>
                <SelectItem value="documents" className="text-white">Documents</SelectItem>
                <SelectItem value="videos" className="text-white">Videos</SelectItem>
                <SelectItem value="archives" className="text-white">Archives</SelectItem>
                <SelectItem value="other" className="text-white">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Project Filter */}
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="all" className="text-white">All Projects</SelectItem>
                <SelectItem value="" className="text-white">General Files</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project} value={project} className="text-white">
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode('grid')}
              className={`${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode('list')}
              className={`${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.file_type)
            const isImage = file.file_type?.startsWith('image/')
            
            return (
              <div
                key={file.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 group"
              >
                {/* File Icon/Preview */}
                <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center">
                  <FileIcon className="w-12 h-12 text-white/70" />
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-sm truncate">
                    {file.original_filename || file.filename}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{formatFileSize(file.file_size || 0)}</span>
                    <span>{formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}</span>
                  </div>
                  {file.project && (
                    <p className="text-blue-400 text-xs truncate">
                      {file.project.project_name}
                    </p>
                  )}
                  {file.description && (
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {file.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                  {isImage && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(file)}
                      className="text-gray-400 hover:text-white hover:bg-white/10 flex-1 mr-2"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(file.id, file.original_filename || file.filename)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Name</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Project</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Size</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Modified</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => {
                  const FileIconComponent = getFileIcon(file.file_type)
                  const isImage = file.file_type?.startsWith('image/')
                  
                  return (
                    <tr key={file.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <FileIconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {file.original_filename || file.filename}
                            </p>
                            {file.description && (
                              <p className="text-gray-400 text-xs truncate max-w-xs">
                                {file.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">
                          {file.project?.project_name || 'General'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(file.file_size || 0)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-400 text-sm">
                          {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(file.id, file.original_filename || file.filename)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredFiles.length === 0 && files.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
          <div className="text-center">
            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Files Found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}