import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File } from "lucide-react";
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  acceptedTypes: string[];
  maxSize: number;
  multiple?: boolean;
  onFileSelect?: (file: File | null) => void;
  onFilesSelect?: (files: File[]) => void;
  selectedFile?: File | null;
  selectedFiles?: File[];
}

const FileUpload = ({
  label,
  acceptedTypes,
  maxSize,
  multiple = false,
  onFileSelect,
  onFilesSelect,
  selectedFile,
  selectedFiles = []
}: FileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Convert acceptedTypes array to react-dropzone format
  const accept = acceptedTypes.reduce((acc, type) => {
    if (type.startsWith('.')) {
      // Handle file extensions
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.ofx': 'application/x-ofx',
        '.csv': 'text/csv',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      const mimeType = mimeTypes[type as keyof typeof mimeTypes];
      if (mimeType) {
        acc[mimeType] = [type];
      }
    }
    return acc;
  }, {} as Record<string, string[]>);

  const currentFiles = multiple ? selectedFiles : (selectedFile ? [selectedFile] : []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (multiple && onFilesSelect) {
      const newFiles = [...selectedFiles, ...acceptedFiles];
      onFilesSelect(newFiles);
    } else if (!multiple && onFileSelect && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }

    // Simulate upload progress
    acceptedFiles.forEach(file => {
      const fileName = file.name;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileName];
              return newProgress;
            });
          }, 1000);
        }
      }, 100);
    });
  }, [selectedFiles, multiple, onFilesSelect, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple
  });

  const removeFile = (index: number) => {
    if (multiple && onFilesSelect) {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      onFilesSelect(newFiles);
    } else if (!multiple && onFileSelect) {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">{label}</p>
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Solte os arquivos aqui..."
            : "Arraste arquivos aqui ou clique para selecionar"}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Formatos aceitos: {acceptedTypes.join(', ')} | Tamanho máximo: {formatFileSize(maxSize)}
        </p>
      </div>

      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Arquivos selecionados:</h4>
          {currentFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadProgress[file.name] && (
                  <div className="w-20">
                    <Progress value={uploadProgress[file.name]} className="h-2" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
