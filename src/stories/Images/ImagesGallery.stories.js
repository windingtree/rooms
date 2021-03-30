import React, { useState } from 'react';

import ImagesGallery from '../../components/base/Images/ImagesGallery'

export default {
  title: 'Images/ImagesGallery',
  component: ImagesGallery
};

const images = [
  'https://local-rooms-images.s3.us-west-2.amazonaws.com/f4dc4b6f-781e-4f26-aa9e-aa692f43258f',
  'https://local-rooms-images.s3.us-west-2.amazonaws.com/2f012ea3-e9b7-4942-9a5c-f2e1dc469505',
  'https://local-rooms-images.s3.us-west-2.amazonaws.com/ede272d6-be54-4df1-96e4-147ee58496e7',
  'https://local-rooms-images.s3.us-west-2.amazonaws.com/1f280e08-6eac-45c3-acff-e2c2f9183e0e',
  'https://local-rooms-images.s3.us-west-2.amazonaws.com/3574bb61-f824-4ff3-aaf4-b981c83ea097',
  'https://local-rooms-images.s3.us-west-2.amazonaws.com/e4064dac-434b-4db2-a40d-a521d4199414',
];

export const SimpleGallery = () => {
  const [loadedImages, setLoadedImages] = useState(images);

  return (
    <>
      <ImagesGallery
        images={loadedImages}
        onDelete={setLoadedImages}
      />
    </>
  )
};
