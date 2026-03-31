"""
Generate placeholder images for surveillance cameras
"""
from PIL import Image, ImageDraw, ImageFont
import os
import random

def create_camera_frame(width, height, camera_name, location, frame_num, output_path):
    """Create a placeholder image for a camera frame"""

    # Create image with dark background
    img = Image.new('RGB', (width, height), color='#1a2332')
    draw = ImageDraw.Draw(img)

    # Try to use a system font, fallback to default
    try:
        title_font = ImageFont.truetype("arial.ttf", 32)
        text_font = ImageFont.truetype("arial.ttf", 20)
        small_font = ImageFont.truetype("arial.ttf", 16)
    except:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    # Draw title
    title = f"{camera_name}"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    draw.text(((width - title_width) // 2, 20), title, fill='#00d4ff', font=title_font)

    # Draw location
    location_text = f"📍 {location}"
    bbox = draw.textbbox((0, 0), location_text, font=text_font)
    loc_width = bbox[2] - bbox[0]
    draw.text(((width - loc_width) // 2, 60), location_text, fill='#8899aa', font=text_font)

    # Draw timestamp simulation
    timestamp = f"Frame {frame_num:02d}/10"
    bbox = draw.textbbox((0, 0), timestamp, font=small_font)
    ts_width = bbox[2] - bbox[0]
    draw.text(((width - ts_width) // 2, height - 40), timestamp, fill='#8899aa', font=small_font)

    # Draw time indicator
    time_text = f"13:2{frame_num}:00"
    draw.text((20, height - 40), time_text, fill='#00d4ff', font=small_font)

    # Draw recording indicator
    draw.ellipse((width - 80, height - 45, width - 60, height - 25), fill='#ff4444')
    draw.text((width - 55, height - 40), "REC", fill='#ff4444', font=small_font)

    # Draw camera-specific elements based on camera name
    if "Eingang" in camera_name:
        # Draw a door
        draw.rectangle((width//2 - 60, height//2 - 40, width//2 + 60, height//2 + 80),
                      fill='#3a4a62', outline='#5a6a82', width=3)
        # Door handle
        draw.ellipse((width//2 + 30, height//2 + 15, width//2 + 40, height//2 + 25), fill='#ffd700')
        # Add some variation per frame
        if frame_num % 3 == 0:
            # Person silhouette
            draw.ellipse((width//2 - 120, height//2 - 20, width//2 - 90, height//2 + 10), fill='#4a5a72')
            draw.rectangle((width//2 - 125, height//2 + 10, width//2 - 85, height//2 + 60), fill='#4a5a72')

    elif "Garten" in camera_name:
        # Draw grass/ground
        draw.rectangle((0, height//2 + 50, width, height - 80), fill='#2d4a2d')
        # Draw tree
        draw.rectangle((width//2 + 100, height//2 - 20, width//2 + 120, height//2 + 50), fill='#5a4a3a')
        draw.ellipse((width//2 + 70, height//2 - 60, width//2 + 150, height//2 + 20), fill='#3a5a3a')
        # Add fence
        for i in range(5):
            x = 50 + i * 120
            draw.rectangle((x, height//2 + 20, x + 10, height//2 + 70), fill='#5a4a3a')
        # Occasional bird or movement
        if frame_num % 4 == 0:
            bird_x = 100 + frame_num * 50
            draw.ellipse((bird_x, 100, bird_x + 20, 110), fill='#4a4a4a')

    elif "Garage" in camera_name:
        # Draw garage interior
        draw.rectangle((50, height//2 - 30, width - 50, height - 80), fill='#2a2a3a', outline='#4a4a5a', width=2)
        # Car outline
        draw.rectangle((150, height//2 + 20, width - 150, height//2 + 80), fill='#4a5a6a', outline='#6a7a8a', width=2)
        # Car windows
        draw.rectangle((200, height//2 + 25, 350, height//2 + 50), fill='#2a3a4a')
        draw.rectangle((width - 350, height//2 + 25, width - 200, height//2 + 50), fill='#2a3a4a')
        # Wheels
        draw.ellipse((180, height//2 + 70, 220, height - 90), fill='#1a1a2a')
        draw.ellipse((width - 220, height//2 + 70, width - 180, height - 90), fill='#1a1a2a')

    # Draw grid overlay (typical for surveillance cameras)
    grid_color = '#ffffff'
    for i in range(1, 3):
        y = height * i // 3
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)
    for i in range(1, 3):
        x = width * i // 3
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)

    # Save image
    img.save(output_path, 'JPEG', quality=85)
    print(f"Created: {output_path}")

def main():
    cameras = [
        ("Eingangsbereich", "Haustür", "cam1"),
        ("Garten", "Hinterhof", "cam2"),
        ("Garage", "Garage Innenbereich", "cam3")
    ]

    base_path = "images"

    for camera_name, location, cam_id in cameras:
        camera_path = os.path.join(base_path, cam_id)
        os.makedirs(camera_path, exist_ok=True)

        print(f"\nGenerating images for {camera_name}...")
        for i in range(10):
            output_file = os.path.join(camera_path, f"{cam_id}_{i}.jpg")
            create_camera_frame(640, 360, camera_name, location, i, output_file)

    print("\n✅ All camera images generated successfully!")

if __name__ == "__main__":
    main()

