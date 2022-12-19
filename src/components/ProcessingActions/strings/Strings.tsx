import {Data, IncompatibleDataType, ProcessorConfig, StringData, TYPE_STRING} from "../ActionModels";

export const ACTION_CODE_STRINGS_UPPER = "str-upper"
export const ACTION_CODE_STRINGS_LOWER = "str-lower"

export function StringToUpper(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    return new StringData(input.getValue().toUpperCase())
}

export function StringToLower(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    return new StringData(input.getValue().toLowerCase())
}
