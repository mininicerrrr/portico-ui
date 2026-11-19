# Skeleton

Loading placeholder. `variant` can be text, card, or table; `animated` toggles the shimmer.

## Basic usage

<DemoBox>
  <pt-space direction="vertical" style="width: 100%">
    <pt-skeleton :rows="3" />
    <pt-skeleton variant="card" :rows="2" />
  </pt-space>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| rows | Rows | `number` | 3 |
| animated | Animated | `boolean` | true |
| variant | Variant | `'text' | 'card' | 'table'` | 'text' |

### Events

—
