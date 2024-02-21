import {
    BinaryData,
    Data,
    DataTypeLabel,
    IncompatibleInputDataType,
    InvalidOutputDataType,
    StringData
} from "../ActionModels";
import {CompressionConfig, CompressionEngine, DataType, ProcessorConfig} from "../../AppConfig/model";
import {ActionPanelProps, ActionSelector, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import {decompressSync as fflateDecompress, gzipSync as fflateCompress} from 'fflate';
import {compress as zstdCompress, decompress as zstdDecompress } from '@bokuweb/zstd-wasm';

import React from "react";
import {Buffer} from "buffer";

export function EnsureCompressionConfig(procConf?:ProcessorConfig):CompressionConfig {
    procConf = procConf || {}
    if(procConf.compression === undefined) {
        procConf.compression = {
            output:DataType.BINARY,
            engine:CompressionEngine.FFLATE,
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

export function Decompress(input:Data,config:ProcessorConfig):Promise<Data> {
    const conf = EnsureCompressionConfig(config)
    let data:Uint8Array
    if(input.getType() == DataType.STRING) {
        data = Buffer.from(input.getValue() as string, 'base64')
    } else if(input.getType() == DataType.BINARY) {
        data = input.getValue() as Uint8Array
    } else {
        throw IncompatibleInputDataType(input)
    }
    let result:Promise<Data>
    if(config.compression?.engine == CompressionEngine.FFLATE) {
        result = Promise.resolve(createOutput(conf.output, fflateDecompress(data)))
    } else if(config.compression?.engine == CompressionEngine.ZSTD) {
        result = Promise.resolve(createOutput(conf.output, new Uint8Array(zstdDecompress(data))))
    } else {
        throw IncompatibleInputDataType(input)
    }
    return result
}

export function CompressGzip(input:Data,config:ProcessorConfig):Promise<Data> {
    const conf = EnsureCompressionConfig(config)
    let data:Uint8Array
    if(input.getType() == DataType.STRING) {
        data = Buffer.from(input.getValue() as string, 'utf8')
    } else if(input.getType() == DataType.BINARY) {
        data = input.getValue() as Uint8Array
    } else {
        throw IncompatibleInputDataType(input)
    }
    let result:Promise<Data>
    if(config.compression?.engine == CompressionEngine.FFLATE) {
        result = Promise.resolve(createOutput(conf.output, fflateCompress(data)))
    } else if(config.compression?.engine == CompressionEngine.ZSTD) {
        result = Promise.resolve(createOutput(conf.output, zstdCompress(data)))
    } else {
        throw IncompatibleInputDataType(input)
    }
    return result
}

export function CompressingEngineLabel(e:CompressionEngine|undefined):string {
    if(e === undefined) {
        return "";
    }
    switch(e) {
        case CompressionEngine.ZSTD: return "Zstandard (zstd)";
        case CompressionEngine.FFLATE: return "FFlate (gzip)";
        default: return "Unknown";
    }
}

export function SummarizeCompressionConfig(props:ActionPanelProps) {
    return (
        <Box>
            <SummaryTypography text={
                "Output: "+DataTypeLabel(props.actionInstance.config?.compression?.output) +
                ", Engine: "+CompressingEngineLabel(props.actionInstance.config?.compression?.engine)
            } />
        </Box>
    )
}

export function ConfigureCompressionConfig(props:ActionPanelProps) {
    const updateOutput = (v: DataType) => {
        const conf = EnsureCompressionConfig(props.actionInstance.config)
        conf.output = v
        props.setActionInstance(props.actionInstance)
    }
    const updateEngine = (e: CompressionEngine) => {
        const conf = EnsureCompressionConfig(props.actionInstance.config)
        conf.engine = e
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
            <ActionSelector label="Engine"
                            value={props.actionInstance.config?.compression?.engine || CompressionEngine.FFLATE}
                            options={[
                                {label:CompressingEngineLabel(CompressionEngine.FFLATE),value:CompressionEngine.FFLATE},
                                {label:CompressingEngineLabel(CompressionEngine.ZSTD),value:CompressionEngine.ZSTD}
                            ]}
                            update={updateEngine}/>
        </Box>
    )
}
