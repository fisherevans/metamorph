import {
    ConfigurableActionProps,
    Data,
    IncompatibleDataType,
    ObjectData,
    ProcessorConfig,
    StringData, TYPE_OBJECT, TYPE_STRING
} from "../ActionModels";
import {type} from "os";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import React, {useState} from "react";
import {ActionPanelProps, ActionTextField, SummaryTypography} from "../ActionPanel";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {EnsureFormattingConfig} from "../formatting/Format";

export const ACTION_CODE_QUERY_OBJ = "query-obj"

export interface QueryDataConfig {
    path:string
}

export function EnsureQueryDataConfig(procConf:ProcessorConfig):QueryDataConfig {
    if(procConf.query === undefined) {
        procConf.query = {
            path: "."
        }
    }
    return procConf.query
}

export function QueryObject(input:Data, config:ProcessorConfig):Data {
    let obj
    if(typeof input.getValue() === TYPE_STRING) {
        obj = JSON.parse(input.getValue())
    } else if(typeof input.getValue() === TYPE_OBJECT) {
        obj = input.getValue()
    } else {
        throw IncompatibleDataType(input)
    }
    let path = config.query?.path.replace(/\[(\w+)\]/g, '.$1') || "";
    path = path.replace(/^\./, '');
    if(path.length == 0) {
        return input
    }
    const a = path.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            throw "Invalid path for object"
        }
    }
    if(typeof obj === 'object') {
        return new ObjectData(obj)
    }
    return new StringData(""+obj)
}

export function SummarizeQueryJSON(props:ActionPanelProps) {
    return (
        <Box>
            <SummaryTypography text={props.actionInstance.config.query?.path} mono={true} />
        </Box>
    )
}

export function ConfigureQueryJSON(props:ActionPanelProps) {
    const updatePath = (v:string) => {
        const conf = EnsureQueryDataConfig(props.actionInstance.config)
        conf.path = v
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Box>
            <ActionTextField label="Query Path" placeholder={".items[1].name"} value={props.actionInstance.config.query?.path} mono={true} update={updatePath} />
        </Box>
    )
}