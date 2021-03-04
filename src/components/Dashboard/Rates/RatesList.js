import React, {useState} from 'react'
import {Paper} from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RateModifierListItem from "./RatesCard";


const sortRatesByPriority = rateModifiers => {
    if(!Array.isArray(rateModifiers))
        return [];
    rateModifiers.sort((a,b)=>{
        if(a.priority>b.priority)
            return 1;
        if(a.priority<b.priority)
            return -1;
        return 0
    })
    return rateModifiers;
}

const shiftUp = (list, startIndex, endIndex) => {
    if(startIndex<endIndex)
        throw new Error(`StartIndex (${startIndex}) must be higher than EndIndex (${endIndex})`)
    for(let i=endIndex;i<startIndex;i++){
        let tmp = list[i].priority;
        list[i].priority=list[i + 1].priority
        list[i + 1].priority=tmp;
    }
}

const shiftDown = (list, startIndex, endIndex) => {
    if(startIndex>endIndex)
        throw new Error(`StartIndex (${startIndex}) must be lower than EndIndex (${endIndex})`)
    for(let i=endIndex;i>startIndex;i--){
        let tmp = list[i-1].priority;
        list[i-1].priority=list[i].priority
        list[i].priority=tmp;
    }
}

const reorderRateModifiersList = (rateModifiers, startIndex, endIndex) => {
    if(startIndex<endIndex) {
        shiftDown(rateModifiers,startIndex,endIndex)
    }
    else {
        shiftUp(rateModifiers,startIndex,endIndex)
    }
    sortRatesByPriority(rateModifiers)
    return rateModifiers;
}


export const RateModifiersList = ({rateModifiers, roomTypes, handlePropertyValueChange, handleEditRateModifier}) => {
    const [rates, setRates] = useState(sortRatesByPriority(rateModifiers));

    const onDragEnd = (result) =>{
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const newRates = reorderRateModifiersList(
            rates,
            result.source.index,
            result.destination.index
        );
        setRates(newRates)
    }


    //get room name based on its ID
    function getRoomNameById(roomTypeId){
        if(roomTypes){
            let room=roomTypes.find(({id})=>id === roomTypeId)
            if(room)
                return room.type;
        }
        return ''
    }

    //get all room names that are assigned to a rate modifier
    const getRateModifierRoomNames = (rateModifier) => {
        let rateModifierRoomIds = rateModifier.id;
        let rateModifierRoomNames = [];
        if (rateModifierRoomIds && Array.isArray(rateModifierRoomIds)) {
            rateModifierRoomNames = rateModifierRoomIds.map(roomId => {
                return getRoomNameById(roomId)
            })
        }
        return rateModifierRoomNames;
    }

    //sort rate modifiers by priority before displaying it
    sortRatesByPriority(rateModifiers)

    return (

        <>

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {rates.map((rateModifier, index) => (
                            <Draggable key={rateModifier.id} draggableId={rateModifier.id} index={index}>
                                {(provided, snapshot) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <RateModifierListItem
                                            key={rateModifier.id}
                                            rateModifier={rateModifier}
                                            roomTypeNames={getRateModifierRoomNames(rateModifier.id)}
                                            handlePropertyValueChange={handlePropertyValueChange}
                                            handleEditRateModifier={handleEditRateModifier}/>

                                    </Paper>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>

        </>

    );
}




export default RateModifiersList