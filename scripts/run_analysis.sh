#!/bin/bash

# Berkeley Goggles Percentile Analysis Runner
# This script sets up the environment and runs the percentile distribution analysis

echo "🚀 Berkeley Goggles Percentile Analysis"
echo "======================================"

# Set the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Default database path
DEFAULT_DB_PATH="$PROJECT_ROOT/backend/prisma/dev.db"

# Check if database exists
if [ ! -f "$DEFAULT_DB_PATH" ]; then
    echo "❌ Database not found at: $DEFAULT_DB_PATH"
    echo "Please ensure the database exists or provide a custom path:"
    echo "  python3 $SCRIPT_DIR/percentile_analysis.py --db-path /path/to/your/database.db"
    exit 1
fi

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    echo "Please install pip3 and try again."
    exit 1
fi

echo "🔍 Checking Python dependencies..."

# Install requirements if they don't exist
python3 -c "import pandas, numpy, matplotlib, seaborn" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing required Python packages..."
    pip3 install -r "$SCRIPT_DIR/requirements.txt"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please install manually:"
        echo "  pip3 install -r $SCRIPT_DIR/requirements.txt"
        exit 1
    fi
else
    echo "✅ All dependencies are available"
fi

# Create output directory
OUTPUT_DIR="$PROJECT_ROOT/analysis_output"
mkdir -p "$OUTPUT_DIR"

echo "📊 Running analysis..."
echo "   Database: $DEFAULT_DB_PATH"
echo "   Output: $OUTPUT_DIR"
echo ""

# Run the analysis
python3 "$SCRIPT_DIR/percentile_analysis.py" \
    --db-path "$DEFAULT_DB_PATH" \
    --output-dir "$OUTPUT_DIR" \
    "$@"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Analysis completed successfully!"
    echo "📂 Check the output directory: $OUTPUT_DIR"
    
    # Open output directory if on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "🔍 Opening output directory..."
        open "$OUTPUT_DIR"
    fi
else
    echo ""
    echo "❌ Analysis failed. Please check the error messages above."
    exit 1
fi