import {Data, IncompatibleDataType, StringData, TYPE_STRING} from "../ActionModels";
import React from "react";
import {ProcessorConfig} from "../../AppConfig/model";

export function URLEncoder(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    return new StringData(encodeURIComponent(input.getValue()))
}

export function URLDecoder(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    return new StringData(decodeURIComponent(input.getValue()))
}
