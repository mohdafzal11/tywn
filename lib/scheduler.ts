import { JobQueue, Job } from './job-queue'
import { TwitterService } from './twitter-service'
import { prisma } from './prisma'

export class Scheduler {
  private static isRunning = false
  private static interval: NodeJS.Timeout | null = null

  static start(): void {
    if (this.isRunning) {
      console.log('Scheduler is already running')
      return
    }

    console.log('Starting scheduler...')
    this.isRunning = true

    // Check for scheduled jobs every 2 minutes
    this.interval = setInterval(() => {
      this.processScheduledJobs()
    }, 2 * 60 * 1000) // 2 minutes

    // Process immediately on start
    this.processScheduledJobs()
  }

  static stop(): void {
    if (!this.isRunning) {
      console.log('Scheduler is not running')
      return
    }

    console.log('Stopping scheduler...')
    this.isRunning = false

    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  static async processScheduledJobs(): Promise<void> {
    try {
      console.log('Checking for scheduled jobs...')
      
      const pendingJobs = await JobQueue.getPendingJobs()
      
      if (pendingJobs.length === 0) {
        console.log('No pending jobs found')
        return
      }

      console.log(`Found ${pendingJobs.length} pending jobs`)

      for (const job of pendingJobs) {
        await this.processJob(job)
      }
    } catch (error) {
      console.error('Error processing scheduled jobs:', error)
    }
  }

  private static async processJob(job: Job): Promise<void> {
    try {
      console.log(`Processing job: ${job.id}`)
      
      // Mark job as processing
      await JobQueue.markJobProcessing(job.id)

      // Get user credentials for the job
      const user = await prisma.user.findUnique({
        where: { id: job.data.userId }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Get user's Twitter channel credentials
      const channel = await prisma.channel.findFirst({
        where: {
          userId: user.id,
          type: 'twitter',
          isActive: true
        }
      })

      if (!channel) {
        throw new Error('Twitter channel not found or inactive')
      }

      // Process the job based on type
      let result
      switch (job.type) {
        case 'POST_TO_TWITTER':
          result = await TwitterService.postToTwitter(job.data.content, channel.keys)
          break
        default:
          throw new Error(`Unknown job type: ${job.type}`)
      }

      if (result.success) {
        // Update post with Twitter URL and published timestamp
        await prisma.post.update({
          where: { id: job.data.postId },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            publishPostUrl: result.tweetUrl
          }
        })

        await JobQueue.markJobCompleted(job.id)
        console.log(`Job ${job.id} completed successfully`)
      } else {
        // Mark job as failed
        await JobQueue.markJobFailed(job.id, result.error || 'Unknown error')
        console.error(`Job ${job.id} failed:`, result.error)
      }
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error)
      await JobQueue.markJobFailed(job.id, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  static async schedulePost(postId: string, scheduledAt: Date): Promise<void> {
    try {
      // Update post status to scheduled
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'SCHEDULED',
          scheduledAt
        }
      })

      console.log(`Post ${postId} scheduled for ${scheduledAt}`)
    } catch (error) {
      console.error('Failed to schedule post:', error)
      throw error
    }
  }

  static getStatus(): { isRunning: boolean; nextCheck?: Date } {
    return {
      isRunning: this.isRunning,
      nextCheck: this.interval ? new Date(Date.now() + 60 * 1000) : undefined
    }
  }
}
