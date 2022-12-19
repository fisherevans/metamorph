import React, {useState} from "react";

import Box from "@mui/material/Box";
import {ActionInstance, AvailableAction} from "./ActionModels";
import {FormControlLabel, IconButton, Paper, Stack, Typography} from "@mui/material";
import {AVAILABLE_ACTIONS} from "./ActionSetup";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {ACTION_CODE_QUERY_OBJ, ConfigureQueryJSON, SummarizeQueryJSON} from "./query/QueryData";
import TextField from "@mui/material/TextField";
import {InputProps as StandardInputProps} from "@mui/material/Input/Input";
import Checkbox from "@mui/material/Checkbox";

export enum ActionState {Success,Failure,Neutral}

export type ActionPanelProps = {
    actionInstance:ActionInstance
    setActionInstance:(updated:ActionInstance)=>void
    onDelete:()=>void
    state:ActionState
}

export const ActionPanel = (props:ActionPanelProps) => {
    const expand = () => {
        props.actionInstance.editing = true;
        props.setActionInstance(props.actionInstance)
    }
    const collapse = () => {
        props.actionInstance.editing = false;
        props.setActionInstance(props.actionInstance)
    }

    const elements = []
    const a = AVAILABLE_ACTIONS[props.actionInstance.code]
    if(props.actionInstance.editing && a.editPanel != undefined) {
        elements.push(a.editPanel(props))
    }
    if((a.editPanel == undefined || !props.actionInstance.editing) && a.summaryPanel != undefined) {
        elements.push(a.summaryPanel(props))
    }

    const buttonSx = {float:"right",transform: 'scale(0.75)',padding:'2pt'}
    let color:number
    switch (props.state) {
        case ActionState.Success: color = 115; break;
        case ActionState.Failure: color = 355; break;
        default: color = 217; // blue
    }
    return (
        <Paper elevation={2} sx={{padding:'2pt',backgroundColor:'hsl('+color+',100%,94%)'}}>
            <Box>
                <IconButton aria-label="Delete" sx={buttonSx} onClick={props.onDelete}><DeleteIcon /></IconButton>
                {a.editPanel != undefined && !props.actionInstance.editing && <IconButton aria-label="Edit" sx={buttonSx} onClick={expand}><EditIcon /></IconButton>}
                {a.editPanel != undefined && props.actionInstance.editing && <IconButton aria-label="Hide" sx={buttonSx} onClick={collapse}><ExpandLessIcon /></IconButton>}
                <Typography sx={{ fontSize: '9pt', textTransform: 'uppercase', fontWeight: '700',padding:'0 2pt',paddingTop:'4pt'}}>{AVAILABLE_ACTIONS[props.actionInstance.code].label}</Typography>
            </Box>
            {elements.length > 0 && <Box sx={{padding:'0 4pt'}}>{elements}</Box>}
        </Paper>
    )
}

export interface SummaryTypographyProps {text?:string, mono?:boolean}
export const SummaryTypography = (props:SummaryTypographyProps) => {
    const sx = {fontFamily:(props.mono ? 'monospace' : 'inherit'),fontSize:'10pt',fontStyle:'italic',opacity:'0.8'}
    return <Typography sx={sx}>{props.text}</Typography>
}

export interface ActionTextFieldProps {label:string, placeholder?:string, value?:string, update:(v:string)=>void, mono?:boolean, number?:boolean}
export const ActionTextField = (props:ActionTextFieldProps) => {
    const localUpdate = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let v = e.currentTarget.value
        if(props.number) {
            v = v.replaceAll(/[^0-9.]+/g, '')
        }
        props.update(v)
    }
    const inputProps:Partial<StandardInputProps> = {sx:{fontFamily:(props.mono ? 'monospace' : 'inherit'),fontSize:'10pt'}}
    if(props.number) {
        inputProps.inputMode = 'numeric';
        //inputProps.pattern = '[0-9]*';
    }
    return <TextField
        InputProps={inputProps}
        sx={{margin:0,paddingBottom:'6pt'}}
        focused
        autoFocus
        id="query-path"
        label={props.label}
        size={"small"}
        value={props.value}
        fullWidth
        variant="standard"
        placeholder={props.placeholder}
        onChange={localUpdate}
    />
}

export interface ActionCheckboxProps {label:string, value?:boolean, update:(v:boolean)=>void}
export const ActionCheckbox = (props:ActionCheckboxProps) => {
    const localUpdate = (e: React.FormEvent<HTMLInputElement>) => {
        props.update(e.currentTarget.checked)
    }
    return <Stack direction={"row"} alignItems={'center'}>
        <Checkbox checked={props.value || false} onChange={localUpdate}  sx={{paddingRight:'2pt'}} />
        <Typography sx={{fontSize:'10pt'}}>{props.label}</Typography>
    </Stack>
}
