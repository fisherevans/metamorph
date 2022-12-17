import {Data, IncompatibleDataType, ProcessorConfig, StringData} from "./ProcessingActions";

export function StringToUpper(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== "string") {
        throw IncompatibleDataType
    }
    return new StringData(input.getValue().toUpperCase())
}

export function StringToLower(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== "string") {
        throw IncompatibleDataType
    }
    return new StringData(input.getValue().toLowerCase())
}
