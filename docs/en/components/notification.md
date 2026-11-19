# Notification

Imperative notification (top-right by default). v2: 6px radius, 1px border, no left type bar.

## Basic usage

<script setup>
import { notify } from 'portico-ui'
</script>
<DemoBox>
  <pt-button type="primary" @click="notify.success({ title: 'Saved', message: 'The record was updated.' })">Notify</pt-button>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title / message | Title / message | `string` | — |
| type | Type | `'success' | 'warning' | 'info' | 'error'` | 'info' |
| duration | Duration (0 = persist) | `number` | 4500 |
| position | Position | `top-right / top-left / bottom-right / bottom-left` | 'top-right' |
| showClose | Show close | `boolean` | true |

### Events

—（imperative API, returns { close }）
