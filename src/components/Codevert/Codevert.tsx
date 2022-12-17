import React, {Component, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';
import CodeView from 'components/CodeView/CodeView';
import {Button, Chip, FormControl, InputLabel, ListSubheader, MenuItem, Stack, Typography} from "@mui/material";
import {useQueryAppParams} from "../AppParams/useQueryAppParams";
import Checkbox from '@mui/material/Checkbox';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  AVAILABLE_ACTION_GROUPS,
  AVAILABLE_ACTIONS,
  AvailableAction, Data, StringData
} from "../ProcessingActions/ProcessingActions";

function Codevert() {
  const [appParams, setAppParams] = useQueryAppParams();
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const doProcessing = () => {
    let data:Data = new StringData(input)
    try {
      appParams.actions.forEach(ai => {
        data = AVAILABLE_ACTIONS[ai.code].processor(data, ai.config)
      })
      setOutput(data.asText())
    } catch (err) {

      setOutput("Got error:\n" + err + "\n\nLast data:\n" + data.asText())
    }
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
    appParams.actions.push({
      code: a.code,
      config: a.newConfig(),
    })
    setAppParams(appParams)
  }

  const renderActions = () => {
    return appParams.actions.map((ai, index) => {
      const deleteMe = () => {
        appParams.actions.splice(index, 1)
        setAppParams(appParams)
      }
      const action = AVAILABLE_ACTIONS[ai.code]
      return <Chip
          label={action.label}
          key={index + ":" + ai.code}
          //onClick={handleClick}
          onDelete={deleteMe}
      />
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
      <Grid container spacing={2}>
        <Grid item xs>
          <CodeView text={input} setText={setInput} />
        </Grid>
        <Grid item style={{width:'150pt'}}>
          <Box sx={{'padding-top':'12pt'}}>
            <Typography variant="h6">Controls</Typography>
            <Button disabled={appParams.autoProcess} onClick={doProcessing} variant="contained">Process</Button>
            <Checkbox checked={appParams.autoProcess} onChange={changeAutoProcess} />
             Auto
          </Box>
          <Box sx={{'padding-top':'12pt'}}>
            <Typography variant="h6">Processing Actions</Typography>
            <Stack direction={"column"} spacing={"3pt"} sx={{'padding-top':'4pt'}}>
              {renderActions()}
            </Stack>
          </Box>
          <Box sx={{'padding-top':'12pt'}}>
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
  );
}

export default Codevert;
