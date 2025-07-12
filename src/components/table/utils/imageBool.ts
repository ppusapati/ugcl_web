export const isImage = (url: string | number | null | undefined) => {
    if (typeof (url) === 'string')
      return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    if (Array.isArray(url) && typeof url[0] === 'string') {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url[0]);
  }
    return false;
  }
  