import {Data, IncompatibleDataType, ObjectData, ProcessorConfig, TYPE_STRING} from "../ActionModels";
import {Buffer} from 'buffer';

export const ACTION_CODE_PARSE_JWT = "parse-jwt"

export function ParseJWT(input: Data, config: ProcessorConfig): Data {
    if (typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const parts = input.getValue().split('.')
    if(parts.length != 3) {
        throw "Invalid JWT format - does not contain 3 parts"
    }
    const jwt = {
        header: JSON.parse(Buffer.from(parts[0], 'base64').toString()),
        payload: JSON.parse(Buffer.from(parts[1], 'base64').toString()),
        signature: parts[2],
    }
    return new ObjectData(jwt)
}
