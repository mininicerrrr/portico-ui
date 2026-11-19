import { afterEach } from 'vitest'
import { closeMessageHost } from '../src/components/message'
import { closeNotificationHost } from '../src/components/notification'
import '../src/styles/index.css'

afterEach(() => {
  closeMessageHost()
  closeNotificationHost()
})
