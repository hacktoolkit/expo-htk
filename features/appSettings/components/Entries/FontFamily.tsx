import React, { useState, useRef } from 'react';
import { Modal, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, View } from 'react-native-ui-lib';
import { AppSettingsEntryBase, type AppSettingsEntryBaseProps } from './Base';

export interface AppSettingsEntryModalProps<TSettings extends Record<string, any>>
    extends Omit<AppSettingsEntryBaseProps, 'children'> {
    field: keyof TSettings;
    value: string;
    options: string[];
    dispatch: (field: keyof TSettings, value: any) => void;
}

export function AppSettingsEntryModal<TSettings extends Record<string, any>>({
    field,
    value,
    options,
    dispatch,
    ...props
}: AppSettingsEntryModalProps<TSettings>) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const handleOptionSelect = (selectedOption: string) => {
        dispatch(field, selectedOption);
        setModalVisible(false);
    };

    const showModal = () => {
        buttonRef.current?.measure((fx, fy, width, height, px, py) => {
            const screenHeight = Dimensions.get('window').height;
            const positionY = py + height + 10; // 10 for some padding

            // Ensure the modal doesn't go off the screen
            const modalTop = (positionY + 150 > screenHeight) ? py - 150 : positionY;

            setModalPosition({
                top: modalTop,
            });
            setModalVisible(true);
        });
    };

    return (
        <AppSettingsEntryBase {...props}>
            <TouchableOpacity ref={buttonRef} onPress={showModal} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>
                    {value || 'Choose Option'}
                </Text>
                <Ionicons
                    name="chevron-down-outline"
                    size={24}
                    color={Colors.$textPrimary}
                />
            </TouchableOpacity>

            <Modal
                animationType="none"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    position: 'absolute',
                    top: modalPosition.top,
                    right: 10,
                    width: 300,
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5,
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Select an Option</Text>
                    {options.map((option, index) => (
                        <TouchableOpacity key={index} onPress={() => handleOptionSelect(option)} style={{ borderBottomWidth: 1, borderBottomColor: Colors.$textDisabled, marginBottom: 5}}>
                            <Text style={{ fontSize: 18, marginBottom: 5 }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center', marginTop: 10 }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </AppSettingsEntryBase>
    );
}
