export default function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a href="/">
        <span className="sr-only">Your Company</span>
        <img
          alt=""
          src="morhaat.png?color=indigo&shade=600"
          className="h-12 w-auto"
        />
      </a>
    </div>
  )
}
