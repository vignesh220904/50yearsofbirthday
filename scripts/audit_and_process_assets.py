import os
import json
import re
from datetime import datetime
from PIL import Image, ExifTags, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()

SOURCE_DIRS = [
    'Life journey',
    'Age 1 to 50',
    'Memory gallery'
]

ASSETS_PHOTO_DIR = os.path.join('assets', 'photos')
ASSETS_THUMB_DIR = os.path.join('assets', 'thumbnails')

os.makedirs(ASSETS_PHOTO_DIR, exist_ok=True)
os.makedirs(ASSETS_THUMB_DIR, exist_ok=True)

def format_bytes(size):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} TB"

def get_exif_data(img):
    exif_data = {}
    try:
        raw_exif = img.getexif()
        if raw_exif:
            for tag_id, value in raw_exif.items():
                tag_name = ExifTags.TAGS.get(tag_id, tag_id)
                if tag_name in ['DateTimeOriginal', 'DateTime', 'DateTimeDigitized']:
                    exif_data[tag_name] = str(value)
    except Exception:
        pass
    return exif_data

def infer_year_and_date(filename, exif_data):
    # Check EXIF first
    for tag in ['DateTimeOriginal', 'DateTimeDigitized', 'DateTime']:
        if tag in exif_data and exif_data[tag]:
            val = exif_data[tag]
            m = re.match(r'(\d{4})[:\-](\d{2})[:\-](\d{2})', val)
            if m:
                return int(m.group(1)), f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
            m_year = re.match(r'(\d{4})', val)
            if m_year:
                return int(m_year.group(1)), str(m_year.group(1))

    # Filename patterns
    # e.g. 1970s -> 1976
    if '1970s' in filename:
        return 1976, 'c. 1976 (Childhood)'
    if '1980s' in filename:
        if 'Schooling' in filename:
            return 1984, 'c. 1980s (School Years)'
        if 'Puberty' in filename:
            return 1988, 'c. 1980s (Teenage Milestone)'
        return 1985, 'c. 1980s'
    if '1990s' in filename:
        return 1993, 'c. 1990s (Pre-College / College)'
    if 'Bcom' in filename or 'B.Com' in filename:
        return 1995, '1993–1996 (B.Com College Days)'

    # Standard date stamps in filenames like IMG_20180526_104500.jpg, 20140602_044331.jpg, 2013-04-25
    m_full = re.search(r'(19\d\d|20\d\d)[-_]?(\d{2})[-_]?(\d{2})', filename)
    if m_full:
        y, m, d = int(m_full.group(1)), int(m_full.group(2)), int(m_full.group(3))
        if 1 <= m <= 12 and 1 <= d <= 31:
            return y, f"{y:04d}-{m:02d}-{d:02d}"

    # Year with separator or at start: 1997.jpg, 2004(1).jpg, 2012 - 1.jpg
    m_year = re.search(r'\b(19\d\d|20\d\d)\b', filename)
    if m_year:
        return int(m_year.group(1)), str(m_year.group(1))

    # WhatsApp date pattern e.g. IMG-20161114-WA...
    m_wa = re.search(r'WA\d*[-_](\d{4})(\d{2})(\d{2})', filename)
    if m_wa:
        return int(m_wa.group(1)), f"{m_wa.group(1)}-{m_wa.group(2)}-{m_wa.group(3)}"

    return None, None

def infer_category(folder, filename, year):
    fn_lower = filename.lower()
    if 'school' in fn_lower:
        return 'Education'
    if 'bcom' in fn_lower or 'college' in fn_lower:
        return 'Education'
    if '1970' in fn_lower or (year and year < 1980):
        return 'Childhood'
    if 'puberty' in fn_lower:
        return 'Celebrations'
    if '1997' in fn_lower or (year == 1997):
        return 'Marriage'
    if '1998' in fn_lower or 'seemantham' in fn_lower:
        return 'Family'
    if 'mysore' in fn_lower or 'travel' in fn_lower or 'tour' in fn_lower:
        return 'Travel'
    if 'birthday' in fn_lower or 'anniversary' in fn_lower or 'arangetram' in fn_lower or 'salangai' in fn_lower or 'housewarming' in fn_lower:
        return 'Celebrations'
    if 'pooja' in fn_lower or 'diwali' in fn_lower or 'pongal' in fn_lower or 'navratri' in fn_lower:
        return 'Festivals'
    if year and year >= 2024:
        return 'Recent memories'
    if year and year < 2005:
        return 'Family'
    return 'Candid moments'

def generate_safe_slug(folder, filename):
    base, _ = os.path.splitext(filename)
    slug = re.sub(r'[^a-zA-Z0-9_\-]', '_', base)
    slug = re.sub(r'_+', '_', slug).strip('_')
    f_prefix = 'lj' if 'Life' in folder else ('age' if 'Age' in folder else 'mg')
    return f"{f_prefix}_{slug}"

