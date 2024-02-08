import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated} : NewNoteCardProps){
  const [shouldShowTextArea, setShouldShowTextArea] = useState(false);
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false)

  function handleStartingRecording(){
    

    const isSpeechRecognitionAPIAvaliable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window
    
    if(!isSpeechRecognitionAPIAvaliable) {
      alert('Infelizmente seu navegador não suporta a API de Gravação')
      return
    }

    setIsRecording(true)
    setShouldShowTextArea(true)

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new speechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'

    speechRecognition.continuous = true

    speechRecognition.maxAlternatives = 1

    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      } ,'')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) =>{
      console.log(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording(){
    setIsRecording(false)
    if(speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  function handleNewNote(){
    setShouldShowTextArea(true);
  }

  function handleSaveNewNote(evt:FormEvent){
    evt.preventDefault();
    if(content === '') return
    console.log(content)
    onNoteCreated(content)
    toast.success('Nota criada com sucesso')
    setContent('')
    setShouldShowTextArea(false)
  }

  function handleContentChanged(evt:ChangeEvent<HTMLTextAreaElement>) {
    setContent(evt.target.value)
    if(evt.target.value === '') setShouldShowTextArea(false)
  }

    return (
      <Dialog.Root>
        <Dialog.Trigger className='rounded-md bg-slate-700 p-5 flex flex-col text-left gap-3 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
          <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
          <p className='text-sm leading-6 text-slate-400 '>Grave uma nota em aúdio que será convertida para texto automáticamente</p>
          <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'/>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
              <X className="size-5"/>
            </Dialog.Close>
              <form className="flex flex-1 flex-col">
                <div className="flex flex-1 flex-col p-3 gap-5">
                <span className='text-sm font-medium text-slate-200'>
                Adicionar nota
                </span>
                {shouldShowTextArea ? (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              ) : (
                <p className='text-sm leading-6 text-slate-400 '>
                  <button type="button" onClick={handleStartingRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em aúdio ou se preferir <button type="button" onClick={handleNewNote} className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
                </p>)
              }
                </div>

              {isRecording ? (
                <button 
                type="button"
                onClick={handleStopRecording}
                className="w-full bg-slate-900 flex items-center justify-center gap-2 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 "
                >
                  <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
                  Gravando! (clique para interromper)
                </button>
              ): (
                <button 
                type="button"
                onClick={handleSaveNewNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 "
                >
                  Salvar nota
                </button>
              )}


                
                </form>
            
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
}