import { contextBuilder } from '@htk/utils/react/contextBuilder';

const [ConfirmDialogProvider, useContext, useDispatch, useUpdate] = contextBuilder({
    visible: false,
});

export { ConfirmDialogProvider, useContext, useDispatch, useUpdate };
