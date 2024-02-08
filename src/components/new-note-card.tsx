import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

export function NewNoteCard({onNoteCreated} : NewNoteCardProps){
  const [shouldShowTextArea, setShouldShowTextArea] = useState(false);
  const [content, setContent] = useState('');

  function handleNewNote(){
    setShouldShowTextArea(true);
  }
  function handleSaveNewNote(evt:FormEvent){
    evt.preventDefault();
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
          <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
              <X className="size-5"/>
            </Dialog.Close>
              <form onSubmit={handleSaveNewNote} className="flex flex-1 flex-col">
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
                  <button className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em aúdio ou se preferir <button onClick={handleNewNote} className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>.
                </p>)
              }
                </div>
                <button 
                type="submit"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 "
                >
                  Salvar nota
                </button>
                </form>
            
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
}