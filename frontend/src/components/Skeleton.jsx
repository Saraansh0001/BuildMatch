// src/components/Skeleton.jsx
export default function Skeleton({ count = 3 }) {
  return (
    <div className="space-y-3 animate-pulse py-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg bg-[var(--color-border)]"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}
