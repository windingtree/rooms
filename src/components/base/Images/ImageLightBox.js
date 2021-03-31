import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const styles = makeStyles({
  root: {
    padding: 0
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    left: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 99999
  },
  closeButton: {
    backgroundColor: 'white'
  },
  prevButton: {
    position: 'absolute',
    top: 0,
    left: '8px',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    zIndex: 1
  },
  nextButton: {
    position: 'absolute',
    top: 0,
    right: '8px',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    zIndex: 1
  }
});

const ImageLightBox = (props) => {
  const classes = styles();
  const {
    images = [],
    showIndex = null,
    alt = '',
    onClose = () => {},
    onPrev = () => {},
    onNext = () => {}
  } = props;

  return (
    <Dialog
      open={showIndex !== null}
      scroll='paper'
      classes={{
        root: classes.root
      }}
      onBackdropClick={onClose}
    >
      <div className={classes.closeButtonWrapper}>
        <IconButton
          className={classes.closeButton}
          aria-label='close'
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent
        classes={{
          root: classes.root
        }}
      >
        {images[showIndex] !== 'undefined' &&
          <img
            src={images[showIndex]}
            alt={alt}
          />
        }
        <div className={classes.prevButton}>
          <IconButton
            className={classes.closeButton}
            aria-label='prev'
            onClick={onPrev}
          >
            <ArrowBackIosIcon />
          </IconButton>
        </div>
        <div className={classes.nextButton}>
          <IconButton
            className={classes.closeButton}
            aria-label='next'
            onClick={onNext}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ImageLightBox;