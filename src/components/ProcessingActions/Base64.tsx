import {Data, IncompatibleDataType, ProcessorConfig, StringData} from "./ProcessingActions";
import {Buffer} from 'buffer';

export interface Base64Config {
    urlSafe:boolean
    stripPadding:boolean
}

export function Base64Encoder(input:Data,config:ProcessorConfig):Data {
    const conf = config.b64 || {} as Base64Config
    if(typeof input.getValue() !== "string") {
        throw IncompatibleDataType
    }
    let b64 = Buffer.from(input.getValue(), 'utf8').toString('base64')
    if(conf.urlSafe) {
        b64 = b64.replace(/\//g, '_').replace(/\+/g, '-')
    }
    if(conf.stripPadding) {
        b64 = b64.replace(/=+$/, "")
    }
    return new StringData(b64)
}

export function Base64Decoder(input:Data,config:ProcessorConfig):Data {
    const conf = config.b64 || {} as Base64Config
    if(typeof input.getValue() !== "string") {
        throw IncompatibleDataType
    }
    let b64 = input.getValue()
    if(conf.stripPadding && b64.length % 4 != 0 ) {
        b64 += ('===').slice(0, 4 - (b64.length % 4));
    }
    if(conf.urlSafe) {
        b64 = b64.replace(/_/g, '/').replace(/-/g, '+')
    }
    const str = Buffer.from(b64, 'base64').toString('utf8')
    return new StringData(str)
}
