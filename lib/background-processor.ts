import { Scheduler } from './scheduler'

export class BackgroundProcessor {
  private static instance: BackgroundProcessor | null = null

  static getInstance(): BackgroundProcessor {
    if (!BackgroundProcessor.instance) {
      BackgroundProcessor.instance = new BackgroundProcessor()
    }
    return BackgroundProcessor.instance
  }

  start(): void {
    console.log('Starting background processor...')
    
    // Start the scheduler
    Scheduler.start()
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('Received SIGINT, shutting down gracefully...')
      this.stop()
      process.exit(0)
    })

    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, shutting down gracefully...')
      this.stop()
      process.exit(0)
    })

    console.log('Background processor started successfully')
  }

  stop(): void {
    console.log('Stopping background processor...')
    Scheduler.stop()
    console.log('Background processor stopped')
  }

  async healthCheck(): Promise<{ status: string; scheduler: any }> {
    const schedulerStatus = Scheduler.getStatus()
    
    return {
      status: 'healthy',
      scheduler: schedulerStatus
    }
  }
}

// Auto-start the background processor
const processor = BackgroundProcessor.getInstance()
processor.start()
