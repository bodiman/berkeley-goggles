#!/usr/bin/env python3
"""
Percentile Rank Graph - Simple ascending line graph

Creates a single graph showing users ordered by their percentile ranking,
displaying a strictly increasing line from lowest to highest percentile.
"""

import os
import sys
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import argparse
from datetime import datetime

def create_percentile_rank_graph(db_path: str, output_dir: str = "output"):
    """Create a simple ascending percentile rank graph."""
    
    # Connect to database
    try:
        conn = sqlite3.connect(db_path)
        print(f"✅ Connected to database: {db_path}")
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        sys.exit(1)
    
    # Query to get all ranked items
    query = """
    SELECT 
        cr.current_percentile,
        CASE 
            WHEN cr.photo_id IS NOT NULL THEN 'User Photo'
            WHEN cr.sample_image_id IS NOT NULL THEN 'Sample Image'
            ELSE 'Unknown'
        END as item_type,
        cr.total_comparisons,
        cr.confidence
    FROM combined_rankings cr
    WHERE cr.total_comparisons > 0
    ORDER BY cr.current_percentile ASC
    """
    
    try:
        df = pd.read_sql_query(query, conn)
        print(f"📊 Fetched {len(df)} ranked items")
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        conn.close()
        return
    finally:
        conn.close()
    
    if df.empty:
        print("❌ No ranking data found in database")
        return
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Create the graph
    plt.figure(figsize=(12, 8))
    
    # Sort by percentile (should already be sorted from SQL ORDER BY)
    df_sorted = df.sort_values('current_percentile').reset_index(drop=True)
    
    # Create rank numbers (1, 2, 3, ... n) - each user gets a unique rank
    # even if they have the same percentile (ties)
    ranks = range(1, len(df_sorted) + 1)
    percentiles = df_sorted['current_percentile'].values
    
    print(f"📊 Data analysis:")
    print(f"   Total items: {len(df_sorted)}")
    print(f"   Unique percentiles: {len(df_sorted['current_percentile'].unique())}")
    print(f"   Tied users: {len(df_sorted) - len(df_sorted['current_percentile'].unique())}")
    
    # Plot the strictly increasing line
    plt.plot(ranks, percentiles, 'b-', linewidth=2, alpha=0.8)
    plt.fill_between(ranks, percentiles, alpha=0.3)
    
    # Customize the plot
    plt.xlabel('Rank (User/Item Number)', fontsize=12, fontweight='bold')
    plt.ylabel('Percentile', fontsize=12, fontweight='bold')
    plt.title('Percentile Distribution: Users Ordered by Ranking\n(Strictly Increasing)', 
              fontsize=14, fontweight='bold', pad=20)
    
    # Add grid
    plt.grid(True, alpha=0.3, linestyle='--')
    
    # Set y-axis to 0-100 for percentiles
    plt.ylim(0, 100)
    plt.xlim(1, len(ranks))
    
    # Add percentile reference lines
    for pct in [10, 25, 50, 75, 90]:
        plt.axhline(y=pct, color='red', linestyle=':', alpha=0.5, linewidth=1)
        plt.text(len(ranks) * 0.98, pct + 1, f'{pct}th', 
                ha='right', va='bottom', fontsize=9, alpha=0.7)
    
    # Add summary statistics
    mean_pct = percentiles.mean()
    median_pct = percentiles[len(percentiles)//2]
    
    # Add text box with stats
    stats_text = f'Total Items: {len(df):,}\n'
    stats_text += f'Mean Percentile: {mean_pct:.1f}\n'
    stats_text += f'Median Percentile: {median_pct:.1f}\n'
    stats_text += f'Range: {percentiles.min():.1f} - {percentiles.max():.1f}'
    
    plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes,
            fontsize=10, verticalalignment='top', fontfamily='monospace',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
    
    # Highlight different item types if we have both
    if len(df['item_type'].unique()) > 1:
        for i, item_type in enumerate(df['item_type'].unique()):
            type_data = df[df['item_type'] == item_type]
            type_ranks = []
            type_percentiles = []
            
            for idx, row in type_data.iterrows():
                # Find the rank of this item in the sorted list
                rank_pos = df_sorted.index[df_sorted['current_percentile'] == row['current_percentile']][0] + 1
                type_ranks.append(rank_pos)
                type_percentiles.append(row['current_percentile'])
            
            # Add scatter points to distinguish types
            colors = ['red', 'green', 'orange', 'purple']
            plt.scatter(type_ranks, type_percentiles, 
                       label=f'{item_type} ({len(type_data)})', 
                       alpha=0.6, s=20, color=colors[i % len(colors)])
        
        plt.legend(loc='lower right')
    
    # Tight layout
    plt.tight_layout()
    
    # Save the graph
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(output_dir, f"percentile_rank_graph_{timestamp}.png")
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"💾 Percentile rank graph saved to: {output_file}")
    
    # Also save as PDF
    pdf_file = output_file.replace('.png', '.pdf')
    plt.savefig(pdf_file, bbox_inches='tight')
    print(f"💾 PDF version saved to: {pdf_file}")
    
    plt.show()
    
    # Print summary
    print("\n📈 Graph Summary:")
    print(f"   Total ranked items: {len(df):,}")
    print(f"   Percentile range: {percentiles.min():.1f} - {percentiles.max():.1f}")
    print(f"   Mean percentile: {mean_pct:.1f}")
    print(f"   Median percentile: {median_pct:.1f}")
    
    if len(df['item_type'].unique()) > 1:
        print("\n   Breakdown by type:")
        for item_type in df['item_type'].unique():
            count = len(df[df['item_type'] == item_type])
            print(f"     {item_type}: {count:,} items")
    
    return output_file

def main():
    """Main function."""
    parser = argparse.ArgumentParser(description='Create a percentile rank graph showing users ordered by percentile')
    parser.add_argument('--db-path', '-d', 
                       default='/Users/bodi/elo_check/backend/prisma/dev.db',
                       help='Path to SQLite database file')
    parser.add_argument('--output-dir', '-o', 
                       default='output',
                       help='Output directory for generated files')
    
    args = parser.parse_args()
    
    # Check if database file exists
    if not os.path.exists(args.db_path):
        print(f"❌ Database file not found: {args.db_path}")
        print("Please provide a valid database path using --db-path")
        sys.exit(1)
    
    print("🚀 Creating Percentile Rank Graph...")
    print(f"📁 Database: {args.db_path}")
    print(f"📂 Output Directory: {args.output_dir}")
    
    create_percentile_rank_graph(args.db_path, args.output_dir)
    
    print("\n✅ Graph generation complete!")

if __name__ == "__main__":
    main()