interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-sm font-medium flex-shrink-0">
          Error
        </span>
        <p className="text-sm text-red-700 dark:text-red-300 flex-1">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-medium text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 underline flex-shrink-0"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
