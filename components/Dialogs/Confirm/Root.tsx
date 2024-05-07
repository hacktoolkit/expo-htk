import React from 'react';

import { Card, Dialog } from 'react-native-ui-lib';

import { useContext, useUpdate } from './context';

export interface ConfirmDialogProps {
    /**
     * The description text if title is not enough
     */
    children?: React.ReactNode;
}

export type ConfirmDialogRef = {
    /**
     * Open the dialog
     */
    open: () => void;
};

/**
 * A dialog that asks the user to confirm an action
 *
 * @example
 * ```tsx
 * const ref = React.useRef<ConfirmDialogRef>(null);
 *
 * const handlePress = () => {
 *    ref.current?.open();
 * };
 *
 * const handleDialogConfirm = () => {
 *   ref.current?.close();
 *   // do something
 * };
 *
 * return (
 *   <>
 *     <ConfirmDialog ref={ref}>
 *       <ConfirmDialog.Title>Save Session</ConfirmDialog.Title>
 *       <Text>Are you sure you want to save this session?</Text>
 *       <ConfirmDialog.HorizontalButtons
 *         onConfirm={handleDialogConfirm}
 *       />
 *     </ConfirmDialog>
 *     <Button label="Save" onPress={handlePress} />
 *   </>
 * );
 * ```
 */
export const Root = React.forwardRef<ConfirmDialogRef, ConfirmDialogProps>(
    ({ children }, ref) => {
        const { visible } = useContext();
        const update = useUpdate();

        const handleOpen = () => update({ visible: true });
        const handleClose = () => update({ visible: false });

        React.useImperativeHandle(ref, () => ({
            open: handleOpen,
        }));

        return (
            <Dialog visible={visible} onDismiss={handleClose}>
                <Card padding-s4 gap-s4>
                    {children}
                </Card>
            </Dialog>
        );
    }
);
Root.displayName = 'ConfirmDialog.Root';
