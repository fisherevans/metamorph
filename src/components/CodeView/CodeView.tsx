import React from 'react';

import './CodeView.css';
import {Stack, TextareaAutosize, Typography} from '@mui/material';
import Box from "@mui/material/Box";

interface CodeViewProps {
  text: string;
  setText?: (t:string) => void;
}

function CodeView(props: CodeViewProps) {
  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (props.setText === undefined) {
      return;
    }
    props.setText(e.currentTarget.value);
  };
  const lines = props.text.split(/\r\n|\r|\n/).length
  let lineNumbers = ""
  for(let line = 1;line <= lines;line++) {
    if(line > 1) {
      lineNumbers += "\n"
    }
    lineNumbers += line + ""
  }
  return (
      <Box sx={{padding:'2pt'}}>
        <Stack direction={'row'}>
          <Box style={{padding:'3pt 0',paddingRight:'4pt',opacity:'0.6',fontFamily:'"JetBrains Mono",monospace',userSelect:'none',whiteSpace:'pre',lineHeight:'14pt',fontSize:'10pt'}}>
            {lineNumbers}
          </Box>
          <TextareaAutosize
            placeholder={props.setText === undefined ? 'Processed text...' : 'Text input...'}
            readOnly={props.setText === undefined}
            onChange={handleChange}
            value={props.text}
            style={{resize:'none',width:'100%',padding:'1pt 4pt',overflowX:'auto',boxSizing:'border-box',fontFamily:'"JetBrains Mono",monospace',lineHeight:'14pt',fontSize:'10pt',whiteSpace:'pre'}}
            minRows={10}
            spellCheck={false}
          />
        </Stack>
        <Typography sx={{fontStyle:'italic',fontSize:'10pt',textAlign:'right',paddingRight:'8pt'}}>
          {props.text.length} character{props.text.length != 1 ? "s" : ""}, {lines} line{lines != 1 ? "s" : ""}
        </Typography>
      </Box>
  );
}

export default CodeView;
