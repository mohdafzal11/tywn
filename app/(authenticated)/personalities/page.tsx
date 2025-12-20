"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from '@/components/auth-guard'
import { PersonalityForm } from '@/components/personality-form'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Brain } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { Personality } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      if (!response.ok) throw new Error('Failed to fetch')
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
        if (response.ok) fetchPersonalities()
      } catch (error) {
        console.error('Error:', error)
      }
    }
    setDeleteDialog({ isOpen: false, personalityId: null, personalityName: "" })
  }

  const cancelDelete = () => setDeleteDialog({ isOpen: false, personalityId: null, personalityName: "" })

  const handleFormSubmit = async (data: any) => {
    try {
      const url = editingPersonality ? `/api/personalities/${editingPersonality.id}` : '/api/personalities'
      const method = editingPersonality ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      setShowForm(false)
      fetchPersonalities()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personalities</h1>
            <p className="text-muted-foreground">Manage your AI persona configurations.</p>
          </div>
          {user?.role === 'ADMIN' && (
            <Button onClick={handleCreate}>
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
            <Card key={personality.id} className="overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={personality.profileImageUrl} alt={personality.name} />
                    <AvatarFallback><Brain className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{personality.name}</CardTitle>
                    <Badge variant={personality.isActive ? "default" : "secondary"} className="text-[10px] px-2 py-0">
                      {personality.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {user?.role === 'ADMIN' && (
                  <div className="flex gap-1 -mr-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(personality)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(personality)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="mt-4 flex-1">
                <CardDescription className="line-clamp-3 text-sm">
                  {personality.prompt}
                </CardDescription>

                {personality.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {personality.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {personalities.length === 0 && !showForm && (
          <div className="text-center py-12 border rounded-lg bg-muted/10 border-dashed">
            <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No personalities found</h3>
            <p className="text-sm text-muted-foreground mb-4">Get started by creating your first AI personality.</p>
            {user?.role === 'ADMIN' && (
              <Button onClick={handleCreate} variant="secondary">
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
