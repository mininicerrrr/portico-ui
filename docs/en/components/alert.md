# Alert

Inline feedback with four semantic types, title, description, and optional close. v2: 8px radius, 1px border, semantic soft fills, no left rail.

## Basic usage

<DemoBox>
  <pt-space direction="vertical" style="width: 100%">
    <pt-alert type="success" title="Saved" description="Your changes were written." />
    <pt-alert type="warning" title="Heads up" description="This action cannot be undone." />
  </pt-space>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type | `'success' | 'warning' | 'error' | 'info'` | 'info' |
| title / description | Title / description | `string` | — |
| closable | Closable | `boolean` | true |
| showIcon | Show icon | `boolean` | true |

### Events

close
