import {
    BinaryData,
    Data,
    DataTypeLabel,
    IncompatibleInputDataType,
    InvalidOutputDataType,
    StringData
} from "../ActionModels";
import {CompressionConfig, DataType, ProcessorConfig} from "../../AppConfig/model";
import {ActionPanelProps, ActionSelector, ActionTextField, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import {decompressSync, gzipSync} from 'fflate';


import React from "react";
import {Buffer} from "buffer";

export function EnsureCompressionConfig(procConf?:ProcessorConfig):CompressionConfig {
    procConf = procConf || {}
    if(procConf.compression === undefined) {
        procConf.compression = {
            output:DataType.BINARY,
        }
    }
    return procConf.compression
}

function createOutput(format:DataType, output:Uint8Array):Data {
    if(format == DataType.BINARY) {
        return new BinaryData(output)
    } else if(format == DataType.STRING) {
        return new StringData(Buffer.from(output).toString('utf8'))
    } else {
        throw InvalidOutputDataType(format)
    }
}

export function Decompress(input:Data,config:ProcessorConfig):Data {
    const conf = EnsureCompressionConfig(config)
    let data:Uint8Array
    if(input.getType() == DataType.STRING) {
        data = Buffer.from(input.getValue() as string, 'base64')
    } else if(input.getType() == DataType.BINARY) {
        data = input.getValue() as Uint8Array
    } else {
        throw IncompatibleInputDataType(input)
    }
    return createOutput(conf.output, decompressSync(data))
}

export function CompressGzip(input:Data,config:ProcessorConfig):Data {
    const conf = EnsureCompressionConfig(config)
    let data:Uint8Array
    if(input.getType() == DataType.STRING) {
        data = Buffer.from(input.getValue() as string, 'utf8')
    } else if(input.getType() == DataType.BINARY) {
        data = input.getValue() as Uint8Array
    } else {
        throw IncompatibleInputDataType(input)
    }
    return createOutput(conf.output, gzipSync(data))
}

export function SummarizeCompressionConfig(props:ActionPanelProps) {
    return (
        <Box>
            <SummaryTypography text={"Output: "+DataTypeLabel(props.actionInstance.config?.compression?.output)} />
        </Box>
    )
}

export function ConfigureCompressionConfig(props:ActionPanelProps) {
    const updateOutput = (v: DataType) => {
        const conf = EnsureCompressionConfig(props.actionInstance.config)
        conf.output = v
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Box>
            <ActionSelector label="Output Format"
                            value={props.actionInstance.config?.compression?.output || DataType.STRING}
                            options={[
                                {label:DataTypeLabel(DataType.STRING),value:DataType.STRING},
                                {label:DataTypeLabel(DataType.BINARY),value:DataType.BINARY}
                            ]}
                            update={updateOutput}/>
        </Box>
    )
}
