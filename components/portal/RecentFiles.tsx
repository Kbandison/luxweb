'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Download, ArrowRight, File, Image, Archive, Video } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RecentFilesProps {
  files: any[]
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return Image
  if (fileType.startsWith('video/')) return Video
  if (fileType.includes('zip') || fileType.includes('archive')) return Archive
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function RecentFiles({ files }: RecentFilesProps) {
  if (files.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Files</h2>
        </div>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No shared files yet</p>
          <p className="text-gray-500 text-sm">Files shared with you will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Files</h2>
        <Link href="/portal/files">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {files.map((file) => {
          const FileIcon = getFileIcon(file.file_type || '')
          
          return (
            <div key={file.id} className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-200 group">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate group-hover:text-white">
                    {file.original_filename || file.filename}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {file.project?.project_name || 'General'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{formatFileSize(file.file_size || 0)}</span>
                <span>
                  {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                </span>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-full text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => {
                  // TODO: Implement file download
                  console.log('Download file:', file.id)
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}