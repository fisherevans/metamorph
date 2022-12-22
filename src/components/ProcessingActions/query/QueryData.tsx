import {
    Data,
    IncompatibleInputDataType,
    ObjectData,
    StringData,
} from "../ActionModels";
import React from "react";
import {ActionPanelProps, ActionTextField, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import {default as jq} from 'jq-web';
import {DataType, ProcessorConfig, QueryDataConfig} from "../../AppConfig/model";

export function EnsureQueryDataConfig(procConf?:ProcessorConfig):QueryDataConfig {
    procConf = procConf || {}
    if(procConf.queryData === undefined) {
        procConf.queryData = {
            query: "."
        }
    }
    return procConf.queryData
}

export function QueryObject(input:Data, config:ProcessorConfig):Data {
    let obj
    if(input.getType() == DataType.STRING) {
        obj = JSON.parse(input.getValue())
    } else if(input.getType() == DataType.OBJECT) {
        obj = input.getValue()
    } else {
        throw IncompatibleInputDataType(input)
    }
    let path = config.queryData?.query.replace(/\[(\w+)\]/g, '.$1') || "";
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

export function QueryJQ(input:Data, config:ProcessorConfig):Promise<Data> {
    let obj
    if(input.getType() == DataType.STRING) {
        obj = JSON.parse(input.getValue())
    } else if(input.getType() == DataType.OBJECT) {
        obj = input.getValue()
    } else {
        throw IncompatibleInputDataType(input)
    }
    return jq.promised.json(obj, config.queryData?.query)
        .then((obj:any) => {
            if(typeof obj === 'object') {
                return new ObjectData(obj)
            }
            return new StringData(""+obj)
        })
}

export function SummarizeQueryJSON(props:ActionPanelProps) {
    return (
        <Box>
            <SummaryTypography text={props.actionInstance.config?.queryData?.query} mono={true} />
        </Box>
    )
}

export function ConfigureQueryJSON(props:ActionPanelProps) {
    const updatePath = (v:string) => {
        const conf = EnsureQueryDataConfig(props.actionInstance.config)
        conf.query = v
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Box>
            <ActionTextField label="Query Path" placeholder={".items[1].name"} value={props.actionInstance.config?.queryData?.query} mono={true} multiline={true} update={updatePath} />
        </Box>
    )
}
