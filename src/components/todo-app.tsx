"use client";

import { useEffect, useMemo, useState } from "react";
import { useTodos, type Todo } from "@/hooks/use-todos";
import type { AppInfo } from "@/types/electron";

type TodoItemProps = {
	todo: Todo;
	onToggle: (id: string) => void;
	onRemove: (id: string) => void;
};

const TodoItem = ({ todo, onToggle, onRemove }: TodoItemProps) => {
	return (
		<li className="group flex flex-col items-start gap-4 rounded-xl border border-transparent bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:bg-[#1a2133] dark:ring-white/5 dark:hover:border-white/10">
			<div className="flex flex-1 items-center gap-4 truncate">
				<label className="relative flex cursor-pointer items-center rounded-full p-1">
					<input
						type="checkbox"
						checked={todo.done}
						onChange={() => onToggle(todo.id)}
						aria-label={`Toggle "${todo.text}"`}
						className="peer checked:border-brand checked:bg-brand hover:border-brand/50 focus:ring-brand/20 dark:checked:border-brand pointer-events-none absolute h-6 w-6 appearance-none rounded-full border-2 border-slate-300 transition-all duration-200 outline-none focus:ring-4 dark:border-slate-600"
					/>
					<svg
						className="pointer-events-none z-10 h-6 w-6 scale-0 stroke-white p-1 opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
					</svg>
				</label>

				<span
					className={`truncate text-lg font-semibold transition-all duration-200 ${
						todo.done ? "text-slate-400 line-through dark:text-slate-600" : "text-slate-700 dark:text-slate-200"
					}`}
				>
					{todo.text}
				</span>
			</div>

			<button
				onClick={() => onRemove(todo.id)}
				aria-label={`Delete "${todo.text}"`}
				title="Delete Task"
				className="group/btn flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 focus:opacity-100 sm:opacity-100 dark:hover:bg-red-500/10 dark:hover:text-red-400"
			>
				<svg
					className="h-5 w-5 transition-transform duration-200 group-hover/btn:scale-110"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					></path>
				</svg>
			</button>
		</li>
	);
};

const TodoApp = () => {
	const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
	const [text, setText] = useState<string>("");
	const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
	const remaining = useMemo(() => todos.filter(todo => !todo.done).length, [todos]);

	useEffect(() => {
		window.electronAPI
			?.getAppInfo()
			.then(setAppInfo)
			.catch(() => setAppInfo(null));
	}, []);

	const addTodoFromInput = () => {
		if (!text.trim()) {
			return;
		}
		addTodo(text);
		setText("");
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			addTodoFromInput();
		}
	};

	return (
		<div className="selection:bg-brand/20 min-h-dvh bg-[#F3F4F6] text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
			<div className="mx-auto flex flex-col items-center justify-center p-6 sm:p-12">
				<div className="mb-10 text-center">
					<div className="bg-brand shadow-brand/30 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
						<svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2.5"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
							></path>
						</svg>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
						Tasks<span className="text-brand">.</span>
					</h1>
					<p className="mt-3 font-medium text-slate-500 dark:text-slate-400">Organize your day beautifully and efficiently.</p>
				</div>

				<div className="w-full max-w-2xl overflow-hidden rounded-[24px] bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 dark:bg-[#151b2b] dark:ring-white/5">
					<div className="flex flex-col items-stretch gap-3 border-b border-slate-100 bg-slate-50 p-6 sm:flex-row sm:items-center dark:border-white/5 dark:bg-[#1a2133]">
						<div className="relative flex-1">
							<input
								value={text}
								onChange={event => setText(event.target.value)}
								onKeyDown={onKeyDown}
								placeholder="What needs to be done?"
								aria-label="New task"
								className="focus:border-brand focus:ring-brand/10 dark:focus:border-brand dark:focus:ring-brand/20 w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-slate-700 transition-all duration-200 outline-none placeholder:text-slate-400 focus:ring-4 dark:border-white/10 dark:bg-[#0B0F19] dark:text-slate-200"
							/>
						</div>
						<button
							onClick={addTodoFromInput}
							disabled={!text.trim()}
							className="bg-brand shadow-brand/20 hover:bg-brand-dark hover:shadow-brand/30 flex items-center justify-center rounded-xl px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
						>
							Add
						</button>
					</div>

					<div className="p-4 sm:p-6">
						{todos.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="bg-brand/10 dark:bg-brand/20 mb-4 rounded-full p-4">
									<svg className="text-brand h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
									</svg>
								</div>
								<h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No tasks yet</h3>
								<p className="mt-1 font-medium text-slate-500">Add a task above to get started.</p>
							</div>
						) : (
							<ul className="space-y-3">
								{todos.map(todo => (
									<TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onRemove={removeTodo} />
								))}
							</ul>
						)}
					</div>

					{todos.length > 0 && (
						<div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4 px-6 dark:border-white/5 dark:bg-[#1a2133]">
							<span className="text-sm font-medium text-slate-500 dark:text-slate-400">
								<strong className="text-slate-800 dark:text-slate-200">{remaining}</strong> {remaining === 1 ? "task" : "tasks"}{" "}
								remaining
							</span>
							<button
								onClick={clearCompleted}
								className="hover:text-brand dark:hover:text-brand text-sm font-bold text-slate-500 transition-colors duration-200 dark:text-slate-400"
							>
								Clear completed
							</button>
						</div>
					)}
				</div>

				<div className="mt-8 space-y-1 text-center">
					<p className="text-sm font-semibold text-slate-400 dark:text-slate-600">Designed with ❤️ inspired by Freepik.</p>
					{appInfo && (
						<p className="text-xs font-medium text-slate-400 dark:text-slate-600">
							{appInfo.name} v{appInfo.version} · Electron {appInfo.electron} · Chromium {appInfo.chrome}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default TodoApp;
