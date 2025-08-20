'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from './button';
import React from 'react';

interface AddItemButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const AddItemButton = React.forwardRef<HTMLButtonElement, AddItemButtonProps>(
  ({ title, ...props }, ref) => {
    return (
      <Button size="sm" className="h-8 gap-1" ref={ref} {...props}>
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {title}
        </span>
      </Button>
    );
  }
);

AddItemButton.displayName = 'AddItemButton';

export default AddItemButton;
