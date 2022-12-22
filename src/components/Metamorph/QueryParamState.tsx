import {Buffer} from 'buffer';

import qs from "qs"
import {AppConfig} from "../AppConfig/model";
import {decompressSync, gzipSync} from 'fflate';


const qKeyConfig = "config"
const qKeyInput = "input"

const isEmpty = (s:any):boolean => {
    return s === undefined || typeof s !== 'string' || s.trim().length === 0
}

function b64ToUrl(s:string) {
    return s.replace(/\//g,"_")
        .replace(/\+/g,"-")
        .replaceAll(/=+$/g,"")
}

function b64FromUrl(s:string) {
    s = s.replace(/_/g,"/")
        .replace(/-/g,"+")
    s += ('===').slice(0, 4 - (s.length % 4));
    return s
}

export const EncodeUrlState = (config:AppConfig, input?:string) : string => {
    const query: { [key: string]: string } = {}
    query[qKeyConfig] = b64ToUrl(Buffer.from(AppConfig.toBinary(config)).toString('base64'))
    if(input != undefined) {
        query[qKeyInput] = b64ToUrl(Buffer.from(gzipSync(Buffer.from(input, 'utf8'))).toString('base64'))
    }
    return qs.stringify(query, { skipNulls: true })
}

export const DecodeUrlState = (s:string) : {config:AppConfig,input?:string} => {
    const out:{config:AppConfig,input?:string} = {
        config: {
            zoomed:false,
            autoProcess: false,
            actions: []
        }
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
    if(!isEmpty(parsed[qKeyConfig])) {
        try {
            out.config = AppConfig.fromBinary(new Uint8Array(Buffer.from(b64FromUrl(parsed[qKeyConfig] as string), 'base64')))
        } catch (err) {
            console.log("failed to parse config from query string", err)
        }
    }
    if(!isEmpty(parsed[qKeyInput])) {
        try {
            out.input = Buffer.from(decompressSync(Buffer.from(b64FromUrl(parsed[qKeyInput] as string), 'base64'))).toString('utf8')
        } catch (err) {
            console.log("failed to parse input from query string", err)
        }
    }
    return out
}