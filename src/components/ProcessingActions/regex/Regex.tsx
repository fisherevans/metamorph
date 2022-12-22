import {Data, IncompatibleInputDataType, StringData} from "../ActionModels";
import React from "react";
import {ActionPanelProps, ActionTextField, SummaryTypography} from "../ActionPanel";
import Box from "@mui/material/Box";
import {DataType, ProcessorConfig, RegexConfig} from "../../AppConfig/model";

export function EnsureRegexConfig(procConf?:ProcessorConfig):RegexConfig {
    procConf = procConf || {}
    if(procConf.regex === undefined) {
        procConf.regex = {
            pattern:"",
            replacement:"",
        }
    }
    return procConf.regex
}

export function RegexReplace(input:Data, config:ProcessorConfig):Data {
    if(input.getType() != DataType.STRING) {
        throw IncompatibleInputDataType(input)
    }
    const conf = EnsureRegexConfig(config)
    // todo add i next to g? make g configurable?
    const regex = new RegExp(conf.pattern, "g")
    const v = input.getValue().replaceAll(regex, conf.replacement)
    return new StringData(v)
}

export function SummarizeRegexReplace(props:ActionPanelProps) {
    return (
        <Box>
            <SummaryTypography text={"/"+props.actionInstance.config?.regex?.pattern+"/g"} mono={true} />
            <SummaryTypography text={props.actionInstance.config?.regex?.replacement} mono={true} />
        </Box>
    )
}

export function ConfigureRegexReplace(props:ActionPanelProps) {
    const updatePattern = (v:string) => {
        const conf = EnsureRegexConfig(props.actionInstance.config)
        conf.pattern = v
        props.setActionInstance(props.actionInstance)
    }
    const updateReplace = (v:string) => {
        const conf = EnsureRegexConfig(props.actionInstance.config)
        conf.replacement = v
        props.setActionInstance(props.actionInstance)
    }
    return (
        <Box>
            <ActionTextField label="Regex Pattern" placeholder={"[a-z]+([0-9])"} value={props.actionInstance.config?.regex?.pattern} mono={true} update={updatePattern} />
            <ActionTextField label="Replacement" placeholder={"num $1"} value={props.actionInstance.config?.regex?.replacement} mono={true} update={updateReplace} />
        </Box>
    )
}
