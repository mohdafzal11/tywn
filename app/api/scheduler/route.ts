import { NextRequest, NextResponse } from 'next/server'
import { Scheduler } from '@/lib/scheduler'

// Global scheduler instance
let schedulerStarted = false

export async function GET(request: NextRequest) {
  try {
    const status = Scheduler.getStatus()
    
    return NextResponse.json({
      status: 'success',
      data: {
        isRunning: status.isRunning,
        nextCheck: status.isRunning ? new Date(Date.now() + 2 * 60 * 1000) : undefined,
        schedulerStarted
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get scheduler status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'start':
        if (!schedulerStarted) {
          Scheduler.start()
          schedulerStarted = true
          return NextResponse.json({
            status: 'success',
            message: 'Scheduler started successfully'
          })
        } else {
          return NextResponse.json({
            status: 'info',
            message: 'Scheduler is already running'
          })
        }

      case 'stop':
        if (schedulerStarted) {
          Scheduler.stop()
          schedulerStarted = false
          return NextResponse.json({
            status: 'success',
            message: 'Scheduler stopped successfully'
          })
        } else {
          return NextResponse.json({
            status: 'info',
            message: 'Scheduler is not running'
          })
        }

      case 'restart':
        Scheduler.stop()
        Scheduler.start()
        schedulerStarted = true
        return NextResponse.json({
          status: 'success',
          message: 'Scheduler restarted successfully'
        })

      case 'process':
        // Manual trigger to process scheduled jobs
        await Scheduler.processScheduledJobs()
        return NextResponse.json({
          status: 'success',
          message: 'Scheduled jobs processed successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: start, stop, restart, or process' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to manage scheduler', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
