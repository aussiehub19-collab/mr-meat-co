'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  unoptimized?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop';

export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/(?:file\/d\/|d\/|open\?id=)([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export function formatGoogleDriveUrl(url: string, attempt: number = 0): string {
  if (!url) return FALLBACK_IMAGE;
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    if (attempt === 0) {
      return `https://lh3.googleusercontent.com/d/${fileId}=s1600`;
    } else if (attempt === 1) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    } else if (attempt === 2) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return url;
}

export function SmartImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  fill = false,
  unoptimized,
}: SmartImageProps) {
  const [attempt, setAttempt] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState<string>(() => formatGoogleDriveUrl(src, 0));
  const [useNativeImg, setUseNativeImg] = useState<boolean>(false);

  useEffect(() => {
    setAttempt(0);
    setUseNativeImg(false);
    setImgSrc(formatGoogleDriveUrl(src, 0));
  }, [src]);

  const handleError = () => {
    const fileId = extractGoogleDriveId(src);
    if (fileId && attempt < 2) {
      const nextAttempt = attempt + 1;
      setAttempt(nextAttempt);
      setImgSrc(formatGoogleDriveUrl(src, nextAttempt));
    } else if (!useNativeImg) {
      // Fallback to native img tag to bypass any Next.js proxy restriction
      setUseNativeImg(true);
      setImgSrc(formatGoogleDriveUrl(src, 0));
    } else if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  const isGoogleDrive = Boolean(extractGoogleDriveId(src) || (imgSrc && (imgSrc.includes('googleusercontent.com') || imgSrc.includes('drive.google.com'))));
  const shouldUnoptimize = unoptimized !== undefined ? unoptimized : isGoogleDrive;

  if (useNativeImg) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${fill ? 'absolute inset-0 w-full h-full' : ''}`}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        referrerPolicy="no-referrer"
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        className={className}
        referrerPolicy="no-referrer"
        unoptimized={shouldUnoptimize}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      referrerPolicy="no-referrer"
      unoptimized={shouldUnoptimize}
      onError={handleError}
    />
  );
}

