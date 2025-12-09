#!/usr/bin/env python3
"""
Simple Percentile Line Graph - Minimal ascending line

Creates the simplest possible graph: users ordered by percentile as a strictly increasing line.
"""

import sqlite3
import matplotlib.pyplot as plt
import pandas as pd

def create_simple_line_graph(db_path: str = '/Users/bodi/elo_check/backend/prisma/dev.db'):
    """Create the simplest possible percentile rank graph."""
    
    # Connect and query
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("""
        SELECT current_percentile 
        FROM combined_rankings 
        WHERE total_comparisons > 0 
        ORDER BY current_percentile ASC
    """, conn)
    conn.close()
    
    # Each user gets a unique rank (1, 2, 3...) even with tied percentiles
    ranks = range(1, len(df) + 1)
    percentiles = df['current_percentile'].values
    
    print(f"Users: {len(df)}, Unique percentiles: {len(df['current_percentile'].unique())}")
    print(f"Ties: {len(df) - len(df['current_percentile'].unique())} users have tied percentiles")
    
    # Create simple graph
    plt.figure(figsize=(10, 6))
    plt.plot(ranks, percentiles, 'b-', linewidth=2)
    plt.xlabel('User Rank')
    plt.ylabel('Percentile')
    plt.title('Users Ordered by Percentile (Strictly Increasing)')
    plt.grid(True, alpha=0.3)
    plt.ylim(0, 100)
    
    # Save
    plt.savefig('analysis_output/simple_percentile_line.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print(f"✅ Simple graph created: {len(df)} users plotted")

if __name__ == "__main__":
    create_simple_line_graph()