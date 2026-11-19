# Card

A content surface with optional header/footer. v2: 1px border, 8px radius (`--pt-radius-l`), no top lintel; shadow via the `shadow` prop.

## Basic usage

<DemoBox>
  <pt-card header="Overview" style="max-width: 360px;">
    Cards can introduce a module, show a summary, or wrap a short form.
    <template #footer>
      <pt-button text type="primary">Learn more</pt-button>
    </template>
  </pt-card>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| header | Header text, ignored when the `header` slot is used | `string` | — |
| shadow | Shadow visibility | `'always' \| 'hover' \| 'never'` | `'always'` |
| bodyStyle | Inline styles for the body | `string \| Record<string, string>` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Body content |
| header | Custom header |
| footer | Footer content |
