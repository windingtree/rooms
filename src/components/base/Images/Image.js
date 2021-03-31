import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = makeStyles({
  removeButton: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: 'rgba(255,255,255,0.7)'
  }
});

const Image = (props) => {
  const classes = styles();
  const {
    width = '13vw',
    height = '10vh',
    url,
    onClick = () => {},
    onDelete = () => {},
    ...restProps
  } = props;

  const handleImageClick = e => {
    e.stopPropagation();
    onClick(url)
  };

  const handleImageDelete = e => {
    e.stopPropagation();
    onDelete(url)
  };

  return (
    <div
      style={{
        width,
        height,
        maxWidth: '170px',
        backgroundImage: `url(${url})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
        margin: '0 16px 16px 0',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={e => handleImageClick(e)}
      {...restProps}
    >
      <IconButton
        className={classes.removeButton}
        aria-label="delete"
        onClick={handleImageDelete}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default Image;