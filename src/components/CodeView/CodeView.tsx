import React from 'react';

import {Stack, TextareaAutosize, Typography} from '@mui/material';
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface CodeViewProps {
  text: string;
  setText?: (t:string) => void;
}

function CodeView(props: CodeViewProps) {
  const theme = useTheme();
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
          <Box style={{
              color:theme.palette.text.secondary,
              backgroundColor: theme.palette.divider,
              padding:'1pt 4pt',
              borderColor: theme.palette.grey["600"],
              borderStyle: 'solid',
              borderWidth: '1px 0px 1px 1px',
              borderRadius: '3pt 0pt 0pt 3pt',
              opacity:'0.6',
              fontFamily:'"JetBrains Mono",monospace',
              userSelect:'none',
              whiteSpace:'pre',
              lineHeight:'14pt',
              fontSize:'10pt'
          }}>
            {lineNumbers}
          </Box>
          <TextareaAutosize
            placeholder={props.setText === undefined ? 'Processed text...' : 'Text input...'}
            readOnly={props.setText === undefined}
            onChange={handleChange}
            value={props.text}
            style={{
              backgroundColor: theme.palette.divider,
              color: theme.palette.text.primary,
              resize:'none',
              width:'100%',
              padding:'1pt 4pt',
              overflowX:'auto',
              boxSizing:'border-box',
              borderRadius: '0pt 3pt 3pt 0pt',
              fontFamily:'"JetBrains Mono",monospace',
              lineHeight:'14pt',
              fontSize:'10pt',
              whiteSpace:'pre'
            }}
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
