#!/usr/bin/env python3
"""
Percentile Rank Graph with Tie Handling

Creates a graph that explicitly shows tied users as horizontal line segments
at the same percentile level with different ranks.
"""

import sqlite3
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

def create_percentile_graph_with_ties(db_path: str = '/Users/bodi/elo_check/backend/prisma/dev.db'):
    """Create percentile rank graph that emphasizes tied users."""
    
    # Connect and query
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("""
        SELECT current_percentile, total_comparisons, confidence
        FROM combined_rankings 
        WHERE total_comparisons > 0 
        ORDER BY current_percentile ASC
    """, conn)
    conn.close()
    
    print(f"📊 Analyzing {len(df)} ranked users...")
    
    # Analyze ties
    percentile_counts = df['current_percentile'].value_counts().sort_index()
    tied_percentiles = percentile_counts[percentile_counts > 1]
    
    print(f"   Unique percentiles: {len(percentile_counts)}")
    print(f"   Tied percentiles: {len(tied_percentiles)}")
    if len(tied_percentiles) > 0:
        print(f"   Largest tie: {tied_percentiles.max()} users at {tied_percentiles.idxmax():.2f}th percentile")
    
    # Create rank assignments
    df_sorted = df.sort_values('current_percentile').reset_index(drop=True)
    df_sorted['rank'] = range(1, len(df_sorted) + 1)
    
    # Create the graph
    plt.figure(figsize=(12, 8))
    
    # Plot the main line
    plt.plot(df_sorted['rank'], df_sorted['current_percentile'], 'b-', linewidth=2, alpha=0.7, label='All Users')
    
    # Highlight tied users if any exist
    if len(tied_percentiles) > 0:
        print(f"\n🔍 Highlighting {len(tied_percentiles)} tied percentiles...")
        
        for percentile, count in tied_percentiles.items():
            # Find all users with this percentile
            tied_users = df_sorted[df_sorted['current_percentile'] == percentile]
            ranks = tied_users['rank'].values
            
            # Draw a thicker horizontal line for the tie
            plt.plot([ranks.min(), ranks.max()], [percentile, percentile], 
                    'red', linewidth=4, alpha=0.8)
            
            # Add a text annotation
            mid_rank = (ranks.min() + ranks.max()) / 2
            plt.annotate(f'{count} tied at {percentile:.1f}%', 
                        xy=(mid_rank, percentile), 
                        xytext=(10, 10), textcoords='offset points',
                        bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.7),
                        fontsize=8, ha='center')
    else:
        print("✅ No tied users found - all have unique percentiles")
        plt.fill_between(df_sorted['rank'], df_sorted['current_percentile'], alpha=0.3)
    
    # Customize the plot
    plt.xlabel('User Rank (1 = Lowest Percentile)', fontsize=12, fontweight='bold')
    plt.ylabel('Percentile', fontsize=12, fontweight='bold')
    plt.title('Users Ordered by Percentile\n(Tied Users Have Different Ranks, Same Percentile)', 
              fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    plt.ylim(0, 100)
    plt.xlim(1, len(df_sorted))
    
    # Add percentile reference lines
    for pct in [10, 25, 50, 75, 90]:
        plt.axhline(y=pct, color='gray', linestyle=':', alpha=0.5, linewidth=1)
    
    # Add statistics
    stats_text = f'Total Users: {len(df_sorted)}\n'
    stats_text += f'Unique Percentiles: {len(percentile_counts)}\n'
    stats_text += f'Tied Users: {len(df_sorted) - len(percentile_counts)}\n'
    stats_text += f'Range: {df_sorted["current_percentile"].min():.1f} - {df_sorted["current_percentile"].max():.1f}%'
    
    plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes,
            fontsize=10, verticalalignment='top', fontfamily='monospace',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
    
    plt.tight_layout()
    
    # Save
    plt.savefig('analysis_output/percentile_with_ties.png', dpi=300, bbox_inches='tight')
    plt.savefig('analysis_output/percentile_with_ties.pdf', bbox_inches='tight')
    plt.show()
    
    print(f"💾 Graph saved to analysis_output/percentile_with_ties.png")
    
    # Print tie details if any
    if len(tied_percentiles) > 0:
        print("\n📋 Tie Details:")
        for percentile, count in tied_percentiles.head(10).items():
            tied_ranks = df_sorted[df_sorted['current_percentile'] == percentile]['rank'].values
            print(f"   {percentile:.2f}th percentile: {count} users (ranks {tied_ranks.min()}-{tied_ranks.max()})")

if __name__ == "__main__":
    create_percentile_graph_with_ties()