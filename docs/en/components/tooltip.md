# Tooltip

Hover or focus hint. Stacking uses `--pt-z-tooltip` (2500).

## Basic usage

<DemoBox>
  <pt-tooltip content="Save the current draft" placement="top">
    <pt-button>Hover me</pt-button>
  </pt-tooltip>
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Content | `string` | — |
| placement | Placement | `top / bottom / left / right 及 -start/-end` | 'top' |
| effect | Effect | `'dark' | 'light'` | 'dark' |
| disabled | Disabled | `boolean` | false |
| showAfter / hideAfter | Delay (ms) | `number` | 80 |

### Events

—
