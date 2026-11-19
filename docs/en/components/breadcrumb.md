# Breadcrumb

Path navigation. The default separator is `/`. Pass `items` or child nodes.

## Basic usage

<DemoBox>
  <pt-breadcrumb :items="[{ label: 'Home', to: '#' }, { label: 'Users' }, { label: 'Detail' }]" />
</DemoBox>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| separator | Separator | `string` | '/' |
| items | Items `{ label, to? }` | `array` | [] |

### Events

—
