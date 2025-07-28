import React, { useState } from 'react';
import './CardHand.css';
import { Card, CardProps } from '../Card';
// Import dnd-kit core functionality for drag-and-drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
// Import sortable functionality for reordering
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
// Import useSortable hook for individual sortable items
import {
  useSortable,
} from '@dnd-kit/sortable';
// Import CSS utilities for transform handling
import { CSS } from '@dnd-kit/utilities';

interface HandProps {
    Cards: CardProps[];
    deckType: string;
    faceUp: boolean;
    onCardClick?: (value: string) => void;
    selectedCardValue?: string | null;
    onReorder?: (newCards: CardProps[]) => void; // Callback for when cards are reordered
}

/**
 * Individual sortable card component that can be dragged and reordered
 * This component wraps each card with drag-and-drop functionality
 */
function SortableCardItem({ 
  card, 
  index, 
  deckType, 
  faceUp, 
  onCardClick, 
  selectedCardValue 
}: {
  card: CardProps;
  index: number;
  deckType: string;
  faceUp: boolean;
  onCardClick?: (value: string) => void;
  selectedCardValue?: string | null;
}) {
  // useSortable hook provides all the drag-and-drop functionality for this item
  const {
    attributes,        // HTML attributes needed for accessibility
    listeners,         // Event listeners for drag interactions
    setNodeRef,        // Ref to attach to the DOM element
    transform,         // Transform values for positioning during drag
    transition,        // CSS transition values
    isDragging,        // Boolean indicating if this item is being dragged
  } = useSortable({ id: card.value }); // Each card is identified by its value

  // Apply styles including transform for drag positioning and overlap
  const style = {
    transform: CSS.Transform.toString(transform), // Convert transform to CSS string
    transition, // Apply smooth transitions
    marginLeft: index === 0 ? "0px" : "-60px", // Overlap cards except first
    zIndex: isDragging ? 1000 : index, // Dragged cards appear on top
    opacity: isDragging ? 0 : 1, // Make original card invisible when dragging
  };

  return (
    <div
      ref={setNodeRef} // Attach the ref for drag-and-drop functionality
      style={style}
      {...attributes} // Spread accessibility attributes
      {...listeners} // Spread drag event listeners
      className="card-item"
    >
      <Card 
        {...card} 
        deckType={deckType} 
        faceUp={faceUp}
        onCardClick={onCardClick}
        isSelected={selectedCardValue === card.value}
      />
    </div>
  );
}

/**
 * Custom drag overlay component that follows the cursor
 * This creates a visible overlay that moves with the mouse during drag
 */
function DragOverlayCard({ 
  card, 
  deckType, 
  faceUp, 
  selectedCardValue 
}: {
  card: CardProps;
  deckType: string;
  faceUp: boolean;
  selectedCardValue?: string | null;
}) {
  return (
    <div 
      className="card-item" 
      style={{ 
        zIndex: 1001, // Highest z-index for overlay
        opacity: 1, // Make overlay visible
        //transform: 'rotate(5deg)', // Slight rotation to distinguish from original
        //boxShadow: '0 10px 20px rgba(0,0,0,0.3)', // Add shadow for depth
        cursor: 'grabbing', // Show grabbing cursor
        transform: 'translateY(-3rem)', // Match the hover offset from Card.css
      }}
    >
      <Card 
        {...card} 
        deckType={deckType} 
        faceUp={faceUp}
        isSelected={selectedCardValue === card.value}
      />
    </div>
  );
}

/**
 * Main CardHand component with drag-and-drop functionality
 * Uses dnd-kit to enable smooth reordering of overlapping cards
 */
function CardHand({ Cards, deckType, faceUp, onCardClick, selectedCardValue, onReorder }: HandProps) {
  // Track which card is currently being dragged
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Configure sensors for different input methods (mouse, keyboard, touch)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200, // 200ms delay before drag starts
        tolerance: 5, // 5px movement tolerance
      },
    }), // Handles mouse and touch interactions
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, // Keyboard navigation
    })
  );

  /**
   * Handle drag start - track which card is being dragged
   */
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  /**
   * Handle drag end - reorder cards and call callback
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null); // Clear active card

    // Only reorder if the card was dropped on a different position
    if (active.id !== over?.id) {
      const oldIndex = Cards.findIndex(card => card.value === active.id);
      const newIndex = Cards.findIndex(card => card.value === over?.id);
      
      // Use dnd-kit's arrayMove utility to reorder the array
      const reordered = arrayMove(Cards, oldIndex, newIndex);
      if (onReorder) {
        onReorder(reordered); // Notify parent component of reorder
      }
    }
  };

  // Find the card that's currently being dragged for the overlay
  const activeCard = activeId ? Cards.find(card => card.value === activeId) : null;

  return (
    // DndContext provides the drag-and-drop context for all child components
    <DndContext
      sensors={sensors} // Configure input sensors
      collisionDetection={closestCenter} // How to detect drop targets
      onDragStart={handleDragStart} // Handle drag start
      onDragEnd={handleDragEnd} // Handle drag end
    >
      {/* Container for the sortable cards */}
      <div className="card-hand-container">
        {/* SortableContext manages the sortable items and their strategy */}
        <SortableContext 
          items={Cards.map(card => card.value)} // Array of item IDs
          strategy={horizontalListSortingStrategy} // Horizontal layout strategy
        >
          {/* Render each card as a sortable item */}
          {Cards.map((card, index) => (
            <SortableCardItem
              key={card.value}
              card={card}
              index={index}
              deckType={deckType}
              faceUp={faceUp}
              onCardClick={onCardClick}
              selectedCardValue={selectedCardValue}
            />
          ))}
        </SortableContext>
      </div>
      
      {/* DragOverlay renders the dragged item above everything else */}
      <DragOverlay>
        {activeCard ? (
          <DragOverlayCard
            card={activeCard}
            deckType={deckType}
            faceUp={faceUp}
            selectedCardValue={selectedCardValue}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default CardHand;