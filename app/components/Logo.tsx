export default function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a href="/">
        <span className="sr-only">Your Company</span>
        <img
          alt=""
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="h-8 w-auto"
        />
      </a>
    </div>
  )
}
