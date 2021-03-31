import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';

import Image from './Image';
import ImageLightBox from './ImageLightBox';

const styles = makeStyles({
  container: {},
  imageBox: {
    display: 'inline-block'
  }
});

const ImagesGallery = (props) => {
  const classes = styles();
  const {
    images = [],
    onChange = () => {},
    onDelete = () => {}
  } = props;
  const [showImage, setShowImage] = useState(null);

  const handleClick = index => {
    setShowImage(index);
  };

  const handleCloseLightBox = () => {
    setShowImage(null);
  };

  const handlePrevImage = () => {
    const prevIndex = showImage - 1;
    setShowImage(prevIndex >= 0
      ? prevIndex
      : 0);
  };

  const handleNextImage = () => {
    const nextIndex = showImage + 1;
    setShowImage(nextIndex <= images.length - 1
      ? nextIndex
      : images.length - 1);
  };

  const handleImageDelete = index => {
    const imageUrl = images[index];
    const newImages = images.filter((...args) => args[1] !== index);
    onChange(newImages);
    onDelete(imageUrl);
  };

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const destinationImage = images[result.destination.index];
    const sourceImage = images[result.source.index];
    const newImages = [...images];
    newImages[result.destination.index] = sourceImage;
    newImages[result.source.index] = destinationImage;
    onChange(newImages);
  };

  return (
    <>
      <ImageLightBox
        images={images}
        showIndex={showImage}
        onClose={handleCloseLightBox}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='galleryDroppable'>
          {provided => (
            <div
              className={classes.container}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {images.map(((url, index) => (
                <Draggable
                  key={index}
                  draggableId={`${index}-${url}`}
                  index={index}
                >
                  {provided => (
                    <div
                      className={classes.imageBox}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Image
                        url={url}
                        onClick={() => handleClick(index)}
                        onDelete={() => handleImageDelete(index)}
                      />
                    </div>
                  )}
                </Draggable>
              )))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
export default ImagesGallery;