import { Button } from '@headlessui/react'

export default function MyButton({text}: {text: string}) {
  return (
    <Button className="w-full h-full rounded bg-nav py-2 px-4 text-sm text-white hover:-translate-y-2">
      {text}
    </Button>
  )
}