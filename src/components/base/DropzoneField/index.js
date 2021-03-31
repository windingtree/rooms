import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles({
  note: {
    fontSize: '12px',
    fontWeight: 500,
    marginBottom: '16px',
    color: '#717171',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #C7C7C7',
    boxSizing: 'border-box',
    borderRadius: '8px',
    minHeight: '129px',
    height: 'auto',
    backgroundColor: '#FBFBFB',
    '&>p': {
      textAlign: 'center',
      color: 'rgba(117,117,117,1)'
    },
    '&:focus': {
      borderColor: '#9226AD !important',
      outline: 'none'
    }
  },
  title: {
    fontSize: '16px',
    textAlign: 'center',
    color: 'rgba(117,117,117,1)'
  },
  subTitle: {
    fontSize: '12px',
    textAlign: 'center',
    color: 'rgba(117,117,117,1)'
  }
});

const loadImageAsBase64 = imageFile => new Promise(
  (resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(reader.error);
      reader.abort();
    };
    reader.onloadend = () => {
      resolve(reader
        .result
        .replace('data:', '')
        .replace(/^.+,/, ''));
    };
    reader.readAsDataURL(imageFile);
  }
);

const DropzoneField = (props) => {
  const styles = useStyles();
  const {
    note,
    title,
    subTitle,
    uploading,
    onLoad = () => {},
    onError = () => {}
  } = props;
  const onDrop = useCallback(async files => {
    let images = [];
    try {
      for (const imageFile of files) {
        const imageData = await loadImageAsBase64(imageFile);
        images.push(imageData);
      }
    } catch (error) {
      onError(error);
    }
    onLoad(images);
  }, [onLoad, onError]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop
  });

  return (
    <>
      {(note && note !== '') &&
        <Typography
          className={styles.note}
        >
          {note}
        </Typography>
      }
      <div
        className={styles.container}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {!uploading &&
          <>
            <Typography className={styles.title}>{title}</Typography>
            {subTitle && <Typography className={styles.subTitle}>{subTitle}</Typography>}
          </>
        }
        {uploading &&
          <CircularProgress color='secondary' size={48} />
        }
      </div>
    </>
  );
};

export default DropzoneField;