import React from "react";

import Box from "@mui/material/Box";
import {ActionInstance} from "./ActionModels";
import {IconButton, Paper, Stack, Typography} from "@mui/material";
import {AVAILABLE_ACTIONS} from "./ActionSetup";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TextField from "@mui/material/TextField";
import {InputProps as StandardInputProps} from "@mui/material/Input/Input";
import Checkbox from "@mui/material/Checkbox";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {ArrowDropUp} from "@mui/icons-material";
import Grid from "@mui/material/Grid";
export enum ActionState {Success,Failure,Neutral}
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TripOriginIcon from '@mui/icons-material/TripOrigin';

export type ActionPanelProps = {
    actionInstance:ActionInstance
    setActionInstance:(updated:ActionInstance)=>void
    onDelete:()=>void
    moveUp:()=>void
    moveDown:()=>void
    state:ActionState
}

export const ActionPanel = (props:ActionPanelProps) => {
    const theme = useTheme();
    const expand = () => {
        props.actionInstance.editing = true;
        props.setActionInstance(props.actionInstance)
    }
    const collapse = () => {
        props.actionInstance.editing = false;
        props.setActionInstance(props.actionInstance)
    }

    let panel:JSX.Element|undefined
    const a = AVAILABLE_ACTIONS[props.actionInstance.code]
    if(props.actionInstance.editing && a.editPanel != undefined) {
        panel = a.editPanel(props);
    } else if((a.editPanel == undefined || !props.actionInstance.editing) && a.summaryPanel != undefined) {
        panel = a.summaryPanel(props)
    }

    const buttonSx = {padding:'2pt',width:'16pt',height:'16pt',margin:'0 1pt'}
    const iconSx = {fontSize:'16pt'}
    const arrowButtonSx = {padding:'1pt 2pt',width:'10pt',height:'8pt',margin:'0 1pt'}
    const arrowIconSx = {fontSize:'8pt'}

    let icon:JSX.Element|undefined = undefined
    const statusIconSx = {marginRight:'4pt',fontSize:'12pt', color:theme.palette.success.main}
    switch (props.state) {
        case ActionState.Success:
            icon = <CheckCircleIcon sx={{...statusIconSx,color:theme.palette.success.main}}/>
            break;
        case ActionState.Failure:
            icon = <CancelIcon sx={{...statusIconSx,color:theme.palette.error.main}}/>
            break;
        default:
            icon = <TripOriginIcon sx={{...statusIconSx,color:theme.palette.text.disabled}}/>
    }
    return (
        <Paper elevation={2} sx={{padding:'2pt'}}>
            <Grid container>
                <Grid item xs>
                    <Stack direction={'row'} alignItems={'center'} style={{padding:'3pt'}}>
                        {icon && icon}
                        <Typography sx={{ color:theme.palette.primary.light, fontSize: '9pt', textTransform: 'uppercase', fontWeight: '700',padding:'0 2pt'}}>
                            {AVAILABLE_ACTIONS[props.actionInstance.code].label}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item>
                    {a.editPanel != undefined && !props.actionInstance.editing && <IconButton aria-label="Edit" sx={buttonSx} onClick={expand}><EditIcon sx={iconSx} /></IconButton>}
                    {a.editPanel != undefined && props.actionInstance.editing && <IconButton aria-label="Hide" sx={buttonSx} onClick={collapse}><ExpandLessIcon sx={iconSx} /></IconButton>}
                </Grid>
                <Grid item>
                    <IconButton aria-label="Delete" sx={buttonSx} onClick={props.onDelete}><DeleteIcon sx={iconSx} /></IconButton>
                </Grid>
                <Grid item>
                    <Stack style={{padding:'2pt'}}>
                        <IconButton aria-label="Move Up" sx={arrowButtonSx} onClick={props.moveUp}><PlayArrowIcon sx={{...arrowIconSx,transform:'rotate(-90deg)'}} /></IconButton>
                        <IconButton aria-label="Move Down" sx={arrowButtonSx} onClick={props.moveDown}><PlayArrowIcon sx={{...arrowIconSx,transform:'rotate(90deg)'}} /></IconButton>
                    </Stack>
                </Grid>
            </Grid>
            {panel != undefined && <Box sx={{padding:'0 4pt'}}>{panel}</Box>}
        </Paper>
    )
}

export interface SummaryTypographyProps {text?:string, mono?:boolean}
export const SummaryTypography = (props:SummaryTypographyProps) => {
    const sx = {
        fontFamily:(props.mono ? '"JetBrains Mono",monospace' : 'inherit'),
        fontSize:'10pt',
        fontStyle:'italic',
        opacity:'0.8',
        whiteSpace:'pre-line',
    }
    return <Typography sx={sx}>{props.text}</Typography>
}

export interface ActionTextFieldProps {label:string, placeholder?:string, value?:string, update:(v:string)=>void, mono?:boolean, multiline?:boolean, number?:boolean}
export const ActionTextField = (props:ActionTextFieldProps) => {
    const localUpdate = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let v = e.currentTarget.value
        if(props.number) {
            v = v.replaceAll(/[^0-9.]+/g, '')
        }
        props.update(v)
    }
    const inputProps:Partial<StandardInputProps> = {sx:{fontFamily:(props.mono ? '"JetBrains Mono",monospace' : 'inherit'),fontSize:'10pt'}}
    if(props.number) {
        inputProps.inputMode = 'numeric';
        //inputProps.pattern = '[0-9]*';
    }
    return <TextField
        InputProps={inputProps}
        sx={{margin:0,paddingBottom:'6pt'}}
        focused
        autoFocus
        multiline={props.multiline||false}
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
