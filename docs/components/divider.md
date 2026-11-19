# Divider 分割线

分隔内容区块，可在水平分割线上加入说明文字。

<DemoBox>
  <p>上方内容</p>
  <pt-divider />
  <p>中间内容</p>
  <pt-divider>说明</pt-divider>
  <pt-divider content-position="left">左侧标题</pt-divider>
  <span>文本</span>
  <pt-divider direction="vertical" />
  <span>相邻文本</span>
</DemoBox>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| contentPosition | 水平文字位置 | `'left' \| 'center' \| 'right'` | `'center'` |
