#!/usr/bin/env python3
"""
Bradley-Terry Score vs Rank Graph

Creates a graph showing users ordered by their Bradley-Terry scores,
displaying the relationship between rank position and actual ranking algorithm scores.
"""

import sqlite3
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from datetime import datetime
import os

def create_bradley_terry_rank_graph(db_path: str = '/Users/bodi/elo_check/backend/prisma/dev.db', 
                                   output_dir: str = "analysis_output"):
    """Create Bradley-Terry score vs rank graph."""
    
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
        cr.confidence,
        cr.wins,
        cr.losses,
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
    
    # Sort by Bradley-Terry score (lowest to highest)
    df_sorted = df.sort_values('bradley_terry_score').reset_index(drop=True)
    
    # Create rank numbers (1 = lowest Bradley-Terry score, n = highest)
    df_sorted['rank'] = range(1, len(df_sorted) + 1)
    
    print(f"📈 Bradley-Terry Score Analysis:")
    print(f"   Total items: {len(df_sorted)}")
    print(f"   Score range: {df_sorted['bradley_terry_score'].min():.3f} - {df_sorted['bradley_terry_score'].max():.3f}")
    print(f"   Mean score: {df_sorted['bradley_terry_score'].mean():.3f}")
    print(f"   Median score: {df_sorted['bradley_terry_score'].median():.3f}")
    
    # Check for ties in Bradley-Terry scores
    score_counts = df_sorted['bradley_terry_score'].value_counts()
    tied_scores = score_counts[score_counts > 1]
    if len(tied_scores) > 0:
        print(f"   Tied scores: {len(tied_scores)} scores have ties")
        print(f"   Largest tie: {tied_scores.max()} users at {tied_scores.idxmax():.3f}")
    else:
        print("   No tied scores - all unique Bradley-Terry values")
    
    # Create the graph
    plt.figure(figsize=(12, 8))
    
    # Plot the main curve - this will show step function for ties
    plt.plot(df_sorted['rank'], df_sorted['bradley_terry_score'], 'b-', linewidth=2, alpha=0.8, label='Bradley-Terry Scores')
    
    # Highlight all ties with distinct colors and annotations
    if len(tied_scores) > 0:
        print(f"\n🔍 Drawing {len(tied_scores)} tied score groups...")
        
        colors = ['red', 'orange', 'purple', 'green', 'brown']
        
        for i, (score, count) in enumerate(tied_scores.items()):
            tied_users = df_sorted[df_sorted['bradley_terry_score'] == score]
            ranks = tied_users['rank'].values
            
            # Draw thick horizontal line for the tie
            color = colors[i % len(colors)]
            plt.plot([ranks.min(), ranks.max()], [score, score], 
                    color=color, linewidth=4, alpha=0.9, 
                    label=f'{count} users tied at {score:.3f}')
            
            # Add annotation for all ties
            mid_rank = (ranks.min() + ranks.max()) / 2
            
            # Position annotations to avoid overlap
            offset_y = 15 + (i % 3) * 20  # Stagger vertically
            
            plt.annotate(f'{count} tied users\nScore: {score:.3f}\nRanks: {ranks.min()}-{ranks.max()}', 
                        xy=(mid_rank, score), 
                        xytext=(20, offset_y), textcoords='offset points',
                        bbox=dict(boxstyle='round,pad=0.4', facecolor=color, alpha=0.3, edgecolor=color),
                        fontsize=9, ha='left', va='center',
                        arrowprops=dict(arrowstyle='->', color=color, alpha=0.7))
    
    # Fill between to show the step function clearly
    plt.fill_between(df_sorted['rank'], df_sorted['bradley_terry_score'], alpha=0.2, color='blue', step='pre')
    
    # Customize the plot
    plt.xlabel('Rank (1 = Lowest Bradley-Terry Score)', fontsize=12, fontweight='bold')
    plt.ylabel('Bradley-Terry Score', fontsize=12, fontweight='bold')
    plt.title('Bradley-Terry Scores Ordered by Rank\n(Ranking Algorithm Output)', 
              fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    
    # Set reasonable limits
    plt.xlim(1, len(df_sorted))
    score_range = df_sorted['bradley_terry_score'].max() - df_sorted['bradley_terry_score'].min()
    plt.ylim(df_sorted['bradley_terry_score'].min() - score_range*0.05, 
             df_sorted['bradley_terry_score'].max() + score_range*0.05)
    
    # Add reference lines for key Bradley-Terry values
    plt.axhline(y=0.5, color='red', linestyle='--', alpha=0.7, linewidth=1, label='Neutral (0.5)')
    
    # Find quartile scores for reference
    q25_score = df_sorted['bradley_terry_score'].quantile(0.25)
    q75_score = df_sorted['bradley_terry_score'].quantile(0.75)
    
    plt.axhline(y=q25_score, color='orange', linestyle=':', alpha=0.7, linewidth=1, label=f'25th %ile ({q25_score:.3f})')
    plt.axhline(y=q75_score, color='orange', linestyle=':', alpha=0.7, linewidth=1, label=f'75th %ile ({q75_score:.3f})')
    
    plt.legend(loc='lower right')
    
    # Add statistics box
    stats_text = f'Total Items: {len(df_sorted):,}\n'
    stats_text += f'Score Range: {df_sorted["bradley_terry_score"].min():.3f} - {df_sorted["bradley_terry_score"].max():.3f}\n'
    stats_text += f'Mean: {df_sorted["bradley_terry_score"].mean():.3f}\n'
    stats_text += f'Median: {df_sorted["bradley_terry_score"].median():.3f}\n'
    stats_text += f'Std Dev: {df_sorted["bradley_terry_score"].std():.3f}\n'
    
    # Show percentile correlation
    correlation = df_sorted['bradley_terry_score'].corr(df_sorted['current_percentile'])
    stats_text += f'Correlation w/ Percentile: {correlation:.3f}'
    
    plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes,
            fontsize=10, verticalalignment='top', fontfamily='monospace',
            bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.8))
    
    # Tight layout
    plt.tight_layout()
    
    # Save the graph
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(output_dir, f"bradley_terry_rank_graph_{timestamp}.png")
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    print(f"💾 Bradley-Terry rank graph saved to: {output_file}")
    
    # Also save as PDF
    pdf_file = output_file.replace('.png', '.pdf')
    plt.savefig(pdf_file, bbox_inches='tight')
    print(f"💾 PDF version saved to: {pdf_file}")
    
    plt.show()
    
    # Print additional insights
    print(f"\n🔍 Additional Insights:")
    
    # Find extreme scores
    lowest_5 = df_sorted.head(5)
    highest_5 = df_sorted.tail(5)
    
    print(f"   Lowest 5 Bradley-Terry scores:")
    for i, row in lowest_5.iterrows():
        print(f"     Rank {row['rank']}: {row['bradley_terry_score']:.3f} ({row['wins']}/{row['wins']+row['losses']} wins, {row['current_percentile']:.1f}%ile)")
    
    print(f"   Highest 5 Bradley-Terry scores:")
    for i, row in highest_5.iterrows():
        print(f"     Rank {row['rank']}: {row['bradley_terry_score']:.3f} ({row['wins']}/{row['wins']+row['losses']} wins, {row['current_percentile']:.1f}%ile)")
    
    # Score distribution analysis
    below_half = len(df_sorted[df_sorted['bradley_terry_score'] < 0.5])
    above_half = len(df_sorted[df_sorted['bradley_terry_score'] > 0.5])
    exactly_half = len(df_sorted[df_sorted['bradley_terry_score'] == 0.5])
    
    print(f"\n📊 Score Distribution:")
    print(f"   Below 0.5: {below_half:,} items ({below_half/len(df_sorted)*100:.1f}%)")
    print(f"   Exactly 0.5: {exactly_half:,} items ({exactly_half/len(df_sorted)*100:.1f}%)")
    print(f"   Above 0.5: {above_half:,} items ({above_half/len(df_sorted)*100:.1f}%)")
    
    return output_file

if __name__ == "__main__":
    create_bradley_terry_rank_graph()