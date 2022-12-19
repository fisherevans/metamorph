import {Base64Config} from "./encoding/Base64";
import {QueryDataConfig} from "./query/QueryData";
import {ActionPanelProps} from "./ActionPanel";
import {FormattingConfig} from "./formatting/Format";
import {RegexConfig} from "./regex/Regex";

export interface ProcessorConfig {
    b64?:Base64Config
    query?:QueryDataConfig
    formatting?:FormattingConfig
    regex?:RegexConfig
}

export type ProcessorConfigSupplier = () => ProcessorConfig

export const TYPE_STRING = 'string'
export const TYPE_OBJECT = 'object'

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

export class ObjectData implements Data {
    value:object
    constructor(value:object) {
        this.value = value
    }
    getValue() {
        return this.value
    }
    asText() {
        return "[JSON Object]\n" + JSON.stringify(this.value, null, 2)
    }
}

export interface ProcessingFailure {
    lastData:Data
    message?:string
    error:any
}

export type Processor = (input:Data,config:ProcessorConfig) => Data

export interface ActionInstance {
    code:string
    editing:boolean
    config:ProcessorConfig
}

export const IncompatibleDataType = (d:Data) => "Incompatible data type '" + (typeof d.getValue()) + "'"

export interface AvailableAction {
    code:string
    label: string
    processor: Processor
    initConfig?: (conf:ProcessorConfig)=>void
    editPanel?: (props:ActionPanelProps)=>JSX.Element
    summaryPanel?: (props:ActionPanelProps)=>JSX.Element
}

export interface ActionGroup {
    label: string
    codes: string[]
}

export type ConfigurableActionProps = {
    currentAction: ActionInstance;
    onUpdate:(updated:ActionInstance)=>void
    onClose:()=>void
};
