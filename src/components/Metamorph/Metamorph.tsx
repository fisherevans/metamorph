import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';
import CodeView from 'components/CodeView/CodeView';
import {Button, IconButton, ListSubheader, MenuItem, Paper, Stack, Typography} from "@mui/material";
import {useQueryAppParams} from "../AppParams/useQueryAppParams";
import Checkbox from '@mui/material/Checkbox';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ActionInstance, AvailableAction, Data, ProcessorConfig, StringData} from "../ProcessingActions/ActionModels";
import {AVAILABLE_ACTION_GROUPS, AVAILABLE_ACTIONS} from "../ProcessingActions/ActionSetup";
import {ActionPanel, ActionState} from "../ProcessingActions/ActionPanel";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

export interface ProcessingFailure {
  lastData:Data
  failedActionIndex:number
  error:any
}

export interface AppState {
  failedAction?:ProcessingFailure
  output?:Data
}

function Metamorph() {
  const [appParams, setAppParams] = useQueryAppParams();
  const [input, setInput] = useState<string>(window.localStorage.getItem('INPUT') || "");
  const [state, setState] = useState<AppState>({});

  useEffect(() => {
    window.localStorage.setItem('INPUT', input);
  }, [input]);

  const doProcessing = () => {
    let data:Data = new StringData(input)
    for(let i=0;i < appParams.actions.length;i++) {
      const ai = appParams.actions[i]
      try {
        data = AVAILABLE_ACTIONS[ai.code].processor(data, ai.config)
      } catch (err) {
        setState({
          failedAction: {
            lastData: data,
            error: err,
            failedActionIndex: i,
          },
          output: data,
        })
        return
      }
    }
    setState({
      output: data,
    })
  };
  useEffect(() => {
    if(appParams.autoProcess) {
      doProcessing()
    }
  },[input, appParams])

  const changeAutoProcess = () => {
    appParams.autoProcess = !appParams.autoProcess
    setAppParams(appParams)
  };

  const addAction = (e: SelectChangeEvent) => {
    console.log(e)
    const a = e.target.value as unknown as AvailableAction
    const config:ProcessorConfig = {}
    if(a.initConfig) {
      a.initConfig(config)
    }
    appParams.actions.push({
      code: a.code,
      editing: true,
      config: config,
    })
    setAppParams(appParams)
  }

  const collapseAll = () => {
    for(let i = 0;i < appParams.actions.length;i++) {
      appParams.actions[i].editing = false
    }
    setAppParams(appParams)
  }

  const renderActions = () => {
    return appParams.actions.map((ai, index) => {
      const updateMe = (updated:ActionInstance) => {
        appParams.actions[index] = updated
        setAppParams(appParams)
      }
      const deleteMe = () => {
        appParams.actions.splice(index, 1)
        setAppParams(appParams)
        setState({})
      }
      let actionState:ActionState = ActionState.Success
      if(index == state.failedAction?.failedActionIndex) actionState = ActionState.Failure
      else if(state.failedAction !== undefined && index > state.failedAction?.failedActionIndex) actionState = ActionState.Neutral
      return <ActionPanel
          key={index + ":" + ai.code}
          actionInstance={ai}
          setActionInstance={updateMe}
          onDelete={deleteMe}
          state={actionState} />
    });
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

  return (
    <Box className="App">
      <Box>
        <Grid container>
          <Grid item xs style={{margin:'4pt'}}>
            <CodeView text={input} setText={setInput} />
          </Grid>
          <Grid item style={{width:'200pt',margin:'0 4pt',padding:'4pt'}}>
            <Paper elevation={4} sx={{padding:'10pt'}}>
              <Box>
                <Typography variant="h4" sx={{textAlign:'center'}}>Metamorph!</Typography>
                <Stack direction={'row'} alignItems="center">
                  <Button fullWidth disabled={appParams.autoProcess} onClick={doProcessing} variant="contained">Process</Button>
                  <Checkbox checked={appParams.autoProcess} onChange={changeAutoProcess} size={'small'} />
                  <Typography sx={{fontSize:'10pt',fontStyle:'italic'}}>Auto</Typography>
                </Stack>
              </Box>
              <Box sx={{'paddingTop':'12pt'}}>
                <IconButton aria-label="Collapse All" sx={{float:"right",transform: 'scale(1)',padding:'2pt'}} onClick={collapseAll}><UnfoldLessIcon /></IconButton>
                <Typography variant="h6">Processing Actions</Typography>
                <Stack direction={"column"} spacing={"6pt"} sx={{'paddingTop':'4pt'}}>
                  {renderActions()}
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
          <Grid item lg>
            {state.failedAction != undefined && (
                <Box>
                  <Paper sx={{padding:'10pt',margin:'4pt',marginBottom:'15pt',backgroundColor:'hsl(355,100%,85%)'}}>
                    <Typography variant={'h6'}>Failure! Could not <b>{AVAILABLE_ACTIONS[appParams.actions[state.failedAction.failedActionIndex].code].label}</b></Typography>
                    <Typography>Received the following error when processing action #{state.failedAction.failedActionIndex+1}:</Typography>
                    <Paper sx={{padding:'10pt',margin:'6pt',backgroundColor:'hsl(355,100%,92%)'}}>
                      <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'10pt'}}>{state.failedAction.error+""}</Typography>
                    </Paper>
                  </Paper>
                </Box>
            )}
            {state.output != undefined && typeof state.output?.getValue() != 'string' && (
                <Box>
                  <Paper sx={{padding:'10pt',margin:'4pt',marginBottom:'15pt',backgroundColor:'hsl(20,100%,85%)'}}>
                    <Typography><b>The final result was not a string</b>, the following is an approximation.</Typography>
                  </Paper>
                </Box>
            )}
            <CodeView text={state.output?.asText()||""} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Metamorph;
