import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { P9EButton } from '../form_generator/elements/button';

const meta: Meta<typeof P9EButton> = {
  title: 'Components/Button',
  component: P9EButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger'],
    },
    size: {
      control: 'select',
      options: ['md', 'lg', 'sm'],
    },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof P9EButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: "lg",
    disabled: false,
    children: "Click fgsdfsd"
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled'
  }
};
