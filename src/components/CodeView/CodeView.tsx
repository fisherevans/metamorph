import React, { Dispatch, SetStateAction } from 'react';

import './CodeView.css';
import { TextareaAutosize } from '@mui/material';

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

  return (
    <div>
      <TextareaAutosize
        placeholder={props.setText === undefined ? 'Processed text...' : 'Text input...'}
        readOnly={props.setText === undefined}
        onChange={handleChange}
        value={props.text}
        style={{resize:'none',width:'100%',boxSizing:'border-box'}}
        minRows={10}
      />
    </div>
  );
}

export default CodeView;
