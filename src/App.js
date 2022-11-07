import './App.css';
import 'semantic-ui-css/semantic.min.css'
import React, {useState, useEffect } from 'react'
import {
  Button,
  Container,
  Header,
  Image,
  Menu,
  Segment,
  Input ,
  Message
} from 'semantic-ui-react'
import useSound from 'use-sound';
import thumb from "./images/thumb.png"
import { wordList } from './data/wordlist.js'
import { useSpeechSynthesis } from 'react-speech-kit';
import hooray from "./sounds/hooray.wav"
import error from "./sounds/error.wav"

const App = () => {
  const [word,setWord] = useState('')
  const [cap,setCap] = useState(false)
  const [capLabel,setCapLabel] = useState()
  const [typed,setTyped] = useState('')
  const [disabled,setDisabled] = useState(false)
  const [correct,setCorrect] = useState('olive')
  //const [voiceIndex, setVoiceIndex] = useState(null)
  const [useVoice , setUseVoice] = useState(null)
  const { speak , voices } = useSpeechSynthesis()
  const voice = useVoice || null
  const [dutchVoices,setDutchVoices] = useState([])
  
  useEffect(() => {
    let useV = voices
    for(let i = 0 ; i < voices.length ; i++) {
      if(useV[i].lang.substring(0,2) !== 'nl') {
        useV.splice(i,1)
      }
    }
    if(useV.length > 0) { 
      setDutchVoices(useV)
      setUseVoice(useV[0])
    } else {
      setDutchVoices([])
    }
  },[voices,dutchVoices])

  const chooseWord = () => {
    setCorrect('olive')
    setTyped('')
    let max = wordList.length
    let rand = Math.floor(Math.random() * max); 
    let word = wordList[rand]
    speak({ text : word  , voice })
    setWord(word)
  }
  useEffect(() => {
    if(cap) {
      setCapLabel('abc')
      setWord(word.toUpperCase())
    }
    if(!cap) {
      setCapLabel('ABC')
      setWord(word.toLowerCase())
    }
  },[cap,word])

  const [playError] = useSound(error)
  const [playHooray] = useSound(hooray)

  const checkTyped = (typedInput) => {
    setDisabled(true)
    if(typedInput !== '') {  
      let typedCompare = typedInput.toLowerCase()
      let wordCompare = word.toLowerCase()
      let numTyped = typedCompare.length
      speak({ text : typedCompare.charAt(numTyped - 1) , voice })
      if(typedCompare.charAt(numTyped - 1) !== wordCompare.charAt(numTyped - 1)) {
        setTyped(typedCompare.slice(0,-1))
        setCorrect('red')
        setTimeout(() => {
          playError()
        },750)
        
      } else {
        setTyped(typedCompare)
        setCorrect('green')
      }
      if(typedCompare === wordCompare) {
        speak({ text : wordCompare , voice })
        setTimeout(() => { 
          playHooray()
          setTimeout(() => {
            chooseWord() 
          },5000)
        },2000)
      }
  }
  setDisabled(false)
  }

  const toggleCap = () => {
    if(cap) {
      setCap(false)
    }
    if(!cap) {
      setCap(true)
    }
  }
  return (
    <div className="App">
      <Menu fixed='top' inverted color='orange'>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src={thumb} style={{ marginRight: '1.5em' }} />
          JJs Typer
        </Menu.Item>
        <Menu.Item position='right'>
          <Button onClick={() => toggleCap()}>{capLabel}</Button>
        </Menu.Item>    
        <Menu.Item position='right'>About</Menu.Item>
      </Container>
    </Menu>


    <Container text style={{ marginTop: '7em' }}>
      <Header as='h1'>Typ alle letters uit het woord:</Header>
      { word === '' &&
        <Button onClick={() => chooseWord()} size='massive'>START</Button>
      }
      { dutchVoices.length === 0 &&
        <Message
          icon='warning sign'
          header='Geen Nederlands taalpakket in je browser geïnstalleerd.'
          content='We kunnen geen Nederlandse stem in je browser vinden. De woorden en letters kunnen dus een beetje gek klinken.'
        />
      }
      {word !== '' &&
        <div>
           <Segment size='massive' inverted color={correct}>
            {word}
          </Segment>
          <Input disabled={disabled} size='massive' value={typed} onChange={e => checkTyped(e.target.value)}/>
          </div>
      }     
    </Container>
    </div>
  );
}

export default App;
