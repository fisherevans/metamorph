import {ActionPanelProps} from "./ActionPanel";
import {ActionCode, ActionInstance, ProcessorConfig, DataType} from "../AppConfig/model";
import {Buffer} from "buffer";

export interface Data {
    getValue:() => any
    getType:() => DataType
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
    getType() {
        return DataType.STRING
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
    getType() {
        return DataType.OBJECT
    }
    asText() {
        return "[JSON Object]\n" + JSON.stringify(this.value, null, 2)
    }
}

export class BinaryData implements Data {
    value:Uint8Array
    constructor(value:Uint8Array) {
        this.value = value
    }
    getValue() {
        return this.value
    }
    getType() {
        return DataType.BINARY
    }
    asText() {
        return "[Unsigned 8-int Array]\n" + Buffer.from(this.value).toString('base64')
    }
}

export type Processor = (input:Data,config:ProcessorConfig) => Data|Promise<Data>

export const IncompatibleInputDataType = (d:Data) => "Incompatible input data type '" + DataType[d.getType()] + "'"
export const InvalidOutputDataType = (dt:DataType) => "Invalid output data type '" + DataType[dt] + "'"

export interface AvailableAction {
    code: ActionCode
    label: string
    processor: Processor
    initConfig?: (conf:ProcessorConfig)=>void
    editPanel?: (props:ActionPanelProps)=>JSX.Element
    summaryPanel?: (props:ActionPanelProps)=>JSX.Element
}

export interface ActionGroup {
    label: string
    codes: ActionCode[]
}

export type ConfigurableActionProps = {
    currentAction: ActionInstance;
    onUpdate:(updated:ActionInstance)=>void
    onClose:()=>void
};
