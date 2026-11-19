# Divider

Separates sections. Horizontal dividers can include a label; vertical dividers sit inline with surrounding text.

## Basic usage

<DemoBox>
  <p>Above the line</p>
  <pt-divider>Note</pt-divider>
  <p>Below the line</p>
  <pt-divider content-position="left">Left</pt-divider>
  <div>
    <span>Inline</span>
    <pt-divider direction="vertical" />
    <span>text</span>
  </div>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| contentPosition | Label alignment, horizontal only | `'left' \| 'center' \| 'right'` | `'center'` |

## Slots

| Slot | Description |
| --- | --- |
| default | Optional label for a horizontal divider |
