import { prisma } from './prisma'

export interface Job {
  id: string
  type: 'POST_TO_TWITTER' | 'POST_TO_LINKEDIN'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  priority: number
  data: any
  scheduledAt: Date
  attempts: number
  maxAttempts: number
  error?: string
  createdAt: Date
  processedAt?: Date
}

export class JobQueue {
  static async addJob(type: 'POST_TO_TWITTER' | 'POST_TO_LINKEDIN', data: any, scheduledAt: Date, priority: number = 1): Promise<Job> {
    try {
      // For now, we'll create a simple job record
      // In a real implementation, you might want a dedicated Job table in your database
      const job = {
        id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        status: 'PENDING' as const,
        priority,
        data,
        scheduledAt,
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date()
      }

      // Store job in memory or database - for now we'll use a simple approach
      // In production, you'd want to store this in a proper database table
      console.log('Job added to queue:', job)
      
      return job
    } catch (error) {
      console.error('Failed to add job to queue:', error)
      throw error
    }
  }

  static async getPendingJobs(): Promise<Job[]> {
    try {
      // Get scheduled posts that are ready to be posted
      const scheduledPosts = await prisma.post.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledAt: {
            lte: new Date()
          }
        },
        include: {
          user: true
        }
      })

      // Convert posts to jobs
      return scheduledPosts.map(post => ({
        id: post.id,
        type: 'POST_TO_TWITTER' as const,
        status: 'PENDING' as const,
        priority: 1,
        data: {
          postId: post.id,
          content: post.content,
          userId: post.userId
        },
        scheduledAt: post.scheduledAt!,
        attempts: 0,
        maxAttempts: 3,
        createdAt: post.createdAt
      }))
    } catch (error) {
      console.error('Failed to get pending jobs:', error)
      return []
    }
  }

  static async markJobProcessing(jobId: string): Promise<void> {
    try {
      // Update post status to indicate processing
      await prisma.post.update({
        where: { id: jobId },
        data: { status: 'PUBLISHED' }
      })
    } catch (error) {
      console.error('Failed to mark job as processing:', error)
    }
  }

  static async markJobCompleted(jobId: string): Promise<void> {
    try {
      // Job is already marked as published in markJobProcessing
      console.log(`Job ${jobId} completed successfully`)
    } catch (error) {
      console.error('Failed to mark job as completed:', error)
    }
  }

  static async markJobFailed(jobId: string, error: string): Promise<void> {
    try {
      // Update post status back to scheduled with error info
      await prisma.post.update({
        where: { id: jobId },
        data: { 
          status: 'SCHEDULED',
          // You might want to add an error field to your Post model
        }
      })
      console.error(`Job ${jobId} failed:`, error)
    } catch (updateError) {
      console.error('Failed to mark job as failed:', updateError)
    }
  }
}
