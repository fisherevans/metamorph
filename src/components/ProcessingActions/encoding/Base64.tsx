import {
    BinaryData,
    Data,
    DataTypeLabel,
    IncompatibleInputDataType,
    InvalidOutputDataType,
    StringData
} from "../ActionModels";
import {Buffer} from 'buffer';
import {ActionCheckbox, ActionPanelProps, ActionSelector, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import React from "react";
import {Base64Config, DataType, ProcessorConfig} from "../../AppConfig/model";
import {Stack} from "@mui/material";

export function EnsureB64Config(procConf?:ProcessorConfig):Base64Config {
    procConf = procConf || {}
    if(procConf.base64 === undefined) {
        procConf.base64 = {
            stripPadding: false,
            urlSafe: false,
            output: DataType.STRING,
        }
    }
    return procConf.base64
}

export function Base64Encoder(input:Data,config:ProcessorConfig):Data {
    const conf = EnsureB64Config(config)
    let buffer:Buffer
    if(input.getType() == DataType.STRING) {
        buffer = Buffer.from(input.getValue(), 'utf8')
    } else if(input.getType() == DataType.BINARY) {
        buffer = Buffer.from(input.getValue() as Uint8Array)
    } else {
        throw IncompatibleInputDataType(input)
    }
    let b64 = buffer.toString('base64')
    if(conf.urlSafe) {
        b64 = b64.replace(/\//g, '_').replace(/\+/g, '-')
    }
    if(conf.stripPadding) {
        b64 = b64.replace(/=+$/, "")
    }
    return new StringData(b64)
}

export function Base64Decoder(input:Data,config:ProcessorConfig):Data {
    const conf = EnsureB64Config(config)
    if(input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
    }
    let b64 = input.getValue()
    if(conf.stripPadding && b64.length % 4 != 0 ) {
        b64 += ('===').slice(0, 4 - (b64.length % 4));
    }
    if(conf.urlSafe) {
        b64 = b64.replace(/_/g, '/').replace(/-/g, '+')
    }
    if(conf.output === DataType.STRING) {
        return new StringData(Buffer.from(b64, 'base64').toString('utf8'))
    } else if(conf.output === DataType.BINARY) {
        return new BinaryData(Buffer.from(b64, 'base64'))
    } else {
        throw InvalidOutputDataType(conf.output)
    }
}

export function ConfigureBase64(conf:{showOutput:boolean}) {
    return function ConfigureBase64Inner(props:ActionPanelProps) {
        const updateStripPadding = (v: boolean) => {
            const conf = EnsureB64Config(props.actionInstance.config)
            conf.stripPadding = v
            props.setActionInstance(props.actionInstance)
        }
        const updateUrlSafe = (v: boolean) => {
            const conf = EnsureB64Config(props.actionInstance.config)
            conf.urlSafe = v
            props.setActionInstance(props.actionInstance)
        }
        const updateOutput = (v: DataType) => {
            const conf = EnsureB64Config(props.actionInstance.config)
            conf.output = v
            props.setActionInstance(props.actionInstance)
        }
        return (
            <Stack alignItems={"center"}>
                <Stack direction={"row"}>
                    <ActionCheckbox label="URL Safe"
                                    value={props.actionInstance.config?.base64?.urlSafe}
                                    update={updateUrlSafe}/>

                    <ActionCheckbox label="Strip Padding"
                                    value={props.actionInstance.config?.base64?.stripPadding}
                                    update={updateStripPadding}/>
                </Stack>
                {conf.showOutput && (
                    <ActionSelector label="Output Format"
                                    value={props.actionInstance.config?.base64?.output || DataType.STRING}
                                    options={[
                                        {label:DataTypeLabel(DataType.STRING),value:DataType.STRING},
                                        {label:DataTypeLabel(DataType.BINARY),value:DataType.BINARY}
                                    ]}
                                    update={updateOutput}/>
                )}
            </Stack>
        )
    }
}

export function SummarizeBase64(conf:{showOutput:boolean}) {
    return function SummarizeBase64Inner(props:ActionPanelProps) {
        const sum = []
        const c = props.actionInstance.config?.base64
        if (c?.urlSafe) {
            sum.push("URL Safe")
        }
        if (c?.stripPadding) {
            sum.push("Padding Stripped")
        }
        if (c?.stripPadding) {
            sum.push("Padding Stripped")
        }
        if (conf.showOutput) {
            sum.push(DataTypeLabel(c?.output))
        }
        if (sum.length == 0) {
            return <Box/>
        }
        return (
            <Box>
                <SummaryTypography text={sum.join(", ")}/>
            </Box>
        )
    }
}