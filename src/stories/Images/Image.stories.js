import React from 'react';

import Image from '../../components/base/Images/Image'

export default {
    title: 'Images/Image',
    component: Image
};

export const SimpleImage = () => {


  return (
    <>
      <Image
        url='https://local-rooms-images.s3.us-west-2.amazonaws.com/f4dc4b6f-781e-4f26-aa9e-aa692f43258f'
      />
    </>
  )
};
