'use client'

import { FileText, Image, Archive, Video, File, Download, Upload } from 'lucide-react'

interface FilesHeaderProps {
  files: any[]
}

const getFileTypeStats = (files: any[]) => {
  const stats = {
    images: files.filter(f => f.file_type?.startsWith('image/')).length,
    documents: files.filter(f => 
      f.file_type?.includes('pdf') || 
      f.file_type?.includes('doc') || 
      f.file_type?.includes('text')
    ).length,
    videos: files.filter(f => f.file_type?.startsWith('video/')).length,
    archives: files.filter(f => 
      f.file_type?.includes('zip') || 
      f.file_type?.includes('archive')
    ).length,
    other: files.filter(f => {
      const type = f.file_type || ''
      return !type.startsWith('image/') && 
             !type.startsWith('video/') &&
             !type.includes('pdf') &&
             !type.includes('doc') &&
             !type.includes('text') &&
             !type.includes('zip') &&
             !type.includes('archive')
    }).length
  }
  return stats
}

const formatTotalSize = (files: any[]) => {
  const totalBytes = files.reduce((sum, file) => sum + (file.file_size || 0), 0)
  if (totalBytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(totalBytes) / Math.log(k))
  return parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FilesHeader({ files }: FilesHeaderProps) {
  const totalFiles = files.length
  const typeStats = getFileTypeStats(files)
  const totalSize = formatTotalSize(files)

  const stats = [
    {
      name: 'Total Files',
      value: totalFiles,
      detail: totalSize,
      icon: FileText,
      color: 'text-white',
      bgColor: 'bg-white/10'
    },
    {
      name: 'Images',
      value: typeStats.images,
      detail: 'Photos & Graphics',
      icon: Image,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      name: 'Documents',
      value: typeStats.documents,
      detail: 'PDFs & Docs',
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Media & Other',
      value: typeStats.videos + typeStats.archives + typeStats.other,
      detail: 'Videos & Archives',
      icon: Archive,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Shared Files</h1>
        <p className="text-gray-400">
          Access project files and share documents with your development team
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`${stat.bgColor} border border-white/10 rounded-2xl p-6`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.name}</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs">{stat.detail}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-white font-semibold mb-1">File Sharing</h3>
            <p className="text-gray-400 text-sm">
              Upload files to share with your development team or download shared resources
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-blue-400">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Files</span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="flex items-center space-x-2 text-green-400">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download All</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}