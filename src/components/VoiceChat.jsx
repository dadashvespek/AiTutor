import React, { useRef, useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, Box } from '@mui/material';
import { Mic, Stop, ExpandMore } from '@mui/icons-material';
import './VoiceRecorder.css';

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [originalAudioURLs, setOriginalAudioURLs] = useState([]);
  const [serverAudioURLs, setServerAudioURLs] = useState([]);
  const [isServerResponding, setIsServerResponding] = useState(false);
  const audioEls = useRef([]);
  const lastAccordionRef = useRef(null);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
    

    newMediaRecorder.start();

    newMediaRecorder.ondataavailable = async (e) => {
      const url = URL.createObjectURL(e.data);
      setOriginalAudioURLs(prevURLs => [...prevURLs, url]);

      const formData = new FormData();
      formData.append('audio', e.data);

      const response = await fetch("http://localhost:5000/audio", {
        method: "POST",
        body: formData
      });

      const audioResponse = await response.blob();
      const responseURL = URL.createObjectURL(audioResponse);
      setServerAudioURLs(prevURLs => [...prevURLs, responseURL]);
    };

    setMediaRecorder(newMediaRecorder);
    setRecording(true);
    
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      // setIsServerResponding(true);
    }
  };

  const handlePlayRecording = index => () => {
    if (audioEls.current[index]) {
      audioEls.current[index].play();
    }
  };

  useEffect(() => {
    if (serverAudioURLs.length > 0) {
      handlePlayRecording((serverAudioURLs.length - 1) * 2 + 1)();
      setIsServerResponding(false);
    }
  }, [serverAudioURLs]);
  useEffect(() => {
    if (lastAccordionRef.current) {
      lastAccordionRef.current.scrollIntoView({ behavior: 'smooth' });  
    }
  }, [originalAudioURLs, serverAudioURLs]);
  return (
    <Box className="voice-recorder" display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} className="accordion-window">
        {originalAudioURLs.map((url, index) => (
          <Box 
            key={index} 
            className="accordion-container"
            ref={index === originalAudioURLs.length - 1 ? lastAccordionRef : null}  // New: assign the ref to the last accordion
          >
            <Accordion className="MuiAccordion-root">
              <AccordionSummary className="MuiAccordionSummary-root" expandIcon={<ExpandMore />}>
                <Typography>{`Original Recording ${index + 1}`}</Typography>
              </AccordionSummary>
              <AccordionDetails className="MuiAccordionDetails-root">
                <audio ref={el => audioEls.current[index * 2] = el} src={url} controls />
              </AccordionDetails>
            </Accordion>
            
            {serverAudioURLs[index] && (
              <Accordion className="MuiAccordion-root">
                <AccordionSummary className="MuiAccordionSummary-root" expandIcon={<ExpandMore />}>
                  <Typography>{`Server Response ${index + 1}`}</Typography>
                </AccordionSummary>
                <AccordionDetails className="MuiAccordionDetails-root">
                  <audio ref={el => audioEls.current[index * 2 + 1] = el} src={serverAudioURLs[index]} controls />
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        ))}
      </Box>

      <Box className="recording-control">
        <IconButton className={recording ? "mic-icon-recording" : "mic-icon"} color="primary" aria-label="record" disabled={isServerResponding} onClick={recording ? handleStopRecording : handleStartRecording}>
          {recording ? <Stop fontSize="large" /> : <Mic fontSize="large" />}
        </IconButton>
        <Typography variant="subtitle1" paddingLeft="1rem">
          {recording ? "Recording..." : "Click Mic to start recording"}
        </Typography>
      </Box>
    </Box>
  );
}