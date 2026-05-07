interface Props {
  items: string[];
  title?: string;
}

export default function BulletList({ items, title }: Props) {
  if (items.length === 0) return null;
  return (
    <div>
      {title && (
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fm-clay-deep)]">
          {title}
        </h4>
      )}
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-[var(--fm-muted)]">
            &bull; {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
