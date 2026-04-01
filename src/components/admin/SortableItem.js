'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export function SortableItem({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className="relative flex animate-in slide-in-from-bottom-2 fade-in">
            <div 
                {...attributes} 
                {...listeners}
                className="w-10 bg-gray-900 border border-r-0 border-gray-800 rounded-l-2xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-800 transition-colors"
                style={{
                  borderRight: "transparent"
                }}
            >
                <GripVertical className="text-gray-500 w-5 h-5" />
            </div>
            
            <div className="flex-1 w-full min-w-0">
                {children}
            </div>
        </div>
    )
}
