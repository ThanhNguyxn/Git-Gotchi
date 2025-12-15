#!/usr/bin/env python3
"""
🎨 Image to Sprite Converter
============================
Converts pixel art images to the sprite string format used in Git-Gotchi.

Usage:
  python image_to_sprite.py <image> [options]

Examples:
  # Basic usage - output to console
  python image_to_sprite.py trex.png
  
  # Specify output size
  python image_to_sprite.py trex.png --size 16
  
  # Save to file
  python image_to_sprite.py trex.png -o output.txt
  
  # Custom color mapping
  python image_to_sprite.py trex.png --base-char "X" --light-char "G"
  
  # Preview only (no JS format)
  python image_to_sprite.py trex.png --preview

Author: ThanhNguyxn
Version: 1.0.0
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow library required. Install with: pip install Pillow")
    sys.exit(1)


class SpriteConverter:
    """Converts images to sprite string format."""
    
    DEFAULT_COLORS = {
        'outline': 'K',      # Black outline
        'base': 'X',         # Main body color
        'light': 'G',        # Lighter variant (belly, highlights)
        'white': 'W',        # White
        'red': 'R',          # Red
        'orange': 'O',       # Orange
        'yellow': 'Y',       # Yellow
        'blue': 'B',         # Blue
        'purple': 'P',       # Purple
        'background': ' ',   # Transparent/background
    }
    
    def __init__(self, size=16, colors=None):
        self.size = size
        self.colors = colors or self.DEFAULT_COLORS.copy()
    
    def get_bounding_box(self, img):
        """Find the bounding box of non-background pixels."""
        width, height = img.size
        min_x, min_y = width, height
        max_x, max_y = 0, 0
        
        for y in range(height):
            for x in range(width):
                pixel = img.getpixel((x, y))
                if not self._is_background(pixel):
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)
        
        if min_x > max_x:
            return (0, 0, width, height)
        return (min_x, min_y, max_x + 1, max_y + 1)
    
    def _is_background(self, pixel):
        """Check if a pixel is background (transparent or white)."""
        r, g, b = pixel[:3]
        alpha = pixel[3] if len(pixel) > 3 else 255
        return alpha < 128 or (r > 230 and g > 230 and b > 230)
    
    def _classify_pixel(self, pixel):
        """Classify a pixel to a sprite character."""
        r, g, b = pixel[:3]
        alpha = pixel[3] if len(pixel) > 3 else 255
        
        # Background
        if alpha < 128 or (r > 230 and g > 230 and b > 230):
            return self.colors['background']
        
        # Black/dark outline
        if r < 60 and g < 60 and b < 60:
            return self.colors['outline']
        
        # White
        if r > 240 and g > 240 and b > 240:
            return self.colors['white']
        
        # Red
        if r > 180 and g < 100 and b < 100:
            return self.colors['red']
        
        # Orange
        if r > 200 and g > 100 and g < 200 and b < 100:
            return self.colors['orange']
        
        # Yellow
        if r > 200 and g > 200 and b < 100:
            return self.colors['yellow']
        
        # Blue
        if b > r and b > g and b > 150:
            return self.colors['blue']
        
        # Purple
        if r > 100 and b > 100 and g < 100:
            return self.colors['purple']
        
        # Brightness-based classification for body colors
        brightness = (r + g + b) / 3
        if brightness > 140:
            return self.colors['light']
        elif brightness > 50:
            return self.colors['base']
        else:
            return self.colors['outline']
    
    def convert(self, image_path):
        """Convert an image file to sprite lines."""
        img = Image.open(image_path)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Crop to content
        bbox = self.get_bounding_box(img)
        cropped = img.crop(bbox)
        
        # Resize maintaining aspect ratio
        aspect = cropped.width / cropped.height
        if aspect > 1:
            new_w = self.size
            new_h = max(1, int(self.size / aspect))
        else:
            new_h = self.size
            new_w = max(1, int(self.size * aspect))
        
        resized = cropped.resize((new_w, new_h), Image.NEAREST)
        
        # Center on canvas
        final = Image.new('RGBA', (self.size, self.size), (255, 255, 255, 0))
        offset_x = (self.size - new_w) // 2
        offset_y = (self.size - new_h) // 2
        final.paste(resized, (offset_x, offset_y))
        
        # Convert to sprite
        sprite_lines = []
        for y in range(self.size):
            line = ""
            for x in range(self.size):
                pixel = final.getpixel((x, y))
                char = self._classify_pixel(pixel)
                line += char
            sprite_lines.append(line)
        
        return {
            'lines': sprite_lines,
            'original_size': img.size,
            'bbox': bbox,
            'cropped_size': cropped.size,
            'final_size': (new_w, new_h),
        }
    
    def format_for_js(self, sprite_lines, indent=6, name=None):
        """Format sprite lines as JavaScript array."""
        indent_str = " " * indent
        
        output = ""
        if name:
            output += f"{indent_str[:-2]}{name}: [\n"
        else:
            output += "[\n"
        
        for line in sprite_lines:
            output += f'{indent_str}"{line}",\n'
        output = output.rstrip(",\n") + "\n"
        output += " " * (indent - 2) + "]"
        
        if name:
            output += ","
        
        return output
    
    def format_preview(self, sprite_lines):
        """Format sprite lines for ASCII preview."""
        symbols = {
            ' ': '.',
            'K': '@',
            'X': '#',
            'G': '+',
            'W': 'O',
            'R': 'R',
            'O': 'o',
            'Y': '*',
            'B': '~',
            'P': '%',
        }
        
        output = []
        for line in sprite_lines:
            preview = ''.join(symbols.get(c, c) for c in line)
            output.append(f"{line}  |  {preview}")
        return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(
        description='🎨 Convert pixel art images to Git-Gotchi sprite format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s trex.png                    # Basic conversion
  %(prog)s trex.png --size 16          # Specify size
  %(prog)s trex.png -o sprite.txt      # Save to file
  %(prog)s trex.png --name "normal"    # Add sprite name
  %(prog)s trex.png --preview          # ASCII preview only

Color Legend:
  K = Black (outline)     X = Base color (body)
  G = Light color (belly) W = White
  R = Red                 O = Orange
  Y = Yellow              B = Blue
  P = Purple              (space) = Transparent
        """
    )
    
    parser.add_argument('image', help='Path to the input image')
    parser.add_argument('--size', '-s', type=int, default=16,
                        help='Output sprite size (default: 16)')
    parser.add_argument('--output', '-o', help='Save output to file')
    parser.add_argument('--name', '-n', help='Sprite name for JS output')
    parser.add_argument('--preview', '-p', action='store_true',
                        help='Show ASCII preview only')
    parser.add_argument('--indent', '-i', type=int, default=6,
                        help='Indentation for JS output (default: 6)')
    parser.add_argument('--quiet', '-q', action='store_true',
                        help='Suppress info messages')
    
    args = parser.parse_args()
    
    # Check if image exists
    if not Path(args.image).exists():
        print(f"Error: File not found: {args.image}")
        sys.exit(1)
    
    # Convert
    converter = SpriteConverter(size=args.size)
    
    if not args.quiet:
        print(f"🎨 Converting: {args.image}")
        print(f"   Target size: {args.size}x{args.size}")
    
    result = converter.convert(args.image)
    
    if not args.quiet:
        print(f"   Original: {result['original_size']}")
        print(f"   Cropped:  {result['cropped_size']}")
        print(f"   Final:    {result['final_size']}")
        print()
    
    # Generate output
    output_parts = []
    
    # ASCII Preview
    if args.preview or not args.quiet:
        output_parts.append("--- ASCII Preview ---")
        output_parts.append(converter.format_preview(result['lines']))
    
    # JS Format
    if not args.preview:
        output_parts.append("\n--- JavaScript Format ---")
        output_parts.append(converter.format_for_js(
            result['lines'], 
            indent=args.indent,
            name=args.name
        ))
    
    output = '\n'.join(output_parts)
    
    # Save or print
    if args.output:
        Path(args.output).write_text(output)
        print(f"✅ Saved to: {args.output}")
    else:
        print(output)
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
