# Berkeley Goggles - Percentile Distribution Analysis

This directory contains scripts for analyzing the percentile distribution of all ranked datapoints in the Berkeley Goggles database.

## Files

- **`percentile_analysis.py`** - Main Python script for data analysis and visualization
- **`run_analysis.sh`** - Shell script for easy execution with dependency management
- **`requirements.txt`** - Python dependencies required for the analysis
- **`README.md`** - This documentation file

## Quick Start

### Option 1: Using the Shell Script (Recommended)

```bash
# Run with default settings
./scripts/run_analysis.sh

# The script will:
# - Check and install Python dependencies
# - Use the default database path (backend/prisma/dev.db)
# - Create output in analysis_output/
# - Open the results folder on macOS
```

### Option 2: Using Python Directly

```bash
# Install dependencies
pip3 install -r scripts/requirements.txt

# Run analysis
python3 scripts/percentile_analysis.py --db-path backend/prisma/dev.db --output-dir analysis_output

# Generate report only (no visualization)
python3 scripts/percentile_analysis.py --no-viz
```

## Command Line Options

```bash
python3 scripts/percentile_analysis.py [OPTIONS]

Options:
  --db-path, -d PATH      Path to SQLite database file (default: backend/prisma/dev.db)
  --output-dir, -o DIR    Output directory for generated files (default: output)
  --no-viz               Skip visualization generation (generate report only)
  --help, -h             Show help message
```

## What It Analyzes

The script analyzes percentile distributions for:

1. **User Photo Rankings** - Rankings for user-uploaded photos
2. **Sample Image Rankings** - Rankings for curated sample images
3. **Combined Rankings** - Unified rankings combining both user photos and sample images

## Generated Output

### Visualizations

The script generates a comprehensive 9-panel visualization showing:

1. **Distribution Comparison** - Histogram comparing all ranking types
2. **Box Plot Comparison** - Box plots showing quartiles and outliers
3. **Gender-based Distribution** - Percentile distributions by gender
4. **Percentile vs Comparisons** - Scatter plot showing relationship between percentile and number of comparisons
5. **Bradley-Terry Score vs Percentile** - Scatter plot of ranking algorithm scores
6. **Confidence vs Percentile** - Relationship between confidence scores and percentiles
7. **Percentile Bands** - Bar chart showing distribution across percentile ranges
8. **Win Rate Distribution** - Histogram of win rates for all items
9. **Summary Statistics** - Text summary of key metrics

### Output Files

- **PNG Image**: High-resolution visualization (300 DPI)
- **PDF Version**: Vector graphics version for printing/publishing
- **Text Report**: Detailed statistical analysis and insights

## Statistical Metrics

For each dataset, the analysis provides:

- **Descriptive Statistics**: Count, mean, median, standard deviation, range, quartiles
- **Distribution Shape**: Skewness and kurtosis measurements
- **Gender Breakdown**: Statistics broken down by gender (when available)
- **Confidence Analysis**: Items with high confidence scores
- **Comparison Volume**: Items with many comparisons

## Example Results

Based on current database (306 sample images):
- Mean percentile: 50.16
- Standard deviation: 28.91
- Range: 0.30 - 100.00
- Perfect normal distribution (skewness: 0.000)

## Requirements

- Python 3.7+
- Required packages: pandas, numpy, matplotlib, seaborn
- SQLite database with Berkeley Goggles schema

## Database Schema Compatibility

The script expects these tables:
- `photo_rankings` - User photo percentile data
- `sample_image_rankings` - Sample image percentile data  
- `combined_rankings` - Unified percentile data
- `photos`, `sample_images`, `users` - Reference tables for metadata

## Troubleshooting

### Database Not Found
```bash
❌ Database file not found: /path/to/database.db
```
**Solution**: Check that the database path is correct and the file exists.

### Missing Python Dependencies
```bash
❌ Missing packages
```
**Solution**: Install dependencies with `pip3 install -r scripts/requirements.txt`

### Permission Errors
```bash
❌ Permission denied
```
**Solution**: Make sure the script is executable with `chmod +x scripts/run_analysis.sh`

## Customization

### Custom Database Path
```bash
python3 scripts/percentile_analysis.py --db-path /path/to/your/database.db
```

### Different Output Directory
```bash
python3 scripts/percentile_analysis.py --output-dir /path/to/output/
```

### Report Only (No Graphs)
```bash
python3 scripts/percentile_analysis.py --no-viz
```

## Advanced Usage

### Batch Analysis
```bash
# Analyze multiple databases
for db in *.db; do
    python3 scripts/percentile_analysis.py --db-path "$db" --output-dir "analysis_$db"
done
```

### Automated Reports
```bash
# Add to cron for regular analysis
0 6 * * * cd /path/to/elo_check && ./scripts/run_analysis.sh > /var/log/percentile_analysis.log 2>&1
```

## Output Interpretation

### Distribution Shape
- **Skewness = 0**: Perfect normal distribution
- **Skewness > 0**: Right-skewed (tail extends toward higher percentiles)
- **Skewness < 0**: Left-skewed (tail extends toward lower percentiles)

### Kurtosis
- **Kurtosis = 0**: Normal distribution shape
- **Kurtosis > 0**: More peaked than normal (leptokurtic)
- **Kurtosis < 0**: Flatter than normal (platykurtic)

### Percentile Bands
- **Top 10%**: Elite performers (90-100th percentile)
- **High (75-90%)**: Above average performers
- **Above Average (50-75%)**: Better than median
- **Below Average (25-50%)**: Worse than median
- **Low (10-25%)**: Below average performers  
- **Bottom 10%**: Lowest performers (0-10th percentile)

---

For questions or issues, please check the troubleshooting section or review the generated logs.