import {Data, IncompatibleInputDataType, StringData} from "../ActionModels";
import React from "react";
import {DataType, ProcessorConfig} from "../../AppConfig/model";

export function URLEncoder(input:Data,config:ProcessorConfig):Data {
    if(input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
    }
    return new StringData(encodeURIComponent(input.getValue()))
}

export function URLDecoder(input:Data,config:ProcessorConfig):Data {
    if(input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
    }
    return new StringData(decodeURIComponent(input.getValue()))
}
