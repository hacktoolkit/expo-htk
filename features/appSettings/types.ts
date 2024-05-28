export type AppSettingsState<TSettings extends Record<string, any>> = TSettings & {
    dispatch: AppSettingsDispatch<TSettings>;
};

export type AppSettingsDispatch<TSettings extends Record<string, any>> = (
    field: keyof TSettings,
    value: any
) => void;
