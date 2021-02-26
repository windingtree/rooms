import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { DropzoneArea } from 'material-ui-dropzone'

const useStyles = makeStyles({
  note: {
    fontSize: '12px',
    fontWeight: 500,
    marginBottom: '16px',
    color: '#717171',
  },
  dropzoneClass: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: '1px solid #C7C7C7',
    boxSizing: 'border-box',
    borderRadius: '8px',
    minHeight: '129px',
    height: 'auto',
    backgroundColor: '#FBFBFB',
    '&:focus': {
      borderColor: '#9226AD !important',
      outline: 'none'
    }
  },
  text: {
    fontSize: '16px'
  },
  textHidden: {
    display: 'none'
  },
  previewContainer: {
    margin: 0,
    width: '100% !important',
    maxWidth: '540px',
    padding: '16px 8px 0 8px !important'
  },
  previewItem: {
    padding: '0 8px 16px 8px !important',
    '&>button': {
      opacity: '1 !important',
      width: '36px !important',
      height: '36px !important',
      backgroundColor: 'white !important',
      boxShadow: '0 1px 1px 1px rgba(0,0,0,0.15)',
      top: '-4px',
      right: '-2px',
      color: 'rgba(0,0,0,0.54)'
    }
  }
});

export default props => {
  const styles = useStyles();
  const {
    note = '',
    showFileNames = false,
    onUpload = () => {},
    ...restProps
  } = props;
  const [loadedFiles, setFiles] = useState([]);

  const handleOnUpload = files => {
    setFiles(files);
    onUpload(files);
  }

  return (
    <>
      {note !== '' &&
        <Typography
          className={styles.note}
        >
          {note}
        </Typography>
      }
      <DropzoneArea
        dropzoneClass={styles.dropzoneClass}
        acceptedFiles={['image/*']}
        onChange={handleOnUpload}
        showFileNames={showFileNames}
        dropzoneText='Upload images'
        showAlerts={false}
        filesLimit={20}
        Icon={() => (<></>)}
        classes={{
          text: loadedFiles.length === 0
            ? styles.text
            : styles.textHidden
        }}
        previewGridClasses={{
          container: styles.previewContainer,
          item: styles.previewItem
        }}
        {...restProps}
      />
    </>
  );
};
