import React from 'react';

import { Button, Colors, View } from 'react-native-ui-lib';

import { useUpdate } from './context';

export interface ConfirmDialogVerticalButtonsProps {
    /**
     * The function to call when the confirm button is pressed
     */
    onConfirm: () => void;

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

    /**
     * If true, the buttons will be reversed
     * @default false
     */
    reversed?: boolean;
}

export const VerticalButtons = ({
    onConfirm,
    cancelText = 'No',
    confirmText = 'Yes',
    cancelColor = '$textDanger',
    confirmColor = '$textSuccess',
    reversed = false,
}: ConfirmDialogVerticalButtonsProps) => {
    const update = useUpdate();

    const handleClose = () => update({ visible: false });

    const handleConfirm = () => {
        handleClose();
        onConfirm();
    };

    return (
        <View gap-s4 marginT-s4>
            <Button
                label={reversed ? cancelText : confirmText}
                onPress={reversed ? handleClose : handleConfirm}
                backgroundColor={reversed ? Colors[cancelColor] : Colors[confirmColor]}
            />
            <Button
                label={reversed ? confirmText : cancelText}
                onPress={reversed ? handleConfirm : handleClose}
                size="small"
                link
                linkColor={reversed ? Colors[confirmColor] : Colors[cancelColor]}
            />
        </View>
    );
};
VerticalButtons.displayName = 'ConfirmDialog.VerticalButtons';
