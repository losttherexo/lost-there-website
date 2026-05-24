export default function Placeholder({ label, className = '', as: Tag = 'div', children, minHeight }) {
  return (
    <Tag
      className={`border-2 border-dashed border-neutral-700 bg-neutral-900/40 rounded p-6 ${className}`}
      style={minHeight ? { minHeight } : undefined}
      aria-label={typeof label === 'string' ? label : undefined}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500">
        {label}
      </p>
      {children ? <div className="mt-3 text-neutral-400">{children}</div> : null}
    </Tag>
  )
}
