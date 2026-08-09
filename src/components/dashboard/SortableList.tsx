"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type DragHandle = {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
};

function SortableItemWrapper({
  id,
  children,
}: {
  id: string;
  children: (handle: DragHandle) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}

export default function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  renderItem: (item: T, handle: DragHandle) => React.ReactNode;
}) {
  const [order, setOrder] = useState(() => items.map((i) => i.id));
  const idsKey = items.map((i) => i.id).join(",");

  useEffect(() => {
    setOrder(items.map((i) => i.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const byId = new Map(items.map((i) => [i.id, i]));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(order, oldIndex, newIndex);
    setOrder(newOrder);
    onReorder(newOrder);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {order.map((id) => {
            const item = byId.get(id);
            if (!item) return null;
            return (
              <SortableItemWrapper key={id} id={id}>
                {(handle) => renderItem(item, handle)}
              </SortableItemWrapper>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
