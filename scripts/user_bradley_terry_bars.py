#!/usr/bin/env python3
"""
User Bradley-Terry Score Bar Chart

Creates a bar chart where each bar represents an individual user
with their Bradley-Terry score, ordered by score.
"""

import sqlite3
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from datetime import datetime
import os

def create_user_bradley_terry_bar_chart(db_path: str = '/Users/bodi/elo_check/backend/prisma/dev.db', 
                                       output_dir: str = "analysis_output"):
    """Create bar chart of individual users and their Bradley-Terry scores."""
    
    # Connect and query
    try:
        conn = sqlite3.connect(db_path)
        print(f"✅ Connected to database: {db_path}")
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        return
    
    # Query for Bradley-Terry scores
    query = """
    SELECT 
        cr.bradley_terry_score,
        cr.current_percentile,
        cr.total_comparisons,
        cr.wins,
        cr.losses,
        CASE 
            WHEN cr.photo_id IS NOT NULL THEN cr.photo_id
            WHEN cr.sample_image_id IS NOT NULL THEN cr.sample_image_id
            ELSE 'unknown'
        END as item_id,
        CASE 
            WHEN cr.photo_id IS NOT NULL THEN 'User Photo'
            WHEN cr.sample_image_id IS NOT NULL THEN 'Sample Image'
            ELSE 'Unknown'
        END as item_type
    FROM combined_rankings cr
    WHERE cr.total_comparisons > 0
    ORDER BY cr.bradley_terry_score ASC
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
    
    # Sort by Bradley-Terry score
    df_sorted = df.sort_values('bradley_terry_score').reset_index(drop=True)
    
    print(f"📈 Creating bar chart for {len(df_sorted)} users...")
    print(f"   Score range: {df_sorted['bradley_terry_score'].min():.3f} - {df_sorted['bradley_terry_score'].max():.3f}")
    
    # Create the bar chart
    plt.figure(figsize=(16, 8))
    
    # Create user numbers (1, 2, 3, ... n)
    user_numbers = range(1, len(df_sorted) + 1)
    bradley_scores = df_sorted['bradley_terry_score'].values
    
    # Create bars
    bars = plt.bar(user_numbers, bradley_scores, width=0.8, alpha=0.7, edgecolor='black', linewidth=0.1)
    
    # Color bars based on score level
    for i, (bar, score) in enumerate(zip(bars, bradley_scores)):
        if score < 0.5:
            bar.set_color('red')  # Below average
        elif score == 0.5:
            bar.set_color('yellow')  # Neutral
        else:
            bar.set_color('green')  # Above average
    
    # Customize the plot
    plt.xlabel('User Number (Ordered by Bradley-Terry Score)', fontsize=12, fontweight='bold')
    plt.ylabel('Bradley-Terry Score', fontsize=12, fontweight='bold')
    plt.title(f'Individual User Bradley-Terry Scores (n={len(df_sorted)})', fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3, axis='y')
    
    # Set x-axis to show reasonable tick marks
    if len(df_sorted) > 50:
        # For large datasets, show every 10th or 25th user
        tick_interval = max(10, len(df_sorted) // 20)
        plt.xticks(range(1, len(df_sorted) + 1, tick_interval))
    else:
        plt.xticks(range(1, len(df_sorted) + 1, 5))  # Every 5th user for smaller datasets
    
    # Add reference line at neutral score (0.5)
    plt.axhline(y=0.5, color='black', linestyle='--', alpha=0.7, linewidth=2, label='Neutral (0.5)')
    
    # Set y-axis limits
    score_range = bradley_scores.max() - bradley_scores.min()
    plt.ylim(bradley_scores.min() - score_range*0.05, bradley_scores.max() + score_range*0.05)
    
    # Add legend for colors
    from matplotlib.patches import Patch
    legend_elements = [
        Patch(facecolor='red', label='Below 0.5 (Losers)'),
        Patch(facecolor='yellow', label='Exactly 0.5 (Neutral)'),
        Patch(facecolor='green', label='Above 0.5 (Winners)'),
        plt.Line2D([0], [0], color='black', linestyle='--', label='Neutral Line (0.5)')
    ]
    plt.legend(handles=legend_elements, loc='upper left')
    
    # Add statistics box
    unique_scores = len(df_sorted['bradley_terry_score'].unique())
    below_half = len(df_sorted[df_sorted['bradley_terry_score'] < 0.5])
    above_half = len(df_sorted[df_sorted['bradley_terry_score'] > 0.5])
    exactly_half = len(df_sorted[df_sorted['bradley_terry_score'] == 0.5])
    
    stats_text = f'Total Users: {len(df_sorted):,}\n'
    stats_text += f'Unique Scores: {unique_scores}\n'
    stats_text += f'Below 0.5: {below_half} users\n'
    stats_text += f'Above 0.5: {above_half} users\n'
    stats_text += f'Exactly 0.5: {exactly_half} users\n'
    stats_text += f'Mean Score: {bradley_scores.mean():.3f}\n'
    stats_text += f'Score Range: {bradley_scores.min():.3f} - {bradley_scores.max():.3f}'
    
    plt.text(0.98, 0.98, stats_text, transform=plt.gca().transAxes,
            fontsize=10, verticalalignment='top', horizontalalignment='right', 
            fontfamily='monospace',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
    
    # Tight layout
    plt.tight_layout()
    
    # Save the graph
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(output_dir, f"user_bradley_terry_bars_{timestamp}.png")
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"💾 User Bradley-Terry bar chart saved to: {output_file}")
    
    # Also save as PDF
    pdf_file = output_file.replace('.png', '.pdf')
    plt.savefig(pdf_file, bbox_inches='tight')
    print(f"💾 PDF version saved to: {pdf_file}")
    
    plt.show()
    
    # Print summary
    print(f"\n📊 Bar Chart Summary:")
    print(f"   {below_half} red bars (losers, score < 0.5)")
    print(f"   {exactly_half} yellow bars (neutral, score = 0.5)")
    print(f"   {above_half} green bars (winners, score > 0.5)")
    print(f"   {unique_scores} unique Bradley-Terry scores across {len(df_sorted)} users")
    
    return output_file

if __name__ == "__main__":
    create_user_bradley_terry_bar_chart()