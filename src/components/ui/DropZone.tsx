import { useCallback, useState, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  children?: ReactNode;
  className?: string;
}

export function DropZone({ onFile, accept, children, className }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length > 0) setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = '';
  };

  return (
    <motion.div
      className={cn('sv-dropzone', isDragging && 'sv-dropzone-active', className)}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.15 }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {children || (
        <div className="sv-dropzone-content">
          <div className="sv-dropzone-icon">
            <Upload size={20} />
          </div>
          <p className="sv-dropzone-text">
            Drop a file here or <span className="sv-dropzone-link">browse</span>
          </p>
          <p className="sv-dropzone-hint">Any file type supported</p>
        </div>
      )}
    </motion.div>
  );
}
