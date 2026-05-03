interface Props {
  items: string[];
  title?: string;
}

export default function BulletList({ items, title }: Props) {
  if (items.length === 0) return null;
  return (
    <div>
      {title && (
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
          {title}
        </h4>
      )}
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300">
            &bull; {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
