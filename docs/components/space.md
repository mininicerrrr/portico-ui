# Space 间距

为相邻元素添加统一间距。

<DemoBox>
  <pt-space>
    <pt-button>确定</pt-button>
    <pt-button>取消</pt-button>
    <pt-button type="primary">提交</pt-button>
  </pt-space>
  <div style="height: 16px;"></div>
  <pt-space direction="vertical" size="large">
    <pt-button>项目一</pt-button>
    <pt-button>项目二</pt-button>
  </pt-space>
</DemoBox>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | 间距 | `'small' \| 'default' \| 'large' \| number` | `'default'` |
| align | 交叉轴对齐 | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` | — |
| wrap | 换行 | `boolean` | `false` |
