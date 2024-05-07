import React from 'react';

import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';

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
}

export const VerticalButtons = ({
    onConfirm,
    cancelText = 'No',
    confirmText = 'Yes',
    cancelColor = '$textDanger',
    confirmColor = '$textSuccess',
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
                label={confirmText}
                onPress={handleConfirm}
                backgroundColor={Colors[confirmColor]}
            />
            <Button
                label={cancelText}
                onPress={handleClose}
                size="small"
                link
                linkColor={Colors[cancelColor]}
            />
        </View>
    );
};
VerticalButtons.displayName = 'ConfirmDialog.VerticalButtons';
