#!/bin/bash

echo "🏆 Creating Bradley-Terry Ranking Composite Images"
echo "================================================="

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Check and install required packages
echo "📦 Checking Python packages..."
python3 -c "import PIL, requests" 2>/dev/null || {
    echo "📥 Installing required packages..."
    pip3 install pillow requests || {
        echo "❌ Failed to install packages. Please install manually:"
        echo "   pip3 install pillow requests"
        exit 1
    }
}

# Create output directory
mkdir -p analysis_output

# Check if ranking data exists
if [ ! -f "analysis_output/all_ranked_images.json" ]; then
    echo "❌ Ranking data not found. Please run the ranking script first:"
    echo "   cd backend && node show-rankings-public.js"
    exit 1
fi

echo "🎨 Creating composite images..."

# Create grid composite
echo "📐 Creating grid layout..."
python3 create-ranking-composite.py

# Create horizontal strip
echo "📏 Creating horizontal strip..."
python3 create-ranking-strip.py

echo ""
echo "✅ Composite images created in analysis_output/"
echo "   - bradley_terry_ranking_composite.png (grid layout)"
echo "   - bradley_terry_ranking_strip.png (horizontal strip)"
echo ""
echo "🖼️  Open the files to view your Bradley-Terry rankings!"