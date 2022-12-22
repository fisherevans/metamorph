import {Data, IncompatibleInputDataType, StringData} from "../ActionModels";
import {ActionCheckbox, ActionPanelProps, ActionTextField, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import React from "react";
import {default as jsonStableStringify} from 'json-stable-stringify';
import {parse as parseYaml, stringify as yamlStringify} from 'yaml'
import {default as xml, Options} from 'xml-js';
import Grid from "@mui/material/Grid";
import {SchemaOptions, ToStringOptions} from "yaml/dist/options";
import {DataType, FormattingConfig, ProcessorConfig} from "../../AppConfig/model";

export function EnsureFormattingConfig(procConf?:ProcessorConfig):FormattingConfig {
    procConf = procConf || {}
    if(procConf.formatting === undefined) {
        procConf.formatting = {
            indentDepth:2,
            sortKeys:true,
        }
    }
    return procConf.formatting
}

function ensureInputObj(input:Data, stringFn:(s:string)=>object):object {
    if(input.getType() == DataType.STRING) {
        return stringFn(input.getValue() as string)
    } else if(input.getType() == DataType.OBJECT) {
        return input.getValue()
    } else {
        throw IncompatibleInputDataType(input)
    }
}

export function ConfigureFormatting(props:ActionPanelProps) {
    const updateIndent = (v:string) => {
        const conf = EnsureFormattingConfig(props.actionInstance.config)
        conf.indentDepth = parseInt(v) || 0
        props.setActionInstance(props.actionInstance)
    }
    const updateSort = (v:boolean) => {
        const conf = EnsureFormattingConfig(props.actionInstance.config)
        conf.sortKeys = v
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Grid container>
            <Grid item xs={6}>
                <ActionTextField label="Indent Depth" value={(props.actionInstance.config?.formatting?.indentDepth || "") + ""} number={true} update={updateIndent} />
            </Grid>
            <Grid item xs={6}>
                <ActionCheckbox label="Sort Keys" value={props.actionInstance.config?.formatting?.sortKeys} update={updateSort} />
            </Grid>
        </Grid>
    )
}

export function ConfigureFormattingIndent(props:ActionPanelProps) {
    const updateIndent = (v:string) => {
        const conf = EnsureFormattingConfig(props.actionInstance.config)
        conf.indentDepth = parseInt(v) || 0
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Grid container>
            <Grid item xs={6}>
                <ActionTextField label="Indent Depth" value={(props.actionInstance.config?.formatting?.indentDepth || "") + ""} number={true} update={updateIndent} />
            </Grid>
        </Grid>
    )
}

export function SummarizeFormatting(props:ActionPanelProps) {
    const sum = []
    const c = props.actionInstance.config?.formatting
    if(c?.indentDepth != undefined && c.indentDepth > 0) {
        sum.push("Indent: " + c?.indentDepth)
    }
    if(c?.sortKeys) {
        sum.push("Keys sorted")
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

// ================================================================================= JSON

export function FormatJSON(input:Data,config:ProcessorConfig):Data {
    const obj = ensureInputObj(input, JSON.parse)
    const space = config.formatting?.indentDepth || 0
    let json:string
    if(config.formatting?.sortKeys) {
        json = jsonStableStringify(obj, {space:space})
    } else {
        json = JSON.stringify(obj, null, space)
    }

    return new StringData(json)
}

// ================================================================================= YAML

export function FormatYAML(input:Data,config:ProcessorConfig):Data {
    const obj = ensureInputObj(input, parseYaml)
    const opt:ToStringOptions&SchemaOptions = {
        sortMapEntries: config.formatting?.sortKeys,
    }
    const space = config.formatting?.indentDepth || 0
    if(space > 0) {
        opt.indent = space
    }
    const yaml = yamlStringify(obj, opt)
    return new StringData(yaml)
}

// ================================================================================= XML


export function FormatXML(input:Data,config:ProcessorConfig):Data {
    const obj = ensureInputObj(input, (s)=>JSON.parse(xml.xml2json(x)))
    const opts:Options.JS2XML = {
        spaces: config.formatting?.indentDepth || 0,
    }
    const x = xml.js2xml(obj, opts)
    return new StringData(x)
}