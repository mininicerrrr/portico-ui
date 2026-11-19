# Card

A surface for a related block of content, with optional header and footer.

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
