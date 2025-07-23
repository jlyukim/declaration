import React from 'react';
import './CardHand.css';
import { Card, CardProps } from '../Card'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '../../StrictModeDroppable'

interface HandProps {
    Cards: CardProps[];
    deckType: string;
    faceUp: boolean;
    onCardClick?: (value: string) => void;
    selectedCardValue?: string | null;
    onReorder?: (newCards: CardProps[]) => void;
}

function CardHand({ Cards, deckType, faceUp, onCardClick, selectedCardValue, onReorder }: HandProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(Cards);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    if (onReorder) onReorder(reordered);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="hand" direction="horizontal">
        {(provided) => (
          <div className="card-hand-container" ref={provided.innerRef} {...provided.droppableProps}>
            {Cards.map((card, index) =>
              card.value !== 'cardback' ? (
                <Draggable key={card.value} draggableId={card.value} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="card-item"
                      style={{
                        marginLeft: index === 0 ? "0px" : (snapshot.isDragging ? "0px" : "-60px"),
                        zIndex: snapshot.isDragging ? 1000 : index,
                        transition: snapshot.isDragging ? "none" : "margin 0.2s",
                      }}
                    >
                      <Card 
                        {...card} 
                        deckType={deckType} 
                        faceUp={faceUp}
                        onCardClick={onCardClick}
                        isSelected={selectedCardValue === card.value}
                      />
                    </div>
                  )}
                </Draggable>
              ) : (
                <div
                  key={`cardback-${index}`}
                  className="card-item"
                  style={{
                    marginLeft: index === 0 ? "0px" : "-60px",
                    zIndex: index,
                  }}
                >
                  <Card
                    {...card}
                    deckType={deckType}
                    faceUp={faceUp}
                    onCardClick={onCardClick}
                    isSelected={selectedCardValue === card.value}
                  />
                </div>
              )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default CardHand;