import {Data, IncompatibleInputDataType, ObjectData} from "../ActionModels";
import {Buffer} from 'buffer';
import {DataType, ProcessorConfig} from "../../AppConfig/model";

export function ParseJWT(input: Data, config: ProcessorConfig): Data {
    if (input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
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
