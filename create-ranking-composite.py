#!/usr/bin/env python3
"""
Create a large composite image showing all ranked sample images in order
"""

import json
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import os
from urllib.parse import urlparse
import math

def download_image(url, max_retries=3):
    """Download an image from URL with retries"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content))
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed for {url}: {e}")
            if attempt == max_retries - 1:
                return None
    return None

def create_ranking_composite():
    """Create composite image of all ranked images"""
    
    # Load the ranking data
    json_path = './analysis_output/all_ranked_images.json'
    if not os.path.exists(json_path):
        print("❌ Please run the ranking script first to generate all_ranked_images.json")
        return
    
    with open(json_path, 'r') as f:
        ranked_images = json.load(f)
    
    print(f"🏆 Creating composite image for {len(ranked_images)} ranked images...")
    
    # Configuration
    thumbnail_size = (150, 150)  # Size for each thumbnail
    images_per_row = 10  # Number of images per row
    margin = 10  # Margin between images
    text_height = 60  # Height reserved for text under each image
    
    # Calculate grid dimensions
    num_rows = math.ceil(len(ranked_images) / images_per_row)
    
    # Calculate canvas size
    canvas_width = (thumbnail_size[0] + margin) * images_per_row - margin
    canvas_height = (thumbnail_size[1] + text_height + margin) * num_rows - margin
    
    # Add header space
    header_height = 100
    total_height = canvas_height + header_height
    
    print(f"📏 Canvas size: {canvas_width}x{total_height} pixels")
    print(f"📐 Grid: {images_per_row} columns × {num_rows} rows")
    
    # Create the canvas
    canvas = Image.new('RGB', (canvas_width, total_height), 'white')
    draw = ImageDraw.Draw(canvas)
    
    # Try to load a font
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
        font_small = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 12)
    except:
        try:
            font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
            font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
    
    # Draw header
    title = f"Bradley-Terry Ranked Sample Images (1-{len(ranked_images)})"
    subtitle = f"Highest to Lowest Scores • Range: {ranked_images[-1]['score']:.3f} - {ranked_images[0]['score']:.3f}"
    
    # Center the title
    title_bbox = draw.textbbox((0, 0), title, font=font_large)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (canvas_width - title_width) // 2
    
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=font_small)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (canvas_width - subtitle_width) // 2
    
    draw.text((title_x, 20), title, fill='black', font=font_large)
    draw.text((subtitle_x, 55), subtitle, fill='gray', font=font_small)
    
    # Download and place images
    for i, img_data in enumerate(ranked_images):
        row = i // images_per_row
        col = i % images_per_row
        
        # Calculate position
        x = col * (thumbnail_size[0] + margin)
        y = header_height + row * (thumbnail_size[1] + text_height + margin)
        
        print(f"  Processing #{img_data['rank']}: Score {img_data['score']:.3f}...")
        
        # Download the image
        img = download_image(img_data['url'])
        
        if img is None:
            # Create placeholder for failed downloads
            img = Image.new('RGB', thumbnail_size, 'lightgray')
            placeholder_draw = ImageDraw.Draw(img)
            placeholder_draw.text((10, 70), "Image\nUnavailable", fill='darkgray', font=font_small)
        else:
            # Resize image to thumbnail, maintaining aspect ratio
            img.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
            
            # Center the image if it's smaller than thumbnail_size
            if img.size != thumbnail_size:
                centered_img = Image.new('RGB', thumbnail_size, 'white')
                paste_x = (thumbnail_size[0] - img.size[0]) // 2
                paste_y = (thumbnail_size[1] - img.size[1]) // 2
                centered_img.paste(img, (paste_x, paste_y))
                img = centered_img
        
        # Paste the image
        canvas.paste(img, (x, y))
        
        # Add ranking info below the image
        rank_text = f"#{img_data['rank']}"
        score_text = f"{img_data['score']:.3f}"
        record_text = f"{img_data['wins']}-{img_data['losses']}"
        win_rate_text = f"{img_data['winRate']:.0f}%"
        
        text_y = y + thumbnail_size[1] + 5
        
        # Rank (bold/larger)
        draw.text((x, text_y), rank_text, fill='blue', font=font_small)
        
        # Score
        draw.text((x, text_y + 15), score_text, fill='red', font=font_small)
        
        # Record and win rate
        draw.text((x, text_y + 30), record_text, fill='black', font=font_small)
        draw.text((x, text_y + 45), win_rate_text, fill='green', font=font_small)
    
    # Save the composite image
    output_path = './analysis_output/bradley_terry_ranking_composite.png'
    canvas.save(output_path, 'PNG', quality=95, optimize=True)
    
    # Also save a smaller version
    small_canvas = canvas.copy()
    small_canvas.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
    small_output_path = './analysis_output/bradley_terry_ranking_composite_small.png'
    small_canvas.save(small_output_path, 'PNG', quality=90, optimize=True)
    
    print(f"\n✅ Composite images created:")
    print(f"   Full size: {output_path}")
    print(f"   Small version: {small_output_path}")
    print(f"   Canvas size: {canvas_width}x{total_height} pixels")
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
    
    create_ranking_composite()