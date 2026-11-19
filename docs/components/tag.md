# Tag 标签

用于标记状态或分类。标签圆角为 2px，左侧有 2px 类型色条。`round` 属性仍可用于兼容，但不会做成胶囊形。

<script setup>
import { ref } from 'vue'
const tags = ref(['文档', '发布中'])
function remove(index) {
  tags.value.splice(index, 1)
}
</script>

## 基础用法

<DemoBox>
  <pt-space wrap>
    <pt-tag>默认</pt-tag>
    <pt-tag type="primary">主要</pt-tag>
    <pt-tag type="success">成功</pt-tag>
    <pt-tag type="warning">警告</pt-tag>
    <pt-tag type="danger">危险</pt-tag>
    <pt-tag type="info">信息</pt-tag>
    <pt-tag type="primary" effect="solid">实心</pt-tag>
    <pt-tag type="primary" effect="plain" round>描边</pt-tag>
    <pt-tag v-for="(tag, index) in tags" :key="tag" closable @close="remove(index)">{{ tag }}</pt-tag>
  </pt-space>
</DemoBox>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| effect | 风格 | `'light' \| 'solid' \| 'plain'` | `'light'` |
| size | 尺寸 | `'large' \| 'default' \| 'small'` | `'default'` |
| closable | 可关闭 | `boolean` | `false` |
| round | 保留的兼容属性；本视觉方案中标签仍为 2px 圆角，不会变成胶囊 | `boolean` | `false` |
