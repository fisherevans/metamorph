import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';
import CodeView from 'components/CodeView/CodeView';
import {Button, IconButton, ListSubheader, MenuItem, Stack, Typography} from "@mui/material";
import {useQueryAppParams} from "../AppParams/useQueryAppParams";
import Checkbox from '@mui/material/Checkbox';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ActionInstance, AvailableAction, Data, ProcessorConfig, StringData} from "../ProcessingActions/ActionModels";
import {AVAILABLE_ACTION_GROUPS, AVAILABLE_ACTIONS} from "../ProcessingActions/ActionSetup";
import {ActionPanel, ActionState} from "../ProcessingActions/ActionPanel";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

function Codevert() {
  const [appParams, setAppParams] = useQueryAppParams();
  const [input, setInput] = useState<string>(window.localStorage.getItem('INPUT') || "");
  const [output, setOutput] = useState<string>("");
  const [failedAction, setFailedAction] = useState<number|undefined>(undefined);

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
        setOutput("Failed to execute action " + (i+1) + " (" + AVAILABLE_ACTIONS[ai.code].label + ")\n\nGot error: " + err + "\n\nLast data:\n" + data.asText())
        setFailedAction(i)
        return
      }
    }
    setOutput(data.asText())
    setFailedAction(undefined)
  };
  useEffect(() => {
    if(appParams.autoProcess) {
      doProcessing()
    }
  },[input, appParams])

  const changeAutoProcess = (e:React.ChangeEvent<HTMLInputElement>) => {
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
      }
      let state:ActionState = ActionState.Success
      if(index == failedAction) state = ActionState.Failure
      else if(failedAction !== undefined && index > failedAction) state = ActionState.Neutral
      return <ActionPanel
          key={index + ":" + ai.code}
          actionInstance={ai}
          setActionInstance={updateMe}
          onDelete={deleteMe}
          state={state} />
    });
  };

  const renderAvailableActions = () => {
    const items:any[] = []
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
      <Box sx={{padding:"8pt"}}>
        <Grid container spacing={2}>
          <Grid item xs>
            <CodeView text={input} setText={setInput} />
          </Grid>
          <Grid item style={{width:'200pt'}}>
            <Box sx={{'paddingTop':'12pt'}}>
              <Typography variant="h6">Controls</Typography>
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
          </Grid>
          <Grid item lg>
            <CodeView text={output} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Codevert;
