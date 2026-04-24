import { writable } from "svelte/store";
import type { Tool } from "$lib/core/types";

/**
 * Рактивное хранилище для выбранного инструмента
*/
export const activeTool = writable<Tool>("move");

/**
 * Назначение активного инструмента
 * @param tool 
 */
export function setTool(tool: Tool) {
  activeTool.set(tool);
}
