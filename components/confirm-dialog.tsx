"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-md w-full mx-4 bg-black">
        <h2 className="text-xl font-semibold text-[#E0E0E0] mb-4">{title}</h2>
        <p className="text-[#E0E0E0]/70 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-white/20 text-[#E0E0E0] hover:bg-white/10"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  )
}
