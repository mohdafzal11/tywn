import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying personalities in database...\n')
  
  try {
    // Get all personalities
    const personalities = await prisma.personality.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    if (personalities.length === 0) {
      console.log('❌ No personalities found in database!')
      console.log('💡 Run the seeding script first: npm run seed:personalities')
      return
    }
    
    console.log(`✅ Found ${personalities.length} personalities\n`)
    console.log('═'.repeat(80))
    
    // Display each personality
    personalities.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.name}`)
      console.log(`   ID: ${p.id}`)
      console.log(`   Active: ${p.isActive ? '✓' : '✗'}`)
      console.log(`   Tags: ${p.tags.join(', ')}`)
      console.log(`   Image: ${p.profileImageUrl || 'None'}`)
      console.log(`   Prompt Length: ${p.prompt.length} characters`)
      console.log(`   Created: ${p.createdAt.toISOString()}`)
      console.log('─'.repeat(80))
    })
    
    // Statistics
    console.log('\n📊 Statistics:')
    console.log(`   Total Personalities: ${personalities.length}`)
    console.log(`   Active: ${personalities.filter(p => p.isActive).length}`)
    console.log(`   Inactive: ${personalities.filter(p => !p.isActive).length}`)
    console.log(`   With Images: ${personalities.filter(p => p.profileImageUrl).length}`)
    console.log(`   Without Images: ${personalities.filter(p => !p.profileImageUrl).length}`)
    
    // All unique tags
    const allTags = new Set<string>()
    personalities.forEach(p => p.tags.forEach(tag => allTags.add(tag)))
    console.log(`   Unique Tags: ${allTags.size}`)
    console.log(`   Tags: ${Array.from(allTags).sort().join(', ')}`)
    
    // Average prompt length
    const avgPromptLength = Math.round(
      personalities.reduce((sum, p) => sum + p.prompt.length, 0) / personalities.length
    )
    console.log(`   Average Prompt Length: ${avgPromptLength} characters`)
    
    console.log('\n✅ Verification complete!')
    
  } catch (error) {
    console.error('❌ Error verifying personalities:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

