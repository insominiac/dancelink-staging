#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Mapping of old API endpoints to new v2 endpoints
const apiMappings = {
  // Admin endpoints
  '/api/admin/users': '/api/v2/admin/users',
  '/api/admin/classes': '/api/v2/admin/classes',
  '/api/admin/events': '/api/v2/admin/events',
  '/api/admin/bookings': '/api/v2/admin/bookings',
  '/api/admin/instructors': '/api/v2/admin/instructors',
  '/api/admin/venues': '/api/v2/admin/venues',
  '/api/admin/dance-styles': '/api/v2/admin/dance-styles',
  '/api/admin/hosts': '/api/v2/admin/hosts',
  '/api/admin/notifications': '/api/v2/admin/notifications',
  '/api/admin/contact': '/api/v2/admin/contact',
  '/api/admin/content': '/api/v2/admin/content',
  '/api/admin/forum': '/api/v2/admin/forum',
  '/api/admin/seo': '/api/v2/admin/seo',
  '/api/admin/partner-matching': '/api/v2/admin/partner-matching',
  '/api/admin/audit-logs': '/api/v2/admin/audit-logs',
  '/api/admin/tables': '/api/v2/admin/tables',
  
  // Auth endpoints  
  '/api/auth/me': '/api/v2/auth/me',
  '/api/auth/login': '/api/v2/auth/login',
  '/api/auth/register': '/api/v2/auth/register',
  '/api/auth/logout': '/api/v2/auth/logout',
  '/api/auth/sessions': '/api/v2/auth/sessions',
  '/api/auth/demo-login': '/api/v2/auth/demo-login',
  '/api/auth/switch-role': '/api/v2/auth/switch-role',
  
  // Public endpoints
  '/api/public/classes': '/api/v2/public/classes',
  '/api/public/events': '/api/v2/public/events',
  '/api/public/instructors': '/api/v2/public/instructors',
  '/api/public/venues': '/api/v2/public/venues',
  '/api/public/dance-styles': '/api/v2/public/dance-styles',
  '/api/public/gallery': '/api/v2/public/gallery',
  '/api/public/forum': '/api/v2/public/forum',
  '/api/public/partner-search': '/api/v2/public/partner-search',
  
  // Utility endpoints  
  '/api/health': '/api/v2/utils/health',
  '/api/debug': '/api/v2/utils/debug',
  '/api/availability': '/api/v2/utils/availability',
  '/api/bookings': '/api/v2/utils/bookings',
  '/api/host': '/api/v2/utils/host',
  '/api/instructor': '/api/v2/utils/instructor',
  '/api/contact': '/api/v2/utils/contact'
}

function findFiles(dir, ext) {
  let results = []
  const list = fs.readdirSync(dir)
  
  list.forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules, .next, .git directories
      if (!['node_modules', '.next', '.git', 'prisma'].includes(file)) {
        results = results.concat(findFiles(fullPath, ext))
      }
    } else {
      if (fullPath.endsWith(ext)) {
        results.push(fullPath)
      }
    }
  })
  
  return results
}

function updateApiCalls(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let updated = false
  
  // Replace API calls
  Object.entries(apiMappings).forEach(([oldEndpoint, newEndpoint]) => {
    const regex = new RegExp(`(['"\`])${oldEndpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    if (content.match(regex)) {
      console.log(`${filePath}: ${oldEndpoint} → ${newEndpoint}`)
      content = content.replace(regex, `$1${newEndpoint}`)
      updated = true
    }
  })
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  
  return false
}

function main() {
  console.log('🔍 Finding and updating API calls...\n')
  
  const appDir = './app'
  const extensions = ['.tsx', '.ts', '.js', '.jsx']
  
  let totalUpdated = 0
  
  extensions.forEach(ext => {
    const files = findFiles(appDir, ext)
    
    files.forEach(file => {
      if (updateApiCalls(file)) {
        totalUpdated++
      }
    })
  })
  
  console.log(`\n✅ Updated ${totalUpdated} files with new API endpoints`)
  console.log('\n📝 Summary of changes:')
  console.log('- All /api/admin/* → /api/v2/admin/*')
  console.log('- All /api/auth/* → /api/v2/auth/*') 
  console.log('- All /api/public/* → /api/v2/public/*')
  console.log('- Utility endpoints → /api/v2/utils/*')
  
  console.log('\n⚠️  Manual review needed for:')
  console.log('- Dynamic API endpoint construction')
  console.log('- Template literals with variables')
  console.log('- Conditional API calls')
  
  console.log('\n🚀 The system should now connect to the consolidated v2 APIs!')
}

if (require.main === module) {
  main()
}