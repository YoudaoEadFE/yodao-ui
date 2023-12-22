import type { StoryObj } from '@storybook/react';

import MultiCascader from '../components/multiCascader/MultiCascader';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/MultiCascader',
  component: MultiCascader,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
}
// satisfies Meta<typeof MutipleSelector>;

export default meta;
type Story = StoryObj<typeof MultiCascader>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    options: [{ label: '北京', value: 1 }, {label: '江西', value: 2, children: [{label: '南昌', value: 21, children: [{label: '南昌县', value: 211}, {label: '安义县', value: 212}]}, {label: '九江', value: 22}]}],
    value: [],
    onChange: (v) => {console.log(v)},
  },
};