import React from 'react';

import {
    Card,
    Colors,
    Dialog,
    Text,
    TouchableOpacity,
    View,
} from 'react-native-ui-lib';

export interface ConfirmDialogProps {
    /**
     * The title of the dialog
     */
    title: string;

    /**
     * The function to call when the confirm button is pressed
     */
    onConfirm: () => void;

    /**
     * The description text if title is not enough
     */
    children?: React.ReactNode;

    /**
     * The text to display on the confirm button
     * @default 'Yes'
     */
    confirmText?: string;

    /**
     * The text to display on the cancel button
     * @default 'No'
     */
    cancelText?: string;

    /**
     * The color of the confirm button
     * @default '$textSuccess'
     */
    confirmColor?: keyof typeof Colors;

    /**
     * The color of the cancel button
     * @default '$textDefault'
     */
    cancelColor?: keyof typeof Colors;
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
 *     <ConfirmDialog
 *       ref={ref}
 *       title="Save"
 *       onConfirm={handleDialogConfirm}
 *     >
 *       <Text>Are you sure you want to save this session?</Text>
 *     </ConfirmDialog>
 *     <Button label="Save" onPress={handlePress} />
 *   </>
 * );
 * ```
 */
export const ConfirmDialog = React.forwardRef<ConfirmDialogRef, ConfirmDialogProps>(
    (
        {
            title,
            onConfirm,
            confirmText = 'Yes',
            cancelText = 'No',
            confirmColor = '$textSuccess',
            cancelColor = '$textDefault',
            children,
        },
        ref
    ) => {
        const [visible, setVisible] = React.useState(false);

        const handleClose = () => setVisible(false);
        const handleOpen = () => setVisible(true);

        const handleConfirm = () => {
            handleClose();
            onConfirm();
        };

        React.useImperativeHandle(ref, () => ({
            open: handleOpen,
        }));

        return (
            <Dialog visible={visible} onDismiss={handleClose}>
                <Card padding-s4 gap-s4>
                    <Text text70M>{title}</Text>
                    {children && <View>{children}</View>}
                    <View row marginT-s10>
                        <TouchableOpacity
                            onPress={handleClose}
                            center
                            style={{ width: '50%' }}
                        >
                            <Text text80H {...{ [cancelColor]: true }}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            center
                            style={{
                                width: '50%',
                                borderLeftWidth: 1,
                                borderLeftColor: Colors.$backgroundNeutral,
                            }}
                        >
                            <Text text80H {...{ [confirmColor]: true }}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </Dialog>
        );
    }
);
