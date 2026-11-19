# Button 按钮

用于触发操作。支持语义类型、朴素/文字样式、尺寸、禁用和加载状态。按钮可被键盘聚焦，并响应 Enter / Space。

填充的主色与语义按钮使用 2px 圆角，左侧有 3px 门楣（主色为 `--pt-color-primary-ink`，其它类型为对应的 `-active` 色）。默认与朴素按钮是 2px 描边，没有门楣。文字按钮无描边、无门楣，悬停为浅底。焦点是硬边 2px 偏移环，没有柔和光晕。禁用与加载态透明度为 0.55，门楣保留。

## 基础用法

<script setup>
import { ref } from 'vue'
const loading = ref(false)
function mockLoad() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1200)
}
</script>

<DemoBox title="类型">
  <pt-space wrap>
    <pt-button>默认按钮</pt-button>
    <pt-button type="primary">主要按钮</pt-button>
    <pt-button type="success">成功按钮</pt-button>
    <pt-button type="warning">警告按钮</pt-button>
    <pt-button type="danger">危险按钮</pt-button>
    <pt-button type="info">信息按钮</pt-button>
  </pt-space>
</DemoBox>

```vue
<pt-button>默认按钮</pt-button>
<pt-button type="primary">主要按钮</pt-button>
```

## 朴素与文字

<DemoBox title="plain / text">
  <pt-space wrap>
    <pt-button plain>朴素</pt-button>
    <pt-button type="primary" plain>主要</pt-button>
    <pt-button type="success" plain>成功</pt-button>
    <pt-button type="danger" plain>危险</pt-button>
    <pt-button text>文字</pt-button>
    <pt-button type="primary" text>主要文字</pt-button>
    <pt-button type="danger" text>危险文字</pt-button>
  </pt-space>
</DemoBox>

## 尺寸、禁用与加载

<DemoBox>
  <pt-space wrap>
    <pt-button size="large" type="primary">大型</pt-button>
    <pt-button type="primary">默认</pt-button>
    <pt-button size="small" type="primary">小型</pt-button>
    <pt-button disabled>禁用</pt-button>
    <pt-button type="primary" :loading="loading" @click="mockLoad">加载中</pt-button>
  </pt-space>
</DemoBox>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| plain | 朴素按钮 | `boolean` | `false` |
| text | 文字按钮 | `boolean` | `false` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| disabled | 禁用 | `boolean` | `false` |
| loading | 加载中，同时禁用交互 | `boolean` | `false` |
| nativeType | 原生 type | `'button' \| 'submit' \| 'reset'` | `'button'` |
| autofocus | 自动聚焦 | `boolean` | `false` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |

## 图标插槽

图标通过 `icon` 插槽传入，而不是为每种图标做变体。仅图标的按钮请同时提供 `aria-label`。

<DemoBox title="icon 插槽">
  <pt-space>
    <pt-button type="primary">
      <template #icon>+</template>
      新建
    </pt-button>
    <pt-button aria-label="更多">⋯</pt-button>
  </pt-space>
</DemoBox>

```vue
<pt-button type="primary">
  <template #icon>+</template>
  新建
</pt-button>
```

### Slots（补充）

| 名称 | 说明 |
| --- | --- |
| icon | 可选图标，显示在文案左侧；加载中时由转圈代替 |

