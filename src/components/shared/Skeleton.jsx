export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-800/60 ${className}`}
      {...props}
    />
  )
}
