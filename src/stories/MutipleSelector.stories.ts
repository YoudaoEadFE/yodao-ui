import type { StoryObj } from '@storybook/react';

import MutipleSelector from '../components/multipleSelector/MutipleSelector';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/MutipleSelector',
  component: MutipleSelector,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
}
// satisfies Meta<typeof MutipleSelector>;

export default meta;
type Story = StoryObj<typeof MutipleSelector>;

const defaultOptions = []
for (let i = 1; i <= 50; i++) {
  defaultOptions.push(i);
}

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    value: [],
    onChange: (v) => {console.log(v)},
    defaultOptions: defaultOptions,
  },
};