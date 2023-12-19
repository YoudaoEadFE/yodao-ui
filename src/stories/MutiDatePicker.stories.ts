import type { StoryObj } from '@storybook/react';

import MutiDatePicker from '../components/multiDatePicker/MultiDatePicker';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/MutiDatePicker',
  component: MutiDatePicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    weekStart: {
      control: {
        type: 'number',
        min: 0,
        max: 6,
      }
    }
  },
}
// satisfies Meta<typeof MutipleSelector>;

export default meta;
type Story = StoryObj<typeof MutiDatePicker>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    value: [],
    onChange: (v) => {console.log(v)},
  },
};