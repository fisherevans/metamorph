import {Data, IncompatibleDataType, ProcessorConfig, StringData, TYPE_STRING} from "../ActionModels";
import React from "react";

export const ACTION_CODE_URL_ENCODE = "url-enc"
export const ACTION_CODE_URL_DECODE = "url-dec"

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
