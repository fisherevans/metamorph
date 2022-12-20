import {Data, IncompatibleDataType, ObjectData, ProcessorConfig, TYPE_STRING} from "../ActionModels";
import {parse as parseYaml} from "yaml";
import {default as xml} from "xml-js";

export const ACTION_CODE_PARSE_JSON = "parse-json"
export const ACTION_CODE_PARSE_YAML = "parse-yaml"
export const ACTION_CODE_PARSE_XML = "parse-xml"

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