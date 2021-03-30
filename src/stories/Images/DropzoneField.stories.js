import React from 'react';

import DropzoneField from '../../components/base/DropzoneField'

export default {
    title: 'Images/DropzoneField',
    component: DropzoneField
};

export const SimpleField = () => {


  return (
    <>
      <DropzoneField
        note='Add pictures here, so that the travellers could see what type of room is this'
        title='Upload Images'
        subTitle='or drag & drop images here'
        uploading={false}
        onError={() => {}}
        onLoad={() => {}}
      />
    </>
  )
};
