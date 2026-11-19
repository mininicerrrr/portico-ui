# Button

Triggers an action. Supports semantic types, plain and text styles, sizes, disabled and loading states. The control is a native button and can be activated with the keyboard.

v2: 6px radius, 1px neutral border on default buttons or solid primary fill (`#3473CE`), no left lintel. Text buttons use soft gray hover/press fills. Focus is a 1px primary edge plus a 3px pale ring. Disabled uses explicit colors, not global opacity; loading keeps a 16px spinner without width shift.

<script setup>
import { ref } from 'vue'
const loading = ref(false)
function mockLoad() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1200)
}
</script>

## Basic usage

<DemoBox>
  <pt-space wrap>
    <pt-button>Default</pt-button>
    <pt-button type="primary">Primary</pt-button>
    <pt-button type="success">Success</pt-button>
    <pt-button type="warning">Warning</pt-button>
    <pt-button type="danger">Danger</pt-button>
    <pt-button type="info">Info</pt-button>
    <pt-button type="primary" plain>Plain</pt-button>
    <pt-button type="primary" text>Text</pt-button>
    <pt-button size="large" type="primary">Large</pt-button>
    <pt-button size="small" type="primary">Small</pt-button>
    <pt-button disabled>Disabled</pt-button>
    <pt-button type="primary" :loading="loading" @click="mockLoad">Loading</pt-button>
  </pt-space>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Visual type | `'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'` | `'default'` |
| plain | Plain style | `boolean` | `false` |
| text | Text style | `boolean` | `false` |
| size | Size | `'large' | 'default' | 'small'` | `'default'` |
| disabled | Disabled | `boolean` | `false` |
| loading | Loading, also disables the button | `boolean` | `false` |
| nativeType | Native `type` | `'button' | 'submit' | 'reset'` | `'button'` |

## Icon slot

Pass an icon through the `icon` slot rather than a per-icon variant. Icon-only buttons should set `aria-label`.

<DemoBox title="icon slot">
  <pt-space>
    <pt-button type="primary">
      <template #icon>+</template>
      Create
    </pt-button>
    <pt-button aria-label="More">⋯</pt-button>
  </pt-space>
</DemoBox>

```vue
<pt-button type="primary">
  <template #icon>+</template>
  Create
</pt-button>
```

### Slots (extra)

| Name | Description |
| --- | --- |
| icon | Optional icon to the left of the label; replaced by the spinner while loading |

