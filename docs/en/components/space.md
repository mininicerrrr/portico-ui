# Space

Adds consistent spacing between adjacent items, including fragments and text nodes.

## Basic usage

<DemoBox>
  <pt-space>
    <pt-button>Ok</pt-button>
    <pt-button>Cancel</pt-button>
    <pt-button type="primary">Submit</pt-button>
  </pt-space>
</DemoBox>

## Direction, wrap and spacer

<DemoBox>
  <pt-space direction="vertical" size="large" spacer style="width: 200px;">
    <pt-button>One</pt-button>
    <pt-button>Two</pt-button>
    <pt-button>Three</pt-button>
  </pt-space>
</DemoBox>

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Layout direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | Gap size | `'small' \| 'default' \| 'large' \| number` | `'default'` |
| align | Cross-axis alignment | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` | — |
| wrap | Allow wrapping, horizontal only | `boolean` | `false` |
| spacer | Draw a short rule between items | `boolean` | `false` |
