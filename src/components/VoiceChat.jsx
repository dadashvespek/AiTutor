import React, { useRef, useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, Box } from '@mui/material';
import { Mic, Stop, ExpandMore } from '@mui/icons-material';
import './VoiceRecorder.css';
const AccordionElement = ({ url, label, audioEls, id }) => {
  return (
    <Accordion className={label === 'Original Recording' ? "accordion-root original" : "accordion-root server"}>
      <AccordionSummary 
        className="accordion-summary" 
        expandIcon={<ExpandMore />} 
        sx={{ minHeight: '15px', maxHeight: '30px'}}
      >
        <Typography className="typography" sx={{ fontSize: '0.8rem' }}>{`${label}`}</Typography>
      </AccordionSummary>
      <AccordionDetails className="accordion-details">
        <audio ref={el => audioEls.current[id] = el} src={url} controls autoPlay={label === 'Interviewer'} />
      </AccordionDetails>
    </Accordion>
  ) 
};


const RecordingButton = ({ recording, handleStopRecording, handleStartRecording, isServerResponding }) => {
  return (
    <IconButton className={recording ? "mic-icon-recording" : "mic-icon"} color="primary" aria-label="record" disabled={isServerResponding} onClick={recording ? handleStopRecording : handleStartRecording}>
      {recording ? <Stop fontSize="large" /> : <Mic fontSize="large" />}
    </IconButton>
  )
};
export default function VoiceRecorder({chatSession, session}) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [originalAudioURLs, setOriginalAudioURLs] = useState([]);
  const [serverAudioURLs, setServerAudioURLs] = useState([]);
  const [isServerResponding, setIsServerResponding] = useState(false);
  const audioEls = useRef([]);
  const lastAccordionRef = useRef(null);
  const userName = session.user.identities[0].identity_data.name;
  const sendEmptyAudioFileToServer = async () => {
    const formData = new FormData();
    const emptyBlob = new Blob([''], { type: 'audio/webm' });
    formData.append('audio', emptyBlob);
    formData.append('type', chatSession.type);
    formData.append('difficulty', chatSession.difficulty);
    formData.append('language', chatSession.language.value);
    formData.append('userName', userName);

    const response = await fetch("http://localhost:5000/audio", {
      method: "POST",
      body: formData
    });

    const audioResponse = await response.blob();
    const responseURL = URL.createObjectURL(audioResponse);
    setServerAudioURLs(prevURLs => [...prevURLs, responseURL]);
  };

  useEffect(() => {
    sendEmptyAudioFileToServer();
  }, []);
  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
    
    
    newMediaRecorder.start();

    newMediaRecorder.ondataavailable = async (e) => {
      const url = URL.createObjectURL(e.data);
      setOriginalAudioURLs(prevURLs => [...prevURLs, url]);
      const formData = new FormData();
      formData.append('audio', e.data);
      formData.append('type', chatSession.type);
      formData.append('difficulty', chatSession.difficulty);
      formData.append('language', chatSession.language.value);
      formData.append('userName', userName);
      
    
      console.log(formData);
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
      //setIsServerResponding(true);
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
  const originalAudioEls = useRef([]);
  const serverAudioEls = useRef([]);
  
  return (
    <Box className="voice-recorder" display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} className="accordion-window">
        {originalAudioURLs.map((url, index) => (
          <Box 
            key={index} 
            className="accordion-container original"
            ref={index === originalAudioURLs.length - 1 ? lastAccordionRef : null}  
          >
            <AccordionElement url={url} label='Original Recording' audioEls={audioEls} id={`original-${index}`} />
          </Box>
        ))}

        {serverAudioURLs.map((url, index) => (
          <Box 
            key={index} 
            className="accordion-container server"
          >
            <AccordionElement url={url} label='Interviewer' audioEls={audioEls} id={`server-${index}`} />
          </Box>
        ))}
      </Box>

      <Box className="recording-control">
        <RecordingButton recording={recording} handleStopRecording={handleStopRecording} handleStartRecording={handleStartRecording} isServerResponding={isServerResponding} />
        <Typography variant="subtitle1" paddingLeft="1rem">
          {recording ? "Recording..." : "Click Mic to start recording"}
        </Typography>
      </Box>
    </Box>
  );
}