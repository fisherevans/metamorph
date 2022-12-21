import {Buffer} from 'buffer';

import qs from "qs"
import {AppConfig} from "../AppConfig/model";

const qKey = "config"

const isEmpty = (s:any):boolean => {
    return s === undefined || typeof s !== 'string' || s.trim().length === 0
}

export const EncodeConfig = (value:AppConfig) : string => {
    const query: { [key: string]: string } = {}
    query[qKey] = Buffer.from(AppConfig.toBinary(value)).toString('base64').replaceAll(/=+$/g,"")
    return qs.stringify(query, { skipNulls: true })
}

export const DecodeConfig = (s:string) : AppConfig => {
    let out:AppConfig = {
        zoomed:false,
        autoProcess: false,
        actions: []
    }
    if(isEmpty(s)) {
        return out
    }
    let parsed:qs.ParsedQs = {};
    try {
        parsed = qs.parse(s, {
            ignoreQueryPrefix: true,
        })
    } catch (err) {
        console.log("failed to parse query params", err)
    }
    if(!isEmpty(parsed[qKey])) {
        try {
            out = AppConfig.fromBinary(new Uint8Array(Buffer.from(parsed[qKey] as string, 'base64')))
        } catch (err) {
            console.log("failed to parse config from query string", err)
        }
    }
    return out
}