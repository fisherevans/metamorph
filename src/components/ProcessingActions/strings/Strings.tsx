import {Data, IncompatibleDataType, StringData, TYPE_STRING} from "../ActionModels";
import {ProcessorConfig, StringConfig} from "../../AppConfig/model";
import {ActionPanelProps, ActionTextField, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import React from "react";

export function EnsureStringConfig(procConf?:ProcessorConfig):StringConfig {
    procConf = procConf || {}
    if(procConf.string === undefined) {
        procConf.string = {
            quoteCharacter:"\"",
        }
    }
    return procConf.string
}

export function StringToUpper(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    return new StringData(input.getValue().toUpperCase())
}

export function StringToLower(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    return new StringData(input.getValue().toLowerCase())
}

export function EscapeString(input:Data, config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const conf = EnsureStringConfig(config)
    if(conf.quoteCharacter.trim().length === 0) {
        return input
    }
    const regex = new RegExp(conf.quoteCharacter.trim(), "g")
    const v = input.getValue()
        .replaceAll(/\\/g, "\\\\")
        .replaceAll(/\n/g, "\\n")
        .replaceAll(/\r/g, "\\r")
        .replaceAll(/\t/g, "\\t")
        .replaceAll(regex, "\\" + conf.quoteCharacter.trim())
    return new StringData(v)
}

export function UnescapeString(input:Data, config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const conf = EnsureStringConfig(config)
    if(conf.quoteCharacter.trim().length === 0) {
        return input
    }
    const regex = new RegExp("\\\\" + conf.quoteCharacter.trim(), "g")
    console.log(regex)
    const v = input.getValue()
        .replaceAll(regex, conf.quoteCharacter)
        .replaceAll(/\\n/g, "\n")
        .replaceAll(/\\r/g, "\r")
        .replaceAll(/\\t/g, "\t")
        .replaceAll(/\\\\/g, "\\")
    return new StringData(v)
}

export function SummarizeStringConfig(props:ActionPanelProps) {
    return (
        <Box>
            <SummaryTypography text={"Quote: "+props.actionInstance.config?.string?.quoteCharacter} mono={true} />
        </Box>
    )
}

export function ConfigureStringConfig(props:ActionPanelProps) {
    const updateQuote = (v:string) => {
        const conf = EnsureStringConfig(props.actionInstance.config)
        v = v.trim()
        if(v.length > 1) {
            v = v.charAt(v.length-1) + ""
        }
        conf.quoteCharacter = v
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Box>
            <ActionTextField label="Quote Character" placeholder={"\""} value={props.actionInstance.config?.string?.quoteCharacter} mono={true} update={updateQuote} />
        </Box>
    )
}