def process_all_photos():
    inventory = []
    asset_mapping = {
        'by_folder': {'Life journey': [], 'Age 1 to 50': [], 'Memory gallery': []},
        'by_year': {},
        'by_category': {},
        'timeline_matches': [],
        'age_sequence': []
    }

    total_files = 0
    errors = 0

    print("Beginning comprehensive photo audit & optimization...")

    for folder in SOURCE_DIRS:
        if not os.path.exists(folder):
            print(f"Warning: {folder} does not exist.")
            continue
        
        files = sorted(os.listdir(folder))
        print(f"\nProcessing {folder} ({len(files)} items)...")
        
        for idx, fname in enumerate(files):
            orig_path = os.path.join(folder, fname)
            if not os.path.isfile(orig_path):
                continue
            
            total_files += 1
            file_stat = os.stat(orig_path)
            file_size = file_stat.st_size
            _, ext = os.path.splitext(fname)
            ext_clean = ext.lower().replace('.', '')
            
            # Open image for dimension and orientation
            width, height = None, None
            exif_dict = {}
            img_format = ext_clean.upper()
            
            safe_slug = generate_safe_slug(folder, fname)
            web_filename = f"{safe_slug}.webp"
            thumb_filename = f"{safe_slug}_thumb.webp"
            
            web_rel_path = f"assets/photos/{web_filename}"
            thumb_rel_path = f"assets/thumbnails/{thumb_filename}"
            
            web_full_path = os.path.join(ASSETS_PHOTO_DIR, web_filename)
            thumb_full_path = os.path.join(ASSETS_THUMB_DIR, thumb_filename)

            try:
                with Image.open(orig_path) as img:
                    img_format = img.format or ext_clean.upper()
                    exif_dict = get_exif_data(img)
                    
                    # Fix EXIF orientation
                    try:
                        img = ImageOps.exif_transpose(img)
                    except Exception:
                        pass
                    
                    width, height = img.size
                    
                    # Generate optimized web version (max 1920x1920) if not exists
                    if not os.path.exists(web_full_path):
                        img_web = img.copy()
                        if img_web.mode in ('RGBA', 'LA') or (img_web.mode == 'P' and 'transparency' in img_web.info):
                            # Keep alpha or convert
                            pass
                        elif img_web.mode != 'RGB':
                            img_web = img_web.convert('RGB')
                        
                        img_web.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                        img_web.save(web_full_path, 'WEBP', quality=88, method=4)
                    
                    # Generate fast thumbnail (max 480x480) if not exists
                    if not os.path.exists(thumb_full_path):
                        img_thumb = img.copy()
                        if img_thumb.mode not in ('RGB', 'RGBA'):
                            img_thumb = img_thumb.convert('RGB')
                        img_thumb.thumbnail((480, 480), Image.Resampling.LANCZOS)
                        img_thumb.save(thumb_full_path, 'WEBP', quality=80, method=3)

            except Exception as e:
                errors += 1
                print(f"Error processing {orig_path}: {e}")

            year, date_str = infer_year_and_date(fname, exif_dict)
            category = infer_category(folder, fname, year)
            
            aspect_ratio = round(width / height, 2) if (width and height and height > 0) else 1.0
            orientation = 'landscape' if aspect_ratio > 1.1 else ('portrait' if aspect_ratio < 0.9 else 'square')
            
            status = 'confirmed' if year is not None else 'needs_confirmation'

            # Clean readable title / caption
            caption_clean = re.sub(r'(\.jpg|\.jpeg|\.png|\.heic|\.heif)', '', fname, flags=re.IGNORECASE)
            caption_clean = caption_clean.replace('_', ' ').replace('-', ' ').strip()
            
            entry = {
                'id': safe_slug,
                'sourceFolder': folder,
                'originalFilename': fname,
                'originalPath': orig_path.replace('\\', '/'),
                'optimizedPath': web_rel_path,
                'thumbnailPath': thumb_rel_path,
                'fileSize': file_size,
                'fileSizeFormatted': format_bytes(file_size),
                'format': img_format,
                'width': width,
                'height': height,
                'aspectRatio': aspect_ratio,
                'orientation': orientation,
                'year': year,
                'dateString': date_str,
                'category': category,
                'caption': caption_clean,
                'status': status
            }
            
            inventory.append(entry)
            asset_mapping['by_folder'][folder].append(entry)
            
            if year:
                y_str = str(year)
                if y_str not in asset_mapping['by_year']:
                    asset_mapping['by_year'][y_str] = []
                asset_mapping['by_year'][y_str].append(entry)
            
            if category not in asset_mapping['by_category']:
                asset_mapping['by_category'][category] = []
            asset_mapping['by_category'][category].append(entry)

            if idx % 50 == 0:
                print(f"  Processed {idx}/{len(files)} in {folder}...")

    # Write out inventory and asset mapping JSON files
    with open('data/photo_inventory.json', 'w', encoding='utf-8') as f:
        json.dump(inventory, f, indent=2, ensure_ascii=False)
        
    with open('data/asset_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(asset_mapping, f, indent=2, ensure_ascii=False)

    print(f"\nAudit complete!")
    print(f"Total files audited: {total_files}")
    print(f"Errors encountered: {errors}")
    print(f"Inventory saved to data/photo_inventory.json ({len(inventory)} entries)")
    print(f"Asset mapping saved to data/asset_mapping.json")

if __name__ == '__main__':
    process_all_photos()
