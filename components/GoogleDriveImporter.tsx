'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES, PRODUCTS } from '@/config/site';
import { FolderOpen, RefreshCw, Check, Image as ImageIcon, LogIn, Upload, Link as LinkIcon, X, Sparkles, FileImage, Trash2, ShoppingBag } from 'lucide-react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  dataUrl?: string;
}

const HERO_SLIDE_TARGETS = [
  { id: 'hero-1', name: 'Hero Slide 1: Beef Mince & Craft Butcher' },
  { id: 'hero-2', name: 'Hero Slide 2: Steaks & Wagyu' },
  { id: 'hero-3', name: 'Hero Slide 3: Mince, Sausages & Burgers' },
  { id: 'hero-4', name: 'Hero Slide 4: Slow Cooking & Roasts' },
];

export function GoogleDriveImporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const DEFAULT_CATEGORIES = {
    'beef': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000&auto=format&fit=crop',
    'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1000&auto=format&fit=crop',
    'lamb': 'https://images.unsplash.com/photo-1602498456745-e9503b30470b?q=80&w=1000&auto=format&fit=crop',
    'pork': 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=1000&auto=format&fit=crop',
    'sausages': 'https://images.unsplash.com/photo-1585325701165-351af916e581?q=80&w=1000&auto=format&fit=crop',
    'bbq-grill': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    'meat-boxes': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop',
    'ready-to-cook': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1000&auto=format&fit=crop',
    'deli-cured': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
    'specialty-meat': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=1000&auto=format&fit=crop',
    'seafood': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop',
    'pet-food': 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1000&auto=format&fit=crop',
  };

  const DEFAULT_HERO = {
    'hero-1': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1600&auto=format&fit=crop',
    'hero-2': 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1600&auto=format&fit=crop',
    'hero-3': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=1600&auto=format&fit=crop',
    'hero-4': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
  };

  const [categoryAssignments, setCategoryAssignments] = useState<{ [key: string]: string }>(DEFAULT_CATEGORIES);
  const [heroAssignments, setHeroAssignments] = useState<{ [key: string]: string }>(DEFAULT_HERO);
  const [productAssignments, setProductAssignments] = useState<{ [key: string]: string }>({});

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pasteLinksInput, setPasteLinksInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const storedCategories = localStorage.getItem('tmc_gdrive_category_images');
        if (storedCategories) setCategoryAssignments(JSON.parse(storedCategories));

        const storedHero = localStorage.getItem('tmc_gdrive_hero_images');
        if (storedHero) setHeroAssignments(JSON.parse(storedHero));

        const storedProducts = localStorage.getItem('tmc_gdrive_product_images');
        if (storedProducts) setProductAssignments(JSON.parse(storedProducts));
      } catch (err) {
        console.error('Error syncing assignments:', err);
      }
    };
    handleUpdate();
    window.addEventListener('tmc_images_updated', handleUpdate);
    return () => window.removeEventListener('tmc_images_updated', handleUpdate);
  }, []);

  // Initialize Google Identity Services Script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('gsi-client-script')) return;

    const script = document.createElement('script');
    script.id = 'gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Process uploaded local files (Drag & drop or file picker)
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let files: File[] = [];

    if ('files' in e.target && e.target.files) {
      files = Array.from(e.target.files);
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      files = Array.from(e.dataTransfer.files);
    }

    if (files.length === 0) return;

    setLoading(true);
    setStatusMessage(`Processing ${files.length} image file(s)...`);

    const newDriveFiles: DriveFile[] = [];

    let processedCount = 0;
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const fileObj: DriveFile = {
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          mimeType: file.type,
          dataUrl,
        };
        newDriveFiles.push(fileObj);
        processedCount++;

        if (processedCount === files.length) {
          setDriveFiles((prev) => [...newDriveFiles, ...prev]);
          autoMatchFiles(newDriveFiles);
          setLoading(false);
          setStatusMessage(`Added ${newDriveFiles.length} uploaded image(s)!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Parse pasted Google Drive / Image URLs
  const handleParseLinks = () => {
    if (!pasteLinksInput.trim()) return;

    const lines = pasteLinksInput.split(/[\n,;\s]+/);
    const newFiles: DriveFile[] = [];

    lines.forEach((line, idx) => {
      const cleanUrl = line.trim();
      if (!cleanUrl) return;

      let finalImgUrl = cleanUrl;
      let fileId = '';

      // Match Google Drive file ID
      const driveMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleanUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        fileId = driveMatch[1];
        finalImgUrl = `https://lh3.googleusercontent.com/d/${fileId}=s1600`;
      } else {
        fileId = `link-${idx}-${Date.now()}`;
      }

      newFiles.push({
        id: fileId,
        name: `Drive Image ${idx + 1}`,
        mimeType: 'image/jpeg',
        dataUrl: finalImgUrl,
      });
    });

    if (newFiles.length > 0) {
      setDriveFiles((prev) => [...newFiles, ...prev]);
      autoMatchFiles(newFiles);
      setPasteLinksInput('');
      setStatusMessage(`Parsed ${newFiles.length} Google Drive link(s)!`);
    }
  };

  const handleConnectDrive = () => {
    setLoading(true);
    setStatusMessage('Requesting Google Drive Authorization...');

    // @ts-ignore
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        // @ts-ignore
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '412946119010-applet.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: (response: any) => {
            if (response.access_token) {
              setToken(response.access_token);
              fetchFolderAndImages(response.access_token);
            } else {
              setLoading(false);
              setStatusMessage('Authorization was cancelled or failed.');
            }
          },
          error_callback: (err: any) => {
            console.error('OAuth Error:', err);
            promptManualToken();
          }
        });
        client.requestAccessToken();
      } catch (err) {
        console.error('GIS Error:', err);
        promptManualToken();
      }
    } else {
      promptManualToken();
    }
  };

  const promptManualToken = () => {
    const userToken = window.prompt(
      "To connect directly to Google Drive, please paste your Google OAuth Access Token, or click OK to use the direct File Upload / Link Paste options."
    );
    if (userToken && userToken.trim()) {
      setToken(userToken.trim());
      fetchFolderAndImages(userToken.trim());
    } else {
      setLoading(false);
      setStatusMessage('Waiting for connection or file upload...');
    }
  };

  const fetchFolderAndImages = async (accessToken: string) => {
    setLoading(true);
    setStatusMessage('Searching Google Drive for "the meat cart" folder...');

    try {
      const folderQuery = encodeURIComponent(
        "name contains 'the meat cart' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
      );
      const folderRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id,name)`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      let folderId: string | null = null;
      if (folderRes.ok) {
        const folderData = await folderRes.json();
        if (folderData.files && folderData.files.length > 0) {
          folderId = folderData.files[0].id;
          setStatusMessage(`Found folder "${folderData.files[0].name}". Fetching images...`);
        }
      }

      let fileQuery = "mimeType contains 'image/' and trashed = false";
      if (folderId) {
        fileQuery = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
      }

      const filesRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          fileQuery
        )}&pageSize=50&fields=files(id,name,mimeType,thumbnailLink,webContentLink)`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!filesRes.ok) {
        throw new Error(`Drive API returned ${filesRes.status}`);
      }

      const filesData = await filesRes.json();
      const rawFiles: DriveFile[] = filesData.files || [];

      if (rawFiles.length === 0) {
        setStatusMessage('No images found in "the meat cart" folder. Showing all Drive images...');
        const allRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            "mimeType contains 'image/' and trashed = false"
          )}&pageSize=30&fields=files(id,name,mimeType,thumbnailLink,webContentLink)`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (allRes.ok) {
          const allData = await allRes.json();
          setDriveFiles(allData.files || []);
        }
      } else {
        setStatusMessage(`Loaded ${rawFiles.length} images from "the meat cart" folder!`);
        
        const processedFiles = await Promise.all(
          rawFiles.map(async (file) => {
            try {
              const imgRes = await fetch(
                `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                }
              );
              if (imgRes.ok) {
                const blob = await imgRes.blob();
                const dataUrl = URL.createObjectURL(blob);
                return { ...file, dataUrl };
              }
            } catch (e) {
              console.warn('Error fetching image blob:', e);
            }
            const lh3Link = `https://lh3.googleusercontent.com/d/${file.id}=s1600`;
            return { ...file, dataUrl: file.thumbnailLink?.replace('=s220', '=s1600') || lh3Link };
          })
        );

        setDriveFiles(processedFiles);
        autoMatchFiles(processedFiles);
      }
    } catch (err: any) {
      console.error('Error fetching Drive files:', err);
      setStatusMessage(`Notice: ${err.message || 'Could not auto-fetch. Please use File Upload or Paste Links below.'}`);
    } finally {
      setLoading(false);
    }
  };

  const autoMatchFiles = (files: DriveFile[]) => {
    const newCategoryAssignments: { [key: string]: string } = { ...categoryAssignments };
    const newHeroAssignments: { [key: string]: string } = { ...heroAssignments };
    const newProductAssignments: { [key: string]: string } = { ...productAssignments };

    files.forEach((file) => {
      const lowerName = file.name.toLowerCase();
      const imgUrl = file.dataUrl || `https://lh3.googleusercontent.com/d/${file.id}=s1600`;

      // Match Hero Slides
      if (lowerName.includes('hero1') || lowerName.includes('mince-hero') || lowerName.includes('banner1') || lowerName.includes('slide1')) {
        newHeroAssignments['hero-1'] = imgUrl;
      } else if (lowerName.includes('hero2') || lowerName.includes('steak-hero') || lowerName.includes('wagyu') || lowerName.includes('slide2')) {
        newHeroAssignments['hero-2'] = imgUrl;
      } else if (lowerName.includes('hero3') || lowerName.includes('sausage-hero') || lowerName.includes('burger') || lowerName.includes('slide3')) {
        newHeroAssignments['hero-3'] = imgUrl;
      } else if (lowerName.includes('hero4') || lowerName.includes('roast-hero') || lowerName.includes('slow') || lowerName.includes('slide4')) {
        newHeroAssignments['hero-4'] = imgUrl;
      }

      // Match Categories
      CATEGORIES.forEach((cat) => {
        if (
          lowerName.includes(cat.slug) ||
          lowerName.includes(cat.name.toLowerCase()) ||
          (cat.slug === 'beef' && (lowerName.includes('beef') && !lowerName.includes('mince') && !lowerName.includes('steak'))) ||
          (cat.slug === 'chicken' && lowerName.includes('chicken')) ||
          (cat.slug === 'lamb' && lowerName.includes('lamb')) ||
          (cat.slug === 'pork' && lowerName.includes('pork')) ||
          (cat.slug === 'sausages' && lowerName.includes('sausage')) ||
          (cat.slug === 'meat-boxes' && (lowerName.includes('box') || lowerName.includes('pack')))
        ) {
          if (!newCategoryAssignments[cat.slug]) {
            newCategoryAssignments[cat.slug] = imgUrl;
          }
        }
      });

      // Match Products
      PRODUCTS.forEach((prod) => {
        const prodSlug = prod.slug.toLowerCase();
        const prodName = prod.name.toLowerCase();
        if (
          lowerName.includes(prodSlug) ||
          lowerName.includes(prodName) ||
          (prod.slug === 'scotch-fillet-steak' && (lowerName.includes('scotch') || lowerName.includes('fillet'))) ||
          (prod.slug === 'porterhouse-steak' && lowerName.includes('porterhouse')) ||
          (prod.slug === 'rump-steak' && lowerName.includes('rump')) ||
          (prod.slug === 'eye-fillet-steak' && lowerName.includes('eye-fillet')) ||
          (prod.slug === 'beef-mince-premium-5-star-lean' && lowerName.includes('mince')) ||
          (prod.slug === 'beef-brisket' && lowerName.includes('brisket'))
        ) {
          if (!newProductAssignments[prod.slug]) {
            newProductAssignments[prod.slug] = imgUrl;
          }
        }
      });
    });

    setCategoryAssignments(newCategoryAssignments);
    setHeroAssignments(newHeroAssignments);
    setProductAssignments(newProductAssignments);
  };

  const handleAssignCategory = (catSlug: string, imageUrl: string) => {
    const updated = { ...categoryAssignments, [catSlug]: imageUrl };
    setCategoryAssignments(updated);
  };

  const handleAssignHero = (heroId: string, imageUrl: string) => {
    const updated = { ...heroAssignments, [heroId]: imageUrl };
    setHeroAssignments(updated);
  };

  const handleAssignProduct = (prodSlug: string, imageUrl: string) => {
    const updated = { ...productAssignments, [prodSlug]: imageUrl };
    setProductAssignments(updated);
  };

  const saveAssignments = () => {
    try {
      localStorage.setItem('tmc_gdrive_category_images', JSON.stringify(categoryAssignments));
      localStorage.setItem('tmc_gdrive_hero_images', JSON.stringify(heroAssignments));
      localStorage.setItem('tmc_gdrive_product_images', JSON.stringify(productAssignments));
      
      // Dispatch event to refresh Hero, Category Grid, and Product Cards immediately
      window.dispatchEvent(new Event('tmc_images_updated'));
      
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const clearAllCustomImages = () => {
    if (window.confirm('Reset all custom images back to store defaults?')) {
      localStorage.removeItem('tmc_gdrive_category_images');
      localStorage.removeItem('tmc_gdrive_hero_images');
      localStorage.removeItem('tmc_gdrive_product_images');
      setCategoryAssignments({});
      setHeroAssignments({});
      setProductAssignments({});
      window.dispatchEvent(new Event('tmc_images_updated'));
    }
  };

  // Top products for dropdown
  const topProducts = PRODUCTS.filter((p) => p.featured).slice(0, 16);

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLocalFileUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Floating Admin Banner */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-black text-white border-y border-red-800/60 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0 shadow-inner">
              <FolderOpen className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-xs sm:text-sm tracking-wide">
                  Image Sync &amp; Drive Manager &mdash; &ldquo;the meat cart&rdquo;
                </span>
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Live Customizer
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Upload images or sync with Google Drive folder to update Hero slides, Categories &amp; Products live!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all border border-zinc-700 flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-red-400" />
              <span>Upload Photos</span>
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md flex items-center space-x-2 border border-red-500/30"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Manage Images</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-red-900/60 rounded-2xl max-w-4xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FolderOpen className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-black text-lg text-white font-serif">
                    Image Manager &amp; Live Sync
                  </h3>
                  <p className="text-xs text-gray-400">
                    Assign photos from your device or Google Drive to Hero slides, Categories &amp; Featured Products.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg bg-zinc-800/80 hover:bg-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Option 1 & 2: Upload Files or Connect Drive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Local Drag & Drop Box */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleLocalFileUpload(e);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-red-900/60 hover:border-red-500 bg-red-950/10 hover:bg-red-950/20 p-5 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Upload Photos From Device</h4>
                    <p className="text-xs text-gray-400">
                      Drag &amp; drop image files here, or click to choose from computer.
                    </p>
                  </div>
                  <span className="bg-red-700 text-white text-[11px] font-bold px-3 py-1 rounded-md mt-1">
                    Select File(s)
                  </span>
                </div>

                {/* Google Drive Connect Box */}
                <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
                      <Sparkles className="w-4 h-4 text-red-400" />
                      <span>Google Drive Folder: <span className="text-white font-mono bg-black/60 px-2 py-0.5 rounded">&ldquo;the meat cart&rdquo;</span></span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {statusMessage || 'Click button below to scan your Google Drive account.'}
                    </p>
                  </div>

                  <button
                    onClick={handleConnectDrive}
                    disabled={loading}
                    className="w-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{token ? 'Rescan Google Drive' : 'Connect & Fetch From Google Drive'}</span>
                  </button>
                </div>

              </div>

              {/* Paste Shared Google Drive Links Box */}
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
                    <LinkIcon className="w-4 h-4 text-red-400" />
                    <span>Paste Shared Google Drive Image Links / Direct URLs</span>
                  </div>
                  <span className="text-[11px] text-gray-500">Auto-converts shared drive links</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    rows={2}
                    value={pasteLinksInput}
                    onChange={(e) => setPasteLinksInput(e.target.value)}
                    placeholder="Paste Google Drive image links here (e.g. https://drive.google.com/file/d/1ABC.../view)"
                    className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleParseLinks}
                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 self-end sm:self-auto"
                  >
                    Add Links
                  </button>
                </div>
              </div>

              {/* Found / Loaded Files Grid */}
              {driveFiles.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center space-x-2">
                      <FileImage className="w-4 h-4" />
                      <span>Loaded Images ({driveFiles.length})</span>
                    </h4>
                    <span className="text-xs text-gray-400">
                      Select what each photo should replace:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {driveFiles.map((file) => {
                      const imgSrc = file.dataUrl || file.thumbnailLink || `https://lh3.googleusercontent.com/d/${file.id}=s1600`;
                      
                      return (
                        <div
                          key={file.id}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-3 space-y-3 shadow-md"
                        >
                          <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden border border-zinc-800">
                            <img
                              src={imgSrc}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[90%] font-mono">
                              {file.name}
                            </div>
                          </div>

                          {/* Assignment Dropdowns */}
                          <div className="space-y-2 text-xs">
                            <div>
                              <label className="block text-[11px] text-gray-400 font-semibold mb-1">
                                Assign to Hero Slider:
                              </label>
                              <select
                                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-red-500"
                                onChange={(e) => {
                                  if (e.target.value) handleAssignHero(e.target.value, imgSrc);
                                }}
                                value={
                                  Object.keys(heroAssignments).find(
                                    (k) => heroAssignments[k] === imgSrc
                                  ) || ''
                                }
                              >
                                <option value="">-- None --</option>
                                {HERO_SLIDE_TARGETS.map((h) => (
                                  <option key={h.id} value={h.id}>
                                    {h.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] text-gray-400 font-semibold mb-1">
                                Assign to Category Card:
                              </label>
                              <select
                                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-red-500"
                                onChange={(e) => {
                                  if (e.target.value) handleAssignCategory(e.target.value, imgSrc);
                                }}
                                value={
                                  Object.keys(categoryAssignments).find(
                                    (k) => categoryAssignments[k] === imgSrc
                                  ) || ''
                                }
                              >
                                <option value="">-- None --</option>
                                {CATEGORIES.map((cat) => (
                                  <option key={cat.slug} value={cat.slug}>
                                    Category: {cat.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] text-gray-400 font-semibold mb-1 flex items-center space-x-1">
                                <ShoppingBag className="w-3 h-3 text-red-400" />
                                <span>Assign to Product Card:</span>
                              </label>
                              <select
                                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-red-500"
                                onChange={(e) => {
                                  if (e.target.value) handleAssignProduct(e.target.value, imgSrc);
                                }}
                                value={
                                  Object.keys(productAssignments).find(
                                    (k) => productAssignments[k] === imgSrc
                                  ) || ''
                                }
                              >
                                <option value="">-- None --</option>
                                {topProducts.map((prod) => (
                                  <option key={prod.slug} value={prod.slug}>
                                    {prod.name} ({prod.category})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center space-y-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
                  <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
                  <p className="text-sm text-gray-300 font-medium">
                    No images added to session yet.
                  </p>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Use <strong>&ldquo;Upload Photos From Device&rdquo;</strong> above to drag and drop your image files, or click <strong>&ldquo;Connect &amp; Fetch From Google Drive&rdquo;</strong>.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={clearAllCustomImages}
                  className="text-xs text-gray-500 hover:text-red-400 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
                {savedSuccess && (
                  <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Applied to Hero, Categories & Products Live!</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs text-gray-300 hover:text-white font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    saveAssignments();
                    setIsOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Apply Images Live</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

