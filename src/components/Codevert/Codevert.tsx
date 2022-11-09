import React, {Component, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';


import Box from '@mui/material/Box';
import CodeView from 'components/CodeView/CodeView';
import {Button, FormControl, InputLabel, ListSubheader, MenuItem} from "@mui/material";
import {useQueryAppParams} from "../AppParams/useQueryAppParams";
import Checkbox from '@mui/material/Checkbox';
import Select, { SelectChangeEvent } from '@mui/material/Select';



interface AppState {
  input: string;
  output: string|null;
  processingError: string|null;
}

function Codevert() {
  const [appParams, setAppParams] = useQueryAppParams();
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const doProcessing = () => {
    setOutput(input + " but different!")
  };
  useEffect(() => {
    if(appParams.autoProcess) {
      doProcessing()
    }
  },[input])

  const changeAutoProcess = (e:React.ChangeEvent<HTMLInputElement>) => {
    appParams.autoProcess = !appParams.autoProcess
    console.log(appParams.autoProcess)
    setAppParams(appParams)
  };

  const addAction = (e: SelectChangeEvent) => {
    appParams.actions.push(e.target.value as string)
    setAppParams(appParams)
  }

  return (
    <Box className="App">
      <Grid container spacing={2}>
        <Grid item xs>
          <CodeView text={input} setText={setInput} />
        </Grid>
        <Grid item style={{width:'150pt'}}>
          <Box>Controls</Box>
          <Box>
            <Button disabled={appParams.autoProcess} onClick={doProcessing}>Process</Button>
            <Checkbox checked={appParams.autoProcess} onChange={changeAutoProcess} />
             Auto
          </Box>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="add-action">Add Action</InputLabel>
            <Select value="" id="add-action" label="Add Action2" onChange={addAction}>
              <ListSubheader>Encoding</ListSubheader>
              <MenuItem value={"b64-enc"}>Base64 - Encode</MenuItem>
              <MenuItem value={"b64-dec"}>Base64 - Decode</MenuItem>
              <ListSubheader>Silly</ListSubheader>
              <MenuItem value={"reverse"}>Reverse</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg>
          <CodeView text={output} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Codevert;
