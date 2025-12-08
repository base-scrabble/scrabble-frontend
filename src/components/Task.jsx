
export default function Task({ id, label, link, onToggle, completed }) {
  return (
    <div className="task-item flex justify-between items-center p-3 bg-white bg-opacity-70 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-white/10 transition-all">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          className="accent-blue-600 w-5 h-5"
          aria-label={completed ? "Task completed" : "Mark as completed"}
        />
        <a href={link} target="_blank" rel="noreferrer" className="truncate mr-4 text-base font-medium hover:underline text-gray-800 dark:text-gray-200">{label}</a>
      </div>
      <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${completed ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"}`}>{completed ? "✓ Completed" : "Mark Completed"}</span>
    </div>
  );
}
