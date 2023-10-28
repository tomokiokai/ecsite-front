function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 20);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

const ImageUrls = () => {
  const urls = Array(6).fill(0).map(() => getRandomImageUrl());
  return urls;
}

export default ImageUrls;