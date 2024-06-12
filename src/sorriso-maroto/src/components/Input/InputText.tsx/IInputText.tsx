export default interface IInputText {
    placeholder?: string
    type?: string
    onChange?: CallableFunction;
    required: boolean;
    label?: string;
    icon?: any;
    secondaryIcon?: any;
    onSecondaryIconClick: CallableFunction,
    value?: string
}