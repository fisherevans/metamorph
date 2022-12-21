import {Data, IncompatibleDataType, StringData, TYPE_STRING} from "../ActionModels";
import {Buffer} from 'buffer';
import {ActionCheckbox, ActionPanelProps, SummaryTypography} from "../ActionPanel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import React from "react";
import {Base64Config, ProcessorConfig} from "../../AppConfig/model";

export function EnsureB64Config(procConf?:ProcessorConfig):Base64Config {
    procConf = procConf || {}
    if(procConf.base64 === undefined) {
        procConf.base64 = {
            stripPadding: false,
            urlSafe: false,
        }
    }
    return procConf.base64
}

export function Base64Encoder(input:Data,config:ProcessorConfig):Data {
    const conf = EnsureB64Config(config)
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    let b64 = Buffer.from(input.getValue(), 'utf8').toString('base64')
    if(conf.urlSafe) {
        b64 = b64.replace(/\//g, '_').replace(/\+/g, '-')
    }
    if(conf.stripPadding) {
        b64 = b64.replace(/=+$/, "")
    }
    return new StringData(b64)
}

export function Base64Decoder(input:Data,config:ProcessorConfig):Data {
    const conf = config.base64 || {} as Base64Config
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    let b64 = input.getValue()
    if(conf.stripPadding && b64.length % 4 != 0 ) {
        b64 += ('===').slice(0, 4 - (b64.length % 4));
    }
    if(conf.urlSafe) {
        b64 = b64.replace(/_/g, '/').replace(/-/g, '+')
    }
    const str = Buffer.from(b64, 'base64').toString('utf8')
    return new StringData(str)
}

export function ConfigureBase64(props:ActionPanelProps) {
    const updateStripPadding = (v:boolean) => {
        const conf = EnsureB64Config(props.actionInstance.config)
        conf.stripPadding = v
        props.setActionInstance(props.actionInstance)
    }
    const updateUrlSafe = (v:boolean) => {
        const conf = EnsureB64Config(props.actionInstance.config)
        conf.urlSafe = v
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Grid container>
            <Grid item xs={6}>
                <ActionCheckbox label="URL Safe" value={props.actionInstance.config?.base64?.urlSafe} update={updateUrlSafe} />
            </Grid>
            <Grid item xs={6}>
                <ActionCheckbox label="Strip Padding" value={props.actionInstance.config?.base64?.stripPadding} update={updateStripPadding} />
            </Grid>
        </Grid>
    )
}

export function SummarizeBase64(props:ActionPanelProps) {
    const sum = []
    const c = props.actionInstance.config?.base64
    if(c?.urlSafe) {
        sum.push("URL Safe")
    }
    if(c?.stripPadding) {
        sum.push("Padding Stripped")
    }
    if(sum.length == 0) {
        return <Box />
    }
    return (
        <Box>
            <SummaryTypography text={sum.join(", ")} />
        </Box>
    )
}