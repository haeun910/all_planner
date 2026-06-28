import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SortableTodoItem from './SortableTodoItem';
import { useApp } from '../context/AppContext';
import type { Todo } from '../types';

interface Props {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  getActions?: (todo: Todo) => React.ReactNode;
}

export default function TodoList({ todos, onEdit, getActions }: Props) {
  const { reorderTodos } = useApp();
  const [localOrder, setLocalOrder] = useState<string[]>([]);

  const orderedTodos = localOrder.length
    ? localOrder.map(id => todos.find(t => t.id === id)!).filter(Boolean)
    : todos;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = orderedTodos.map(t => t.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    const newIds = arrayMove(ids, oldIndex, newIndex);
    setLocalOrder(newIds);
    reorderTodos(newIds);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={orderedTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {orderedTodos.map(todo => (
          <SortableTodoItem key={todo.id} todo={todo} onEdit={onEdit} actions={getActions?.(todo)} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
