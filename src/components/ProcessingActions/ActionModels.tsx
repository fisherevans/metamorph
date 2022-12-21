import {ActionPanelProps} from "./ActionPanel";
import {ActionCode, ActionInstance, ProcessorConfig} from "../AppConfig/model";

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

export type Processor = (input:Data,config:ProcessorConfig) => Data|Promise<Data>

export const IncompatibleDataType = (d:Data) => "Incompatible data type '" + (typeof d.getValue()) + "'"

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
