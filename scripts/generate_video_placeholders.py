import os
from PIL import Image, ImageDraw, ImageFont

target_dir = r'assets/illustrations'
os.makedirs(target_dir, exist_ok=True)

placeholders = [
    ("video_thumb_husband.webp", "Loving Husband", "Life Partner • Companionship & Love"),
    ("video_thumb_vikky.webp", "Vikky", "Eldest Son • Pride & Gratitude"),
    ("video_thumb_varshu.webp", "Varshu", "Daughter • Best Friend & Inspiration"),
    ("video_thumb_elders.webp", "Parents & Elders", "Sacred Blessings • Health & Prosperity"),
    ("video_thumb_family.webp", "Family Circle & Siblings", "Warm Wishes • Festivals & Memories"),
    ("video_thumb_friends.webp", "Cherished Friends", "Lifelong Memories • 50 Years of Friendship")
]

W, H = 800, 480

for filename, title, subtitle in placeholders:
    img = Image.new('RGB', (W, H), color=(7, 22, 46)) # Midnight Blue
    draw = ImageDraw.Draw(img)
    
    # Draw luxury gradient simulation & accents
    for y in range(H):
        r = int(7 + (23 - 7) * (y / H) + 10 * ((H - y) / H))
        g = int(22 + (78 - 22) * (y / H))
        b = int(46 + (167 - 46) * (y / H))
        draw.line([(0, y), (W, y)], fill=(r, g, b))
        
    # Draw elegant champagne gold border
    gold = (230, 211, 162)
    silver = (200, 214, 232)
    blue_glow = (139, 203, 250)
    
    draw.rectangle([16, 16, W - 17, H - 17], outline=gold, width=2)
    draw.rectangle([24, 24, W - 25, H - 25], outline=(36, 87, 167), width=1)
    
    # Draw center circle with play icon
    cx, cy = W // 2, H // 2 - 30
    cr = 54
    draw.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=(23, 78, 166, 180), outline=gold, width=2)
    
    # Play triangle
    tri = [
        (cx - 14, cy - 24),
        (cx - 14, cy + 24),
        (cx + 26, cy)
    ]
    draw.polygon(tri, fill=gold)
    
    # Text labels
    # We can use default font or scaled text
    try:
        font_title = ImageFont.truetype("arial.ttf", 32)
        font_sub = ImageFont.truetype("arial.ttf", 20)
        font_badge = ImageFont.truetype("arial.ttf", 15)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = font_title
        font_badge = font_title
        
    # Badge at top
    badge_text = "50TH BIRTHDAY VIDEO WISH"
    draw.text((cx, 60), badge_text, fill=silver, anchor="mm", font=font_badge)
    
    # Title and subtitle below icon
    draw.text((cx, cy + 90), title, fill=(247, 250, 255), anchor="mm", font=font_title)
    draw.text((cx, cy + 135), subtitle, fill=blue_glow, anchor="mm", font=font_sub)
    
    out_path = os.path.join(target_dir, filename)
    img.save(out_path, 'WEBP', quality=85)
    print(f"Created {out_path}")

print("All video placeholder thumbnails generated successfully!")
