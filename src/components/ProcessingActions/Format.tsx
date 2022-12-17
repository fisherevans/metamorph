import {Data, IncompatibleDataType, ProcessorConfig, StringData} from "./ProcessingActions";

export function FormatJSON(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== "string") {
        throw IncompatibleDataType
    }
    return new StringData(JSON.stringify(JSON.parse(input.getValue()), null, 2))
}
