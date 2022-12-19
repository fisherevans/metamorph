import {
    Data,
    IncompatibleDataType,
    ObjectData,
    ProcessorConfig,
    StringData,
    TYPE_OBJECT,
    TYPE_STRING
} from "../ActionModels";
import {ActionCheckbox, ActionPanelProps, ActionTextField, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import React from "react";
import {default as jsonStableStringify} from 'json-stable-stringify';
import {parse as parseYaml, stringify as yamlStringify } from 'yaml'

import Checkbox from "@mui/material/Checkbox";
import {FormControlLabel} from "@mui/material";
import Grid from "@mui/material/Grid";
import {SchemaOptions, ToStringOptions} from "yaml/dist/options";

export const ACTION_CODE_PARSE_JSON = "parse-json"
export const ACTION_CODE_FORMAT_JSON = "fmt-json"

export const ACTION_CODE_PARSE_YAML = "parse-yaml"
export const ACTION_CODE_FORMAT_YAML = "fmt-yaml"

export interface FormattingConfig {
    indentDepth:number
    sortKeys:boolean
}

export function EnsureFormattingConfig(procConf:ProcessorConfig):FormattingConfig {
    if(procConf.formatting === undefined) {
        procConf.formatting = {
            indentDepth:2,
            sortKeys:true,
        }
    }
    return procConf.formatting
}

function ensureInputObj(input:Data, stringFn:(s:string)=>object):object {
    if(typeof input.getValue() === TYPE_STRING) {
        return stringFn(input.getValue())
    } else if(typeof input.getValue() === TYPE_OBJECT) {
        return input.getValue()
    } else {
        throw IncompatibleDataType(input)
    }
}

export function ConfigureFormatting(props:ActionPanelProps) {
    const updatePath = (v:string) => {
        const conf = EnsureFormattingConfig(props.actionInstance.config)
        conf.indentDepth = parseInt(v)
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
                <ActionTextField label="Indent Depth" value={(props.actionInstance.config.formatting?.indentDepth || "") + ""} number={true} update={updatePath} />
            </Grid>
            <Grid item xs={6}>
                <ActionCheckbox label="Sort Keys" value={props.actionInstance.config.formatting?.sortKeys} update={updateSort} />
            </Grid>
        </Grid>
    )
}

export function SummarizeFormatting(props:ActionPanelProps) {
    const sum = []
    const c = props.actionInstance.config.formatting
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

export function ParseJSON(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const obj = JSON.parse(input.getValue())
    return new ObjectData(obj)
}

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

export function ParseYAML(input:Data,config:ProcessorConfig):Data {
    if(typeof input.getValue() !== TYPE_STRING) {
        throw IncompatibleDataType(input)
    }
    const obj = parseYaml(input.getValue())
    return new ObjectData(obj)
}

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