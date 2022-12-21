import {Data, IncompatibleDataType, StringData, TYPE_STRING} from "../ActionModels";
import {ProcessorConfig} from "../../AppConfig/model";

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
