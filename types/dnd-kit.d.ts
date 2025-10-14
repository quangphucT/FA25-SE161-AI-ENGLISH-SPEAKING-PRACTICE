declare module "@dnd-kit/core" {
  import type { ComponentType, ReactNode } from "react";
  export type DragEndEvent = {
    active: { id: string | number };
    over: { id: string | number } | null;
  };
  export const DndContext: ComponentType<{
    children?: ReactNode;
    collisionDetection?: (...args: unknown[]) => unknown;
    onDragEnd?: (event: DragEndEvent) => void;
  }>;
  export const closestCenter: (...args: unknown[]) => unknown;
}
declare module "@dnd-kit/sortable" {
  import type { ComponentType, ReactNode } from "react";
  export const SortableContext: ComponentType<{
    children?: ReactNode;
    items: string[];
    strategy?: (...args: unknown[]) => unknown;
  }>;
  export const verticalListSortingStrategy: (...args: unknown[]) => unknown;
  export const arrayMove: <T>(array: T[], from: number, to: number) => T[];
}
