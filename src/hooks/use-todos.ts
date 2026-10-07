"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Todo = { id: string; text: string; done: boolean };

const STORAGE_KEY = "electron-next-template.todos";
const EMPTY_TODOS: Todo[] = [];

const isTodo = (value: unknown): value is Todo => {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const candidate = value as Record<string, unknown>;
	return typeof candidate.id === "string" && typeof candidate.text === "string" && typeof candidate.done === "boolean";
};

const parseTodos = (raw: string): Todo[] => {
	try {
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter(isTodo) : EMPTY_TODOS;
	} catch {
		return EMPTY_TODOS;
	}
};

let snapshot: Todo[] = EMPTY_TODOS;
let snapshotRaw: string | null = null;
const listeners = new Set<() => void>();

const getSnapshot = (): Todo[] => {
	const raw = window.localStorage.getItem(STORAGE_KEY) ?? "[]";
	if (raw !== snapshotRaw) {
		snapshotRaw = raw;
		snapshot = parseTodos(raw);
	}
	return snapshot;
};

const getServerSnapshot = (): Todo[] => EMPTY_TODOS;

const notify = () => {
	for (const listener of listeners) {
		listener();
	}
};

const writeTodos = (todos: Todo[]) => {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	} catch {
		return;
	}
	notify();
};

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	window.addEventListener("storage", listener);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", listener);
	};
};

export const useTodos = () => {
	const todos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	const addTodo = useCallback((text: string) => {
		const value = text.trim();
		if (!value) {
			return;
		}
		writeTodos([{ id: crypto.randomUUID(), text: value, done: false }, ...getSnapshot()]);
	}, []);

	const toggleTodo = useCallback((id: string) => {
		writeTodos(getSnapshot().map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
	}, []);

	const removeTodo = useCallback((id: string) => {
		writeTodos(getSnapshot().filter(todo => todo.id !== id));
	}, []);

	const clearCompleted = useCallback(() => {
		writeTodos(getSnapshot().filter(todo => !todo.done));
	}, []);

	return { todos, addTodo, toggleTodo, removeTodo, clearCompleted };
};
