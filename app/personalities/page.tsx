"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from '@/components/auth-guard'
import { PersonalityForm } from '@/components/personality-form'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, Brain } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Personality } from "@/types"


export default function PersonalitiesPage() {
 
  const { user } = useUser()
  const [personalities, setPersonalities] = useState<Personality[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPersonality, setEditingPersonality] = useState<Personality | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    personalityId: string | null
    personalityName: string
  }>({ isOpen: false, personalityId: null, personalityName: "" })

  useEffect(() => {
    fetchPersonalities()
  }, [])

  const fetchPersonalities = async () => {
    try {
      const response = await fetch('/api/personalities')
      if (!response.ok) {
        throw new Error('Failed to fetch personalities')
      }
      const data = await response.json()
      setPersonalities(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching personalities:', error)
      setPersonalities([])
    } finally {
      setLoading(false)
    }
  }



  const handleCreate = () => {
    setEditingPersonality(null)
    setShowForm(true)
  }

  const handleEdit = (personality: Personality) => {
    setEditingPersonality(personality)
    setShowForm(true)
  }

  const handleDelete = (personality: Personality) => {
    setDeleteDialog({
      isOpen: true,
      personalityId: personality.id,
      personalityName: personality.name
    })
  }

  const confirmDelete = async () => {
    if (deleteDialog.personalityId) {
      try {
        const response = await fetch(`/api/personalities/${deleteDialog.personalityId}`, { method: 'DELETE' })
        
        if (response.ok) {
          fetchPersonalities()
        } else {
          const responseData = await response.json()
          console.error('DELETE request failed:', responseData)
        }
      } catch (error) {
        console.error('Error deactivating personality:', error)
      }
    }
    setDeleteDialog({ isOpen: false, personalityId: null, personalityName: "" })
  }

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, personalityId: null, personalityName: "" })
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPersonality) {
        await fetch(`/api/personalities/${editingPersonality.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } else {
        await fetch('/api/personalities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      }
      setShowForm(false)
      fetchPersonalities()
    } catch (error) {
      console.error('Error saving personality:', error)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64FFDA]"></div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#E0E0E0] glow">Personalities</h1>
          {user?.role === 'ADMIN' && (
            <Button onClick={handleCreate} className="bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Personality
            </Button>
          )}
        </div>

        {showForm && user?.role === 'ADMIN' && (
          <PersonalityForm
            personality={editingPersonality}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalities.map((personality) => (
            <Card key={personality.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {personality.profileImageUrl ? (
                    <img
                      src={personality.profileImageUrl}
                      alt={personality.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#64FFDA] to-[#9E4BFF] flex items-center justify-center mr-3">
                      <Brain className="h-6 w-6 text-[#050505]" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-[#E0E0E0]">{personality.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      personality.isActive 
                        ? 'bg-[#64FFDA]/20 text-[#64FFDA]' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {personality.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {user?.role === 'ADMIN' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(personality)}
                      className="text-[#E0E0E0]/70 hover:text-[#64FFDA]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(personality)}
                      className="text-[#E0E0E0]/70 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-[#E0E0E0]/70 mb-3 line-clamp-3">
                {personality.prompt}
              </p>
              
              {personality.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {personality.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-[#1a1a1a] text-[#64FFDA] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {personalities.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-[#E0E0E0]/30 mx-auto mb-4" />
            <p className="text-[#E0E0E0]/50">No personalities found</p>
            {user?.role === 'ADMIN' && (
              <Button onClick={handleCreate} className="mt-4 bg-[#64FFDA] text-[#050505] hover:bg-[#64FFDA]/90">
                <Plus className="mr-2 h-4 w-4" />
                Create First Personality
              </Button>
            )}
          </div>
        )}
      </div>
      
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Deactivate Personality"
        message={`Are you sure you want to deactivate "${deleteDialog.personalityName}"? This will hide it from the active personalities list.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </AuthGuard>
  )
}
