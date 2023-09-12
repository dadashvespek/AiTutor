import React, { useRef, useState, useEffect, useContext } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, Box } from '@mui/material';
import { Mic, Stop, ExpandMore } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import LoadingSpinner from './LoadingSpinner';
import './VoiceRecorder.css';
import interviewTipsByLanguage from './Interviewtips';
import ChatContext from '../utils/ChatContext';
const AccordionElement = ({ url, label, audioEls, id, isServerResponding, transcription }) => {
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
        {
          isServerResponding ?
            <CircularProgress /> :
            <>
              <audio ref={el => audioEls.current[id] = el} src={url} controls autoPlay={label === 'Interviewer'} />
              <Typography variant="body2" className="transcription-text">{transcription}</Typography>
            </>
        }
      </AccordionDetails>
    </Accordion>
  ) 
};



function InterviewBanner({ isServerResponding, language }) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const interviewTips = interviewTipsByLanguage[language] || [];
  
  useEffect(() => {
    if (isServerResponding) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * interviewTips.length);
        setCurrentTipIndex(randomIndex);
      }, 12000);

      return () => clearInterval(interval);
    }
  }, [isServerResponding, interviewTips.length]);

  if (!isServerResponding || interviewTips.length === 0) return null;

  return (
    <div className={`banner fade-in scrolling-banner`}>
      <span className="tip-title">{interviewTips[currentTipIndex]}</span>
    </div>
  );
}
const playCheckCodeAudio = () => {
  const audio = new Audio('/checkcode.mp3');
  
  audio.oncanplaythrough = () => {
    audio.play().catch(e => {
      console.error("Error playing audio:", e);
    });
  };

  audio.onerror = (error) => {
    console.error("Error loading the audio file:", error);
  };
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
  const { messages, setMessages } = useContext(ChatContext);
  const [originalAudioURLs, setOriginalAudioURLs] = useState([]);
  const [serverAudioURLs, setServerAudioURLs] = useState([]);
  const [originalTranscriptions, setOriginalTranscriptions] = useState([]);
  const [serverTranscriptions, setServerTranscriptions] = useState([]);
  const [isServerResponding, setIsServerResponding] = useState(false);
  const audioEls = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  const lastAccordionRef = useRef(null);
  const hasCalledAPI = useRef(false);  // <-- Introduced ref here
  const userName = session.user.identities[0].identity_data.name;

  const sendCodetoServer = async (code) => {
    playCheckCodeAudio();
      const formData = new FormData();
    const emptyBlob = new Blob([''], { type: 'audio/webm' });
    formData.append('audio', emptyBlob);
    formData.append('type', chatSession.type);
    formData.append('difficulty', chatSession.difficulty);
    formData.append('language', chatSession.language.value);
    console.log(`language: ${chatSession.language.value}`)
    formData.append('userName', userName);
    formData.append('code', code);

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}audio`, {
      method: "POST",
      body: formData
    });
    console.log("response:", response)
    const responseData = await response.json();

    const audioResponse = new Blob([new Uint8Array(responseData.audioBuffer.data)], { type: 'audio/mp3' });
    const responseURL = URL.createObjectURL(audioResponse);
    
    setServerAudioURLs(prevURLs => [...prevURLs, responseURL]);
    setOriginalTranscriptions(prevTrans => [...prevTrans, responseData.transcription]);  // Assuming responseData has the original transcription.
    setServerTranscriptions(prevTrans => [...prevTrans, responseData.aiResponse]);  // Assuming responseData has the AI response as transcription. 

  }


  useEffect(() => {
    if (messages.length > 0) {
    sendCodetoServer(messages[messages.length - 1]);}
    console.log("messages", messages);
  }
  , [messages]);

  const sendEmptyAudioFileToServer = async () => {
    const formData = new FormData();
    const emptyBlob = new Blob([''], { type: 'audio/webm' });
    formData.append('audio', emptyBlob);
    formData.append('type', chatSession.type);
    formData.append('difficulty', chatSession.difficulty);
    formData.append('language', chatSession.language.value);
    console.log(`language: ${chatSession.language.value}`)
    formData.append('userName', userName);

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}audio`, {
      method: "POST",
      body: formData
    });
    const responseData = await response.json();

    const audioResponse = new Blob([new Uint8Array(responseData.audioBuffer.data)], { type: 'audio/mp3' });
    const responseURL = URL.createObjectURL(audioResponse);
    
    setServerAudioURLs(prevURLs => [...prevURLs, responseURL]);
    setOriginalTranscriptions(prevTrans => [...prevTrans, responseData.transcription]);  // Assuming responseData has the original transcription.
    setServerTranscriptions(prevTrans => [...prevTrans, responseData.aiResponse]);  // Assuming responseData has the AI response as transcription.    
  };

  useEffect(() => {
    if (!hasCalledAPI.current) {
      sendEmptyAudioFileToServer();
      hasCalledAPI.current = true; 
    }
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
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}audio`, {
        method: "POST",
        body: formData
      });

      const responseData = await response.json();

      const audioResponse = new Blob([new Uint8Array(responseData.audioBuffer.data)], { type: 'audio/mp3' });
      const responseURL = URL.createObjectURL(audioResponse);
      
      setServerAudioURLs(prevURLs => [...prevURLs, responseURL]);
      setOriginalTranscriptions(prevTrans => [...prevTrans, responseData.transcription]);  // Assuming responseData has the original transcription.
      setServerTranscriptions(prevTrans => [...prevTrans, responseData.aiResponse]);
      
      // Display the transcribed text and AI response text somewhere in your UI
      console.log("Transcribed Audio:", responseData.transcription);
      console.log("OpenAI Response:", responseData.aiResponse);
    };

    setMediaRecorder(newMediaRecorder);
    setRecording(true);
    
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setIsServerResponding(true);
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
    <Box className="voice-recorder w-1/2 h-[80vh] py-4 mt-4" display="flex" flexDirection="column" alignItems={'center'}>
      <Box flexGrow={1} className="accordion-window w-[40vw]">
      {originalAudioURLs.map((url, index) => (
  <Box 
    key={index} 
    className="accordion-container original"
    ref={index === originalAudioURLs.length - 1 ? lastAccordionRef : null}  
  >
    <AccordionElement url={url} label='Original Recording' audioEls={audioEls} id={`original-${index}`} transcription={originalTranscriptions[index]} />
  </Box>
))}

{serverAudioURLs.map((url, index) => (
  <Box 
    key={index} 
    className="accordion-container server"
  >
    <AccordionElement url={url} label='Interviewer' audioEls={audioEls} id={`server-${index}`} transcription={serverTranscriptions[index]} />
  </Box>
))}
      </Box>

      {isServerResponding && <LoadingSpinner />}

      <Box className="recording-control">
        <RecordingButton recording={recording} handleStopRecording={handleStopRecording} handleStartRecording={handleStartRecording} isServerResponding={isServerResponding} />
        <Typography variant="subtitle1" paddingLeft="1rem">
          {recording ? "Click to stop recording" : "Click Mic to start recording"}
        </Typography>
      </Box>
      <InterviewBanner isServerResponding={isServerResponding} language={chatSession.language.value} />
    </Box>
);

;
}