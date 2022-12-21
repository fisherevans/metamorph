import React, {useCallback, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';
import CodeView from 'components/CodeView/CodeView';
import {Button, IconButton, ListSubheader, MenuItem, Paper, Stack, Typography} from "@mui/material";
import {DecodeConfig, EncodeConfig} from "./QueryParamState";
import Checkbox from '@mui/material/Checkbox';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {AvailableAction, Data, StringData} from "../ProcessingActions/ActionModels";
import {AVAILABLE_ACTION_GROUPS, AVAILABLE_ACTIONS} from "../ProcessingActions/ActionSetup";
import {ActionPanel, ActionState} from "../ProcessingActions/ActionPanel";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import {useLocation, useNavigate} from "react-router-dom";
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { useTheme } from "@mui/material/styles";
import {ActionInstance, AppConfig, ProcessorConfig} from "../AppConfig/model";

/*
Notes:
https://devtrium.com/posts/async-functions-useeffect
https://stackoverflow.com/questions/54069253/the-usestate-set-method-is-not-reflecting-a-change-immediately
 */

export interface ProcessingFailure {
  failedActionIndex:number
  error:string
}

export interface AppOutput {
  failedAction?:ProcessingFailure
  data?:Data
}

function Metamorph() {
  const theme = useTheme();
  const location = useLocation()
  const navigate = useNavigate()

  const [appConfig, setAppConfig] = useState<AppConfig>(DecodeConfig(location.search));
  const [input, setInput] = useState<string>(window.localStorage.getItem('INPUT') || "");
  const [output, setOutput] = useState<AppOutput>({});

  useEffect(() => {
    console.log("encoding to url")
    const queryString = EncodeConfig(appConfig)
    navigate(`${location.pathname}?${queryString}`)
  }, [appConfig]);

  useEffect(() => {
    window.localStorage.setItem('INPUT', input);
  }, [input]);

  const doProcessing = useCallback(async () => {
    console.log("in doProcessing")
    const actions = appConfig.actions
    let data:Data = new StringData(input)
    for(let actionId = 0;actionId < actions.length;actionId++) {
      console.log("executing", actionId, data)
      const action = actions[actionId]
      try {
        data = await AVAILABLE_ACTIONS[action.code].processor(data, action.config || {})
      } catch (err) {
        console.log("failed", err)
        setOutput({
          failedAction : {
             error: err + "",
             failedActionIndex: actionId,
          },
          data: data,
        })
        return
      }
    }
    console.log("done", data)
    setOutput({
      data: data,
    })
  }, [input, appConfig, setOutput]);

  useEffect(() => {
    console.log("triggered on input or appConfig")
    if(appConfig.autoProcess) {
      console.log("is auto")
      doProcessing().catch(console.log)
    }
  },[input, appConfig, doProcessing])

  const changeAutoProcess = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("changing params", e.currentTarget.checked)
    if(appConfig.autoProcess != e.currentTarget.checked) {
      setAppConfig({
        ...appConfig,
        autoProcess: e.currentTarget.checked,
      })
    }
  };

  const addAction = (e: SelectChangeEvent) => {
    const a = e.target.value as unknown as AvailableAction
    const config:ProcessorConfig = {}
    if(a.initConfig) {
      a.initConfig(config)
    }
    setAppConfig({
      ...appConfig,
      actions: appConfig.actions.concat([{
        code: a.code,
        editing: true,
        config: config,
      }])
    })
  }

  const collapseAll = () => {
    const actions:ActionInstance[] = []
    for(let i = 0;i < appConfig.actions.length;i++) {
      actions.push({
        ...appConfig.actions[i],
        editing: false,
      })
    }
    setAppConfig({
      ...appConfig,
      actions: actions,
    })
  }

  const renderAction = (ai:ActionInstance, index:number) => {
    const updateMe = (updated:ActionInstance) => {
      appConfig.actions[index] = updated
      console.log("set action value")
      setAppConfig({
        ...appConfig
      })
    }
    const deleteMe = () => {
      const actions = appConfig.actions.slice();
      actions.splice(index, 1)
      setAppConfig({
        ...appConfig,
        actions: actions,
      })
    }
    const moveUp = () => {
      if(index <= 0) {
        return
      }
      const actions = appConfig.actions.slice();
      [actions[index-1], actions[index]] = [actions[index], actions[index-1]];
      setAppConfig({
        ...appConfig,
        actions: actions,
      })
      setOutput({
        ...output,
        failedAction: undefined
      })
    }
    const moveDown = () => {
      if(index >= appConfig.actions.length-1) {
        return
      }
      const actions = appConfig.actions.slice();
      [actions[index], actions[index+1]] = [actions[index+1], actions[index]];
      setAppConfig({
        ...appConfig,
        actions: actions,
      })
      setOutput({
        ...output,
        failedAction: undefined
      })
    }
    // todo - what if never run? what about moving or deleting actions
    // new state for success stuff?
    let actionState:ActionState = ActionState.Neutral
    if(index == output.failedAction?.failedActionIndex) actionState = ActionState.Failure
    else if(output.failedAction !== undefined && index < output.failedAction?.failedActionIndex) actionState = ActionState.Success
    return <ActionPanel
        key={index + ":" + ai.code}
        actionInstance={ai}
        setActionInstance={updateMe}
        onDelete={deleteMe}
        state={actionState}
        moveUp={moveUp}
        moveDown={moveDown} />
  };

  const renderAvailableActions = () => {
    const items:JSX.Element[] = []
    AVAILABLE_ACTION_GROUPS.forEach(group => {
      items.push(<ListSubheader key={group.label}>{group.label}</ListSubheader>)
      group.codes.forEach(code => {
        const action = AVAILABLE_ACTIONS[code]
        items.push(<MenuItem key={code} value={action as any}>{action.label}</MenuItem>)
      })
    })
    return items
  }

  const changeZoom = (v:boolean) => {
    setAppConfig({
      ...appConfig,
      zoomed: v,
    })
  }

  const zoomButtonSx = {position:"absolute",top:"4pt",right:"4pt",transform: 'scale(0.75)',padding:'2pt'}
  return (
    <Box className="App">
      <Grid container columns={{ sm: 1, md: 3 }}>
        <Grid item xs style={{margin:'4pt',minWidth:'200pt'}}>
          <Typography variant={"h5"} align={"center"}>Input</Typography>
          <CodeView text={input} setText={setInput} />
        </Grid>
        <Grid item style={{width:(appConfig.zoomed ? '400pt' : '200pt'),margin:'0 4pt',padding:'4pt'}} alignContent={'center'}>
          <Box
              component="img"
              sx={{
                width: "100%",
                margin: "12pt 0",
              }}
              alt="Metamorph: transform stuff"
              src="banner.png"
          />
          <Paper elevation={4} sx={{padding:'10pt',position:'relative'}}>
            {appConfig.zoomed && <IconButton aria-label="Expand Controls" sx={zoomButtonSx} onClick={() => changeZoom(false)}><ZoomInMapIcon /></IconButton>}
            {!appConfig.zoomed && <IconButton aria-label="Contract Controls" sx={zoomButtonSx} onClick={() => changeZoom(true)}><ZoomOutMapIcon /></IconButton>}
            <Stack direction={'row'} alignItems="center" style={{paddingTop:"8pt"}}>
              <Button fullWidth disabled={appConfig.autoProcess} onClick={doProcessing} variant="contained">Process</Button>
              <Checkbox checked={appConfig.autoProcess} onChange={changeAutoProcess} size={'small'} />
              <Typography sx={{fontSize:'10pt',fontStyle:'italic'}}>Auto</Typography>
            </Stack>
            <Box sx={{'paddingTop':'12pt'}}>
              <IconButton aria-label="Collapse All" sx={{float:"right",transform: 'scale(1)',padding:'2pt'}} onClick={collapseAll}><UnfoldLessIcon /></IconButton>
              <Typography variant="h6">Processing Actions</Typography>
              <Stack direction={"column"} spacing={"6pt"} sx={{'paddingTop':'4pt'}}>
                {appConfig.actions.map(renderAction)}
              </Stack>
            </Box>
            <Box sx={{'paddingTop':'12pt'}}>
              <Select displayEmpty value="" id="add-action" onChange={addAction} fullWidth={true}>
                <MenuItem disabled value=""><em>Add action...</em></MenuItem>
                {renderAvailableActions()}
              </Select>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs style={{margin:'4pt',minWidth:'200pt'}}>
          <Typography variant={"h5"} align={"center"}>Output</Typography>
          {output.failedAction != undefined && appConfig.actions.length > output.failedAction.failedActionIndex && (
              <Box>
                <Paper sx={{padding:'10pt',margin:'4pt',marginBottom:'15pt',backgroundColor:theme.palette.error.dark}}>
                  <Typography variant={'h6'}>Failure! Could not <b>{AVAILABLE_ACTIONS[appConfig.actions[output.failedAction.failedActionIndex].code].label}</b></Typography>
                  <Typography>Received the following error when processing action #{output.failedAction.failedActionIndex+1}:</Typography>
                  <Paper sx={{padding:'10pt',margin:'6pt',backgroundColor:theme.palette.background.paper}}>
                    <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'10pt'}}>{output.failedAction.error+""}</Typography>
                  </Paper>
                </Paper>
              </Box>
          )}
          {output.data != undefined && typeof output.data?.getValue() != 'string' && (
              <Box>
                <Paper sx={{padding:'10pt',margin:'4pt',marginBottom:'15pt',backgroundColor:theme.palette.warning.dark}}>
                  <Typography><b>The final result was not a string</b>, the following is an approximation.</Typography>
                </Paper>
              </Box>
          )}
          <CodeView text={output.data?.asText()||""} />
        </Grid>
      </Grid>
      <Typography align={"center"} fontStyle={"italic"} sx={{color:theme.palette.text.secondary,padding:"20pt"}}>Made by <a href={"https://fisherevans.com/"}>Fisher Evans</a>. Find the source code <a href={"https://github.com/fisherevans/metamorph"}>on Github</a>.</Typography>
    </Box>
  );
}

export default Metamorph;
