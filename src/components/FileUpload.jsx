import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Upload, X, Image } from 'lucide-react'
import { validateImageFile } from '../utils/api'

export function FileUpload({ onFileSelect, selectedFile, disabled }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelection(files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (disabled) return
    
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (file) => {
    try {
      validateImageFile(file)
      setError('')
      onFileSelect(file)
    } catch (err) {
      setError(err.message)
      onFileSelect(null)
    }
  }

  const clearFile = () => {
    setError('')
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full">
      <Card 
        className={`relative cursor-pointer transition-all duration-200 ${
          dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleChange}
            disabled={disabled}
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-50">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
                Upload X-ray Image
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your chest X-ray image here, or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Supports JPG, JPEG, PNG files up to 10MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
