import React, {useCallback, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';
import CodeView from 'components/CodeView/CodeView';
import {
  Alert,
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton,
  ListSubheader,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Typography
} from "@mui/material";
import {DecodeAppConfig, DecodeQueryStringState, EncodeUrlState} from "./ExternalAppState";
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

const LOCAL_STORAGE_CONFIG = "CONFIG"
const LOCAL_STORAGE_INPUT = "INPUT"
const LOCAL_STORAGE_SUBSEQUENT_VISIT = "SUBSEQUENT_VISIT"

export interface ProcessingFailure {
  failedActionIndex:number
  error:any
}

export interface AppOutput {
  successfulActions?:number[]
  failedAction?:ProcessingFailure
  data?:Data
}

function Metamorph() {
  const theme = useTheme();
  const location = useLocation()
  const navigate = useNavigate()

  const urlState = DecodeQueryStringState(location.search)
  const [appConfig, setAppConfig] = useState<AppConfig>(urlState.config
      || DecodeAppConfig(window.localStorage.getItem(LOCAL_STORAGE_CONFIG))
      || {
        zoomed: false,
        autoProcess: false,
        actions: []
      });
  const [input, setInput] = useState<string>(urlState.input || window.localStorage.getItem(LOCAL_STORAGE_INPUT) || "");
  const [output, setOutput] = useState<AppOutput>({});
  const [shareTipOpen, setShareTipOpen] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(window.localStorage.getItem(LOCAL_STORAGE_SUBSEQUENT_VISIT) == undefined);

  const shareLink = () => {
    const state = EncodeUrlState(appConfig, input)
    navigate(`${location.pathname}?${state.queryString}`)
    const fullLink = window.location.href.replaceAll(/\?.*/g, "") + "?" + state.queryString
    navigator.clipboard.writeText(fullLink)
        .then(() => setShareTipOpen(true))
        .catch(err => alert('failed to copy to clipboard: ' + err))
  }

  const shareTipClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShareTipOpen(false);
  };

  const closeDetails = () => {
    window.localStorage.setItem(LOCAL_STORAGE_SUBSEQUENT_VISIT, "true");
    setShowDetails(false);
  };

  useEffect(() => {
    const state = EncodeUrlState(appConfig)
    navigate(`${location.pathname}?${state.queryString}`)
    if(state.config != undefined) {
      window.localStorage.setItem(LOCAL_STORAGE_CONFIG, state.config);
    }
  }, [appConfig]);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_INPUT, input);
  }, [input]);

  const doProcessing = useCallback(async () => {
    const actions = appConfig.actions
    const successfulActions:number[] = []
    let data:Data = new StringData(input)
    for(let actionId = 0;actionId < actions.length;actionId++) {
      const action = actions[actionId]
      try {
        data = await AVAILABLE_ACTIONS[action.code].processor(data, action.config || {})
      } catch (err) {
        setOutput({
          data,
          successfulActions,
          failedAction : {
             error: err,
             failedActionIndex: actionId,
          },
        })
        return
      }
      successfulActions.push(actionId)
    }
    setOutput({
      data,
      successfulActions,
    })
  }, [input, appConfig, setOutput]);

  useEffect(() => {
    if(appConfig.autoProcess) {
      doProcessing().catch(console.log)
    }
  },[input, appConfig, doProcessing])

  const changeAutoProcess = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // no need to reset success and fail actions - either auto process, or all before
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
      setOutput({
        ...output,
        failedAction: undefined,
        successfulActions: undefined,
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
        failedAction: undefined,
        successfulActions: undefined,
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
        failedAction: undefined,
        successfulActions: undefined,
      })
    }
    let actionState:ActionState = ActionState.Neutral
    if(index == output.failedAction?.failedActionIndex) actionState = ActionState.Failure
    else if(output.successfulActions !== undefined && output.successfulActions.indexOf(index) > -1) actionState = ActionState.Success
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
                marginTop: "12pt",
              }}
              alt="Metamorph: transform stuff"
              src="banner.png"
          />
          <Box sx={{width:"100%",marginTop:'0pt'}} textAlign='center'>
            <Button onClick={() => setShowDetails(true)} variant='text'>What is this?</Button>
          </Box>
          <Paper elevation={4} sx={{marginTop:'6pt',padding:'10pt',position:'relative'}}>
            {appConfig.zoomed && <IconButton aria-label="Expand Controls" sx={zoomButtonSx} onClick={() => changeZoom(false)}><ZoomInMapIcon /></IconButton>}
            {!appConfig.zoomed && <IconButton aria-label="Contract Controls" sx={zoomButtonSx} onClick={() => changeZoom(true)}><ZoomOutMapIcon /></IconButton>}
            <Stack direction={'row'} alignItems="center" style={{paddingTop:"8pt"}}>
              <Button fullWidth /*disabled={appConfig.autoProcess}*/ onClick={doProcessing} variant="contained">Process</Button>
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
            <Box sx={{width:"100%",marginTop:'10pt'}} textAlign='center'>
              <Button onClick={shareLink} variant='outlined'>Share Input & Actions</Button>
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
                    <Typography style={{fontFamily:'"JetBrains Mono",monospace',fontSize:'10pt',wordWrap:'break-word'}}>
                      {typeof output.failedAction.error === 'string' && output.failedAction.error+"" }
                      {typeof output.failedAction.error === 'object' && <span>
                        {output.failedAction.error.message}
                        <br />
                        {output.failedAction.error.stack}
                      </span>}
                      {/*  {JSON.stringify(err, Object.getOwnPropertyNames(err), 2)}  */}
                    </Typography>
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
      <Snackbar
          open={shareTipOpen}
          autoHideDuration={2000}
          onClose={shareTipClose}>
        <Alert severity="success">
          Shareable link copied!
        </Alert>
      </Snackbar>
      <Dialog
          open={showDetails}
          onClose={closeDetails}>
        <DialogTitle>
          {"What is Metamorph?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{padding:'5pt',marginBottom:'10pt'}}>
            Metamorph is a client-side-only application that allows you to define a set of repeatable data
            transformations. The actions you configure are maintained in the URL allowing you to bookmark your creations
            for later use.
          </DialogContentText>
          <DialogContentText sx={{padding:'5pt',marginBottom:'10pt'}}>
            Metamorph can be used to simply format JSON, decode Base64, or do a regex search-and-replace. Or, chain the
            available actions together into a single complex transformation. You can even query datastructures using
            JQ, or decompress GZIP data blobs.
          </DialogContentText>
          <DialogContentText sx={{padding:'5pt',marginBottom:'10pt'}}>
            This tool was built out of love (and frustration) when dealing with highly nested, encoded, compressed data.
            Especially when debugging issues. If theres a feature you would like to see added (or if you have a
            complaint), please share them with me over on <a href={"https://github.com/fisherevans/metamorph/issues/new"} style={{color:theme.palette.primary.light}}>Github</a>! :)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails} variant={"contained"}>
            Cool - Let me try it!
          </Button>
        </DialogActions>
      </Dialog>
      <Typography align={"center"} fontStyle={"italic"} sx={{color:theme.palette.text.secondary,padding:"20pt"}}>Made by <a href={"https://fisherevans.com/"}>Fisher Evans</a>. Find the source code <a href={"https://github.com/fisherevans/metamorph"}>on Github</a>.</Typography>
    </Box>
  );
}

export default Metamorph;
