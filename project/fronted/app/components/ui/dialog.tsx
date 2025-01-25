import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import MyButton from './button'

export default function MyDialog({text,children}: {text: string,children: React.ReactNode}) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <div className='flex flex-row justify-center items-center' onClick={() => setIsOpen(true)} >
      <MyButton text={text}/>
    </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="max-w-lg h-90 space-y-4">
            {/* <DialogTitle className="font-bold">Deactivate account</DialogTitle> */}
            {children}
            {/* <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={() => setIsOpen(false)}>Deactivate</button>
            </div> */}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}