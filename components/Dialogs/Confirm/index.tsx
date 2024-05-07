import React from 'react';

import { ConfirmDialogProvider } from './context';
import { HorizontalButtons } from './HorizontalButtons';
import { ConfirmDialogProps, ConfirmDialogRef, Root } from './Root';
import { Title } from './Title';
import { VerticalButtons } from './VerticalButtons';

export { ConfirmDialogRef, ConfirmDialogProps };

export const ConfirmDialog = Object.assign(
    React.forwardRef<ConfirmDialogRef, ConfirmDialogProps>((props, ref) => (
        <ConfirmDialogProvider>
            <Root ref={ref} {...props} />
        </ConfirmDialogProvider>
    )),
    { Title, HorizontalButtons, VerticalButtons }
);
