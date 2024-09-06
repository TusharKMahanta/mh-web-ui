import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, RectangleGroupIcon } from '@heroicons/react/20/solid'
import CalanderA from './calanderA'

const solutions = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of where your traffic is coming from',
    href: '#',
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers with our engagement tool',
    href: '#',
  },
  { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', },
  {
    name: 'Integrations',
    description: "Connect with third-party tools that you're already using",
    href: '#',
  },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
  { name: 'View all products', href: '#', icon: RectangleGroupIcon },
]

export default function Slots() {
  return (
    <>
     <Popover className="relative isolate z-20 shadow">
      <div className="bg-white py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PopoverButton className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            Book a Slot
            <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
          </PopoverButton>
        </div>
      </div>

      <PopoverPanel
        transition
        className="absolute inset-x-0 top-0 -z-10 bg-white pt-16 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div>
          <CalanderA></CalanderA>
        </div>
      </PopoverPanel>
    </Popover>  
    </>
   
  )
}
