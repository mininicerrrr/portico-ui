# Message

Imperative toast at the top of the page. v2: 6px radius, 1px border, no left type bar.

<script setup>
import { message } from 'portico-ui'
</script>

## Basic usage

<DemoBox>
  <pt-space wrap>
    <pt-button type="success" @click="message.success('Saved')">Success</pt-button>
    <pt-button type="warning" @click="message.warning('Please review')">Warning</pt-button>
    <pt-button type="danger" @click="message.error('Failed')">Error</pt-button>
    <pt-button type="info" @click="message.info('Synced')">Info</pt-button>
  </pt-space>
</DemoBox>

```ts
import { message } from 'portico-ui'

message.success('Saved')
message({ message: 'Pinned', showClose: true, duration: 0 })
const handler = message.info('Working')
handler.close()
message.closeAll()
```

`this.$message` is available after `app.use(PorticoUI)`.

## Options

| Option | Description | Type | Default |
| --- | --- | --- | --- |
| message | Text | `string` | — |
| type | Visual type | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| duration | Auto-dismiss time in milliseconds; `0` keeps it open | `number` | `3000` |
| showClose | Show a close button | `boolean` | `false` |
| onClose | Called after the message is removed | `() => void` | — |

## API

| Method | Description |
| --- | --- |
| message(options \| string) | Show a message and return `{ close() }` |
| message.success / warning / info / error | Typed helpers |
| message.closeAll() | Dismiss every visible message |
