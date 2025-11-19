"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
    onImageSelected?: (file: File) => void
}

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            onImageSelected?.(file)
        }
    }

    const handleRemove = () => {
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2"
                >
                    <Upload className="h-4 w-4" />
                    Upload Image
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {preview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={handleRemove}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}

            {!preview && (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 opacity-50" />
                        <span className="text-xs">No image selected</span>
                    </div>
                </div>
            )}
        </div>
    )
}
