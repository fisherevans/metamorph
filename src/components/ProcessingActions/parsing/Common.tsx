import {Data, IncompatibleInputDataType, ObjectData} from "../ActionModels";
import {parse as parseYaml} from "yaml";
import {default as xml} from "xml-js";
import {DataType, ProcessorConfig} from "../../AppConfig/model";

export function ParseJSON(input: Data, config: ProcessorConfig): Data {
    if (input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
    }
    const obj = JSON.parse(input.getValue())
    return new ObjectData(obj)
}

export function ParseYAML(input: Data, config: ProcessorConfig): Data {
    if (input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
    }
    const obj = parseYaml(input.getValue())
    return new ObjectData(obj)
}

export function ParseXML(input: Data, config: ProcessorConfig): Data {
    if (input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
    }
    const obj = JSON.parse(xml.xml2json(input.getValue()))
    return new ObjectData(obj)
}