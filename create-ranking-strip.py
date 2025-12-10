#!/usr/bin/env python3
"""
Create a horizontal strip showing all ranked sample images in order
"""

import json
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import os

def download_image(url, max_retries=3):
    """Download an image from URL with retries"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content))
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed: {e}")
            if attempt == max_retries - 1:
                return None
    return None

def create_ranking_strip():
    """Create horizontal strip of all ranked images"""
    
    # Load the ranking data
    json_path = './analysis_output/all_ranked_images.json'
    if not os.path.exists(json_path):
        print("❌ Please run the ranking script first to generate all_ranked_images.json")
        return
    
    with open(json_path, 'r') as f:
        ranked_images = json.load(f)
    
    print(f"🏆 Creating horizontal strip for {len(ranked_images)} ranked images...")
    
    # Configuration
    thumbnail_height = 200  # Fixed height for all images
    margin = 5  # Small margin between images
    text_height = 80  # Height for text below images
    
    # Calculate total width needed
    total_width = 0
    processed_images = []
    
    print("📥 Downloading and processing images...")
    
    for i, img_data in enumerate(ranked_images):
        print(f"  Processing #{img_data['rank']}: Score {img_data['score']:.3f}...")
        
        # Download the image
        img = download_image(img_data['url'])
        
        if img is None:
            # Create placeholder for failed downloads
            thumbnail_width = 150  # Default width for placeholder
            img = Image.new('RGB', (thumbnail_width, thumbnail_height), 'lightgray')
            draw = ImageDraw.Draw(img)
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 16)
            except:
                font = ImageFont.load_default()
            draw.text((10, thumbnail_height//2 - 20), "Image\nUnavailable", fill='darkgray', font=font)
        else:
            # Resize image maintaining aspect ratio, fixed height
            aspect_ratio = img.width / img.height
            thumbnail_width = int(thumbnail_height * aspect_ratio)
            img = img.resize((thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS)
        
        processed_images.append({
            'image': img,
            'width': thumbnail_width,
            'data': img_data
        })
        
        total_width += thumbnail_width + margin
    
    # Remove the last margin
    total_width -= margin
    
    # Create canvas
    canvas_height = thumbnail_height + text_height + 60  # Extra space for header
    canvas = Image.new('RGB', (total_width, canvas_height), 'white')
    draw = ImageDraw.Draw(canvas)
    
    # Load fonts
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 20)
        font_small = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 12)
    except:
        font_title = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Draw title
    title = f"Bradley-Terry Ranked Sample Images (Highest → Lowest Scores)"
    draw.text((10, 10), title, fill='black', font=font_title)
    
    subtitle = f"Score Range: {ranked_images[0]['score']:.3f} → {ranked_images[-1]['score']:.3f}"
    draw.text((10, 35), subtitle, fill='gray', font=font_small)
    
    # Place images horizontally
    current_x = 0
    header_offset = 60
    
    for proc_img in processed_images:
        img = proc_img['image']
        width = proc_img['width']
        data = proc_img['data']
        
        # Paste the image
        canvas.paste(img, (current_x, header_offset))
        
        # Add text below image
        text_y = header_offset + thumbnail_height + 5
        
        # Ranking and score
        rank_text = f"#{data['rank']}"
        score_text = f"{data['score']:.3f}"
        record_text = f"{data['wins']}-{data['losses']}"
        win_rate_text = f"{data['winRate']:.0f}%"
        
        # Center text under image
        text_x = current_x + width // 2
        
        # Draw text (centered)
        rank_bbox = draw.textbbox((0, 0), rank_text, font=font_small)
        rank_width = rank_bbox[2] - rank_bbox[0]
        draw.text((text_x - rank_width//2, text_y), rank_text, fill='blue', font=font_small)
        
        score_bbox = draw.textbbox((0, 0), score_text, font=font_small)
        score_width = score_bbox[2] - score_bbox[0]
        draw.text((text_x - score_width//2, text_y + 15), score_text, fill='red', font=font_small)
        
        record_bbox = draw.textbbox((0, 0), record_text, font=font_small)
        record_width = record_bbox[2] - record_bbox[0]
        draw.text((text_x - record_width//2, text_y + 30), record_text, fill='black', font=font_small)
        
        win_bbox = draw.textbbox((0, 0), win_rate_text, font=font_small)
        win_width = win_bbox[2] - win_bbox[0]
        draw.text((text_x - win_width//2, text_y + 45), win_rate_text, fill='green', font=font_small)
        
        current_x += width + margin
    
    # Save the strip
    output_path = './analysis_output/bradley_terry_ranking_strip.png'
    canvas.save(output_path, 'PNG', quality=95, optimize=True)
    
    # Create a smaller version for easier viewing
    if total_width > 4000:  # If very wide, create smaller version
        small_canvas = canvas.copy()
        scale_factor = 4000 / total_width
        new_width = 4000
        new_height = int(canvas_height * scale_factor)
        small_canvas = small_canvas.resize((new_width, new_height), Image.Resampling.LANCZOS)
        small_output_path = './analysis_output/bradley_terry_ranking_strip_small.png'
        small_canvas.save(small_output_path, 'PNG', quality=90, optimize=True)
        
        print(f"\n✅ Ranking strip created:")
        print(f"   Full size: {output_path}")
        print(f"   Small version: {small_output_path}")
        print(f"   Dimensions: {total_width}x{canvas_height} pixels")
        print(f"   File size: {os.path.getsize(output_path) / 1024 / 1024:.1f} MB")
    else:
        print(f"\n✅ Ranking strip created:")
        print(f"   File: {output_path}")
        print(f"   Dimensions: {total_width}x{canvas_height} pixels")
        print(f"   File size: {os.path.getsize(output_path) / 1024 / 1024:.1f} MB")
    
    return output_path

if __name__ == "__main__":
    # Check if required packages are available
    try:
        import requests
        from PIL import Image, ImageDraw, ImageFont
    except ImportError as e:
        print("❌ Missing required packages. Please install:")
        print("   pip install pillow requests")
        print(f"   Error: {e}")
        exit(1)
    
    create_ranking_strip()