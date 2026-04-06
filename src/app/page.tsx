"use client";

import { useEffect, useMemo, useState } from "react";

type Todo = { id: string; text: string; done: boolean };

const STORAGE_KEY = "todos";

export default function Home() {
	const [todos, setTodos] = useState<Todo[]>(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? (JSON.parse(raw) as Todo[]) : [];
		} catch {
			return [];
		}
	});
	const [text, setText] = useState("");
	const remaining = useMemo(
		() => todos.filter((t) => !t.done).length,
		[todos],
	);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		} catch {}
	}, [todos]);

	function addTodo() {
		const t = text.trim();
		if (!t) {
			return;
		}
		setTodos((prev) => [
			{ id: crypto.randomUUID(), text: t, done: false },
			...prev,
		]);
		setText("");
	}

	function toggle(id: string) {
		setTodos((prev) =>
			prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
		);
	}

	function remove(id: string) {
		setTodos((prev) => prev.filter((t) => t.id !== id));
	}

	function clearCompleted() {
		setTodos((prev) => prev.filter((t) => !t.done));
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			addTodo();
		}
	}

	return (
		<div className="bg-background text-foreground min-h-dvh p-6">
			<div className="mx-auto max-w-xl">
				<h1 className="mb-4 text-3xl font-bold">Todo</h1>
				<div className="mb-4 flex gap-2">
					<input
						value={ text }
						onChange={ (e) => setText(e.target.value) }
						onKeyDown={ onKeyDown }
						placeholder="Add a task..."
						className="flex-1 rounded border border-gray-300 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black/20"
					/>
					<button
						onClick={ addTodo }
						className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
						disabled={ !text.trim() }
					>
						Add
					</button>
				</div>

				<div className="mb-2 flex items-center justify-between text-sm opacity-80">
					<span>{ remaining } remaining</span>
					<button
						onClick={ clearCompleted }
						className="hover:underline"
					>
						Clear completed
					</button>
				</div>

				<ul className="space-y-2">
					{ todos.map((t) => (
						<li
							key={ t.id }
							className="flex items-center gap-3 rounded border border-gray-200 p-2 dark:border-white/15"
						>
							<input
								type="checkbox"
								checked={ t.done }
								onChange={ () => toggle(t.id) }
								className="size-4"
							/>
							<span
								className={ `flex-1 ${t.done ? "line-through opacity-60" : ""}` }
							>
								{ t.text }
							</span>
							<button
								onClick={ () => remove(t.id) }
								className="text-red-600 hover:underline"
							>
								Delete
							</button>
						</li>
					)) }
				</ul>
			</div>
		</div>
	);
}
