import {Data, IncompatibleDataType, ObjectData, TYPE_STRING} from "../ActionModels";
import {parse as parseYaml} from "yaml";
import {default as xml} from "xml-js";
import {ProcessorConfig} from "../../AppConfig/model";

export function ParseJSON(input: Data, config: ProcessorConfig): Data {
    if (typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const obj = JSON.parse(input.getValue())
    return new ObjectData(obj)
}

export function ParseYAML(input: Data, config: ProcessorConfig): Data {
    if (typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const obj = parseYaml(input.getValue())
    return new ObjectData(obj)
}

export function ParseXML(input: Data, config: ProcessorConfig): Data {
    if (typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const obj = JSON.parse(xml.xml2json(input.getValue()))
    return new ObjectData(obj)
}