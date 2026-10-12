/**
 * Content Store Module
 * Handles loading, caching, and querying data for all chapters
 * 50 Years of Love, Memories & Moments — M. Buvaneswari (Buvana)
 */

const ContentStore = (() => {
  let timelineData = [];
  let reasonsData = [];
  let wishesData = [];
  let giftsData = [];
  let inventoryData = [];
  let assetMappingData = {};

  const prefix = window.ASSET_PREFIX || '';

  async function fetchJsonSafe(url) {
    try {
      const fullUrl = prefix + url;
      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[ContentStore] Could not load ${url}, checking fallback:`, err.message);
      return null;
    }
  }

  function adjustPath(p) {
    if (!p) return '';
    if (p.startsWith('http') || p.startsWith('data:') || p.startsWith('/')) return p;
    return prefix + p;
  }

  async function init() {
    const [timeline, reasons, wishes, gifts, inventory, mapping] = await Promise.all([
      fetchJsonSafe('data/timeline.json'),
      fetchJsonSafe('data/reasons.json'),
      fetchJsonSafe('data/wishes.json'),
      fetchJsonSafe('data/gifts.json'),
      fetchJsonSafe('data/photo_inventory.json'),
      fetchJsonSafe('data/asset_mapping.json')
    ]);

    if (timeline) {
      timelineData = timeline.map(item => ({
        ...item,
        images: (item.images || []).map(adjustPath)
      }));
    }
    if (reasons) reasonsData = reasons;
    if (wishes) {
      wishesData = wishes.map(item => ({
        ...item,
        videoSrc: adjustPath(item.videoSrc),
        thumbnail: adjustPath(item.thumbnail)
      }));
    }
    if (gifts) giftsData = gifts;
    if (inventory) {
      inventoryData = inventory.map(item => ({
        ...item,
        optimizedPath: adjustPath(item.optimizedPath),
        thumbnailPath: adjustPath(item.thumbnailPath)
      }));
    }
    if (mapping) assetMappingData = mapping;

    // Validate 50 reasons constraint
    if (reasonsData.length !== 50) {
      console.warn(`[ContentStore] Expected 50 reasons, got ${reasonsData.length}`);
    }

    // Validate 50 gifts constraint
    if (giftsData.length !== 50) {
      console.warn(`[ContentStore] Expected 50 gifts, got ${giftsData.length}`);
    }

    return true;
  }

  return {
    init,
    getTimeline: () => timelineData,
    getReasons: () => reasonsData,
    getWishes: () => wishesData,
    getGifts: () => giftsData,
    getInventory: () => inventoryData,
    getAssetMapping: () => assetMappingData,
    getGalleryPhotos: (category = 'all') => {
      if (!inventoryData || inventoryData.length === 0) return [];
      if (category === 'all') return inventoryData;
      return inventoryData.filter(item => item.category && item.category.toLowerCase() === category.toLowerCase());
    },
    getAgePhotos: () => {
      if (!inventoryData || inventoryData.length === 0) return [];
      // Prefer photos from 'Age 1 to 50' folder or with confirmed year order
      const ageItems = inventoryData.filter(item => item.sourceFolder === 'Age 1 to 50');
      if (ageItems.length > 0) {
        return ageItems.sort((a, b) => {
          const ya = a.year || 9999;
          const yb = b.year || 9999;
          return ya - yb;
        });
      }
      return inventoryData.slice(0, 50);
    }
  };
})();

window.ContentStore = ContentStore;
