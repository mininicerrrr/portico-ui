import { afterEach } from 'vitest'
import { closeMessageHost } from '../src/components/message'
import '../src/styles/index.css'

afterEach(() => {
  closeMessageHost()
})
