import { useCallback, useState } from 'react';
// import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './imagesZoom/index';

const PostImages = ({ images }) => {
  const [showImageZoom, setShowImageZoom] = useState(false);

  const onClose = useCallback(() => {

  }, []);

  const onZoom = useCallback(() => {
    setShowImageZoom(true);
  }, []);
  if (images.length === 1) {
    // console.log(images[0].content);
    return (
      <>
        <img role="presentation" src={`http://localhost:3065/${images[0].content}`} alt={images[0].src} onClick={onZoom} />
        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img role="presentation" style={{ width: '50%', display: 'inline-block' }} src={`http://localhost:3065/${images[0].content}`} alt={images[0].src} onClick={onZoom} />
        <img role="presentation" style={{ width: '50%', display: 'inline-block' }} src={`http://localhost:3065/${images[1].content}`} alt={images[1].src} onClick={onZoom} />
        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    <>
      <img role="presentation" style={{ width: '50%', display: 'inline-block' }} src={`http://localhost:3065/${images[0].content}`} alt={images[0].src} onClick={onZoom} />
      <div
        role="presentation"
        style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
        onClick={onZoom}
      >
        <PlusOutlined />
        <br />
        {images.length - 1}
        개의 사진 더보기
      </div>
      {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

// PostImages.propTypes = {
//   images: PropTypes.arrayOf(PropTypes.object),
// };

export default PostImages;
