import type { Environment } from 'vitest/environments'

export default (<Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('setup')

    return {
      async teardown() {
        console.log('teardown')
      },
    }
  },
})
