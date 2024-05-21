import { Switch } from 'react-native-ui-lib';
import { AppSettingsEntryBase, AppSettingsEntryBaseProps } from './Base';

export interface AppSettingsEntrySwitchProps<TSettings extends Record<string, any>>
    extends Omit<AppSettingsEntryBaseProps, 'children'> {
    field: keyof TSettings;
    value: boolean;
    dispatch: (field: keyof TSettings, value: boolean) => void;
}

export function AppSettingsEntrySwitch<TSettings extends Record<string, any>>({
    field,
    dispatch,
    value,
    ...props
}: AppSettingsEntrySwitchProps<TSettings>) {
    const handleValueChange = () => dispatch(field, !value);

    return (
        <AppSettingsEntryBase {...props}>
            <Switch value={value} onValueChange={handleValueChange} />
        </AppSettingsEntryBase>
    );
}
