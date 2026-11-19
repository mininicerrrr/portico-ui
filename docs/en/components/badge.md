# Badge

A count or dot overlay. Values above `max` render as `99+`.

## Basic usage

<DemoBox>
  <pt-space :size="24">
    <pt-badge :value="8"><pt-button>Inbox</pt-button></pt-badge>
    <pt-badge :value="120" :max="99"><pt-button>Alerts</pt-button></pt-badge>
    <pt-badge is-dot type="primary"><pt-button>Dot</pt-button></pt-badge>
  </pt-space>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| value | Display value | `string | number` | — |
| max | Cap | `number` | 99 |
| isDot | Dot mode | `boolean` | false |
| type | Type | `'danger' | 'primary' | 'success' | 'warning' | 'info'` | 'danger' |
| hidden | Hide | `boolean` | false |

### Events

—
