const days = [
  { date: '2021-12-27', events: [] },
  { date: '2021-12-28', events: [] },
  { date: '2021-12-29', events: [] },
  { date: '2021-12-30', events: [] },
  { date: '2021-12-31', events: [] },
  { date: '2022-01-01', isCurrentMonth: true, events: [] },
  { date: '2022-01-02', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-03',
    isCurrentMonth: true,
    events: [
      { id: 1, name: 'Design review', time: '10AM', datetime: '2022-01-03T10:00', href: '#' },
      { id: 2, name: 'Sales meeting', time: '2PM', datetime: '2022-01-03T14:00', href: '#' },
    ],
  },
  { date: '2022-01-04', isCurrentMonth: true, events: [] },
  { date: '2022-01-05', isCurrentMonth: true, events: [] },
  { date: '2022-01-06', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-07',
    isCurrentMonth: true,
    events: [{ id: 3, name: 'Date night', time: '6PM', datetime: '2022-01-08T18:00', href: '#' }],
  },
  { date: '2022-01-08', isCurrentMonth: true, events: [] },
  { date: '2022-01-09', isCurrentMonth: true, events: [] },
  { date: '2022-01-10', isCurrentMonth: true, events: [] },
  { date: '2022-01-11', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-12',
    isCurrentMonth: true,
    isToday: true,
    events: [{ id: 6, name: "Sam's birthday party", time: '2PM', datetime: '2022-01-25T14:00', href: '#' }],
  },
  { date: '2022-01-13', isCurrentMonth: true, events: [] },
  { date: '2022-01-14', isCurrentMonth: true, events: [] },
  { date: '2022-01-15', isCurrentMonth: true, events: [] },
  { date: '2022-01-16', isCurrentMonth: true, events: [] },
  { date: '2022-01-17', isCurrentMonth: true, events: [] },
  { date: '2022-01-18', isCurrentMonth: true, events: [] },
  { date: '2022-01-19', isCurrentMonth: true, events: [] },
  { date: '2022-01-20', isCurrentMonth: true, events: [] },
  { date: '2022-01-21', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-22',
    isCurrentMonth: true,
    isSelected: true,
    events: [
      { id: 4, name: 'Maple syrup museum', time: '3PM', datetime: '2022-01-22T15:00', href: '#' },
      { id: 5, name: 'Hockey game', time: '7PM', datetime: '2022-01-22T19:00', href: '#' },
    ],
  },
  { date: '2022-01-23', isCurrentMonth: true, events: [] },
  { date: '2022-01-24', isCurrentMonth: true, events: [] },
  { date: '2022-01-25', isCurrentMonth: true, events: [] },
  { date: '2022-01-26', isCurrentMonth: true, events: [] },
  { date: '2022-01-27', isCurrentMonth: true, events: [] },
  { date: '2022-01-28', isCurrentMonth: true, events: [] },
  { date: '2022-01-29', isCurrentMonth: true, events: [] },
  { date: '2022-01-30', isCurrentMonth: true, events: [] },
  { date: '2022-01-31', isCurrentMonth: true, events: [] },
  { date: '2022-02-01', events: [] },
  { date: '2022-02-02', events: [] },
  { date: '2022-02-03', events: [] },
  {
    date: '2022-02-04',
    events: [{ id: 7, name: 'Cinema with friends', time: '9PM', datetime: '2022-02-04T21:00', href: '#' }],
  },
  { date: '2022-02-05', events: [] },
  { date: '2022-02-06', events: [] },
]
const selectedDay = days.find((day) => day.isSelected)

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Calander() {
  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">

        <div className="lg:flex lg:h-full lg:flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
          </header>
          <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
            <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
              <div className="bg-white py-2">
                M<span className="sr-only sm:not-sr-only">on</span>
              </div>
              <div className="bg-white py-2">
                T<span className="sr-only sm:not-sr-only">ue</span>
              </div>
              <div className="bg-white py-2">
                W<span className="sr-only sm:not-sr-only">ed</span>
              </div>
              <div className="bg-white py-2">
                T<span className="sr-only sm:not-sr-only">hu</span>
              </div>
              <div className="bg-white py-2">
                F<span className="sr-only sm:not-sr-only">ri</span>
              </div>
              <div className="bg-white py-2">
                S<span className="sr-only sm:not-sr-only">at</span>
              </div>
              <div className="bg-white py-2">
                S<span className="sr-only sm:not-sr-only">un</span>
              </div>
            </div>
            <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
              <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
                {days.map((day) => (
                  <div
                    key={day.date}
                    className={classNames(
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                      'relative px-3 py-2','min-h-20',
                    )}
                  >
                    <a href="/products">
                    <time
                      dateTime={day.date}
                      className={
                        day.isToday
                          ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'
                          : undefined
                      }
                    >
                      {day.date}
                    </time>
                    </a>
                  </div>
                ))}
              </div>
              <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
                {days.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    className={classNames(
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                      (day.isSelected || day.isToday) && 'font-semibold',
                      day.isSelected && 'text-white',
                      !day.isSelected && day.isToday && 'text-indigo-600',
                      !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                      !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-500',
                      'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
                    )}
                  >
                   <a href="/products">
                    <time
                      dateTime={day.date}
                      className={classNames(
                        day.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full',
                        day.isSelected && day.isToday && 'bg-indigo-600',
                        day.isSelected && !day.isToday && 'bg-gray-900',
                        'ml-auto',
                      )}
                    >
                      {day.date}
                    </time>
                    </a>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}