import {Base64Config, Base64Decoder, Base64Encoder} from "./Base64";
import {StringToLower, StringToUpper} from "./Strings";
import {FormatJSON} from "./Format";

export interface ProcessorConfig {
    b64?:Base64Config
}

export type ProcessorConfigSupplier = () => ProcessorConfig

export interface Data {
    getValue:() => any
    asText:() => string
}

export class StringData implements Data {
    value:string
    constructor(value:string) {
        this.value = value
    }
    getValue() {
        return this.value
    }
    asText() {
        return this.value
    }
}

export type Processor = (input:Data,config:ProcessorConfig) => Data

export interface ActionInstance {
    code:string
    config:ProcessorConfig
}

export const IncompatibleDataType = "incompatible data type"

export interface AvailableAction {
    code:string
    label: string
    processor: Processor
    newConfig: ProcessorConfigSupplier
}

export interface ActionGroup {
    label: string
    codes: string[]
}

export const AVAILABLE_ACTION_GROUPS:ActionGroup[] = []
export const AVAILABLE_ACTIONS:Record<string, AvailableAction> = {}

const addActionGroup = (label:string) => {
    AVAILABLE_ACTION_GROUPS.push({
        label: label,
        codes: []
    })
}

const registerAvailableAction = (action:AvailableAction) => {
    AVAILABLE_ACTIONS[action.code] = action
    const g = AVAILABLE_ACTION_GROUPS[AVAILABLE_ACTION_GROUPS.length-1]
    g.codes.push(action.code)
}

addActionGroup("Encoding")
const newB64Conf = ():ProcessorConfig => ({
    b64: {
        urlSafe:false,
        stripPadding:true
    }
})
registerAvailableAction({
    code: "b64-enc",
    label: "Base64 - Encode",
    processor: Base64Encoder,
    newConfig: newB64Conf
})
registerAvailableAction({
    code: "b64-dec",
    label: "Base64 - Decode",
    processor: Base64Decoder,
    newConfig: newB64Conf
})

addActionGroup("Pretty Print")
registerAvailableAction({
    code: "pretty-json",
    label: "Format JSON",
    processor: FormatJSON,
    newConfig: () => ({})
})

addActionGroup("Strings")
registerAvailableAction({
    code: "str-upper",
    label: "To Uppercase",
    processor: StringToUpper,
    newConfig: () => ({})
})
registerAvailableAction({
    code: "str-lower",
    label: "To Lowercase",
    processor: StringToLower,
    newConfig: () => ({})
})