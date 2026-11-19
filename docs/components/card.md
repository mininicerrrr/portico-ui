# Card 卡片

用于承载一块相关内容。

## 基础用法

<DemoBox>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
    <pt-card header="始终投影">卡片可用于介绍模块、展示摘要或包裹表单片段。</pt-card>
    <pt-card header="悬停投影" shadow="hover">将鼠标移到卡片上时出现投影。</pt-card>
    <pt-card shadow="never">
      <template #header>无投影</template>
      适合嵌套在已经有边界的布局中。
      <template #footer>
        <pt-button text type="primary">了解更多</pt-button>
      </template>
    </pt-card>
  </div>
</DemoBox>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| header | 标题文本 | `string` | — |
| shadow | 投影时机 | `'always' \| 'hover' \| 'never'` | `'always'` |
| bodyStyle | 主体样式 | `object \| string` | — |

插槽：`default`、`header`、`footer`。
