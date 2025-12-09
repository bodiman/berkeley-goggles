#!/usr/bin/env python3
"""
Percentile Distribution Analysis Script

This script analyzes and visualizes the percentile distribution of all ranked datapoints
in the Berkeley Goggles database, including user photos, sample images, and combined rankings.
"""

import os
import sys
import sqlite3
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Tuple
import argparse
from datetime import datetime

# Set up plotting style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class PercentileAnalyzer:
    """Main class for analyzing percentile distributions from the database."""
    
    def __init__(self, db_path: str):
        """Initialize with database path."""
        self.db_path = db_path
        self.conn = None
        
    def connect(self):
        """Connect to the database."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            print(f"✅ Connected to database: {self.db_path}")
        except Exception as e:
            print(f"❌ Failed to connect to database: {e}")
            sys.exit(1)
    
    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()
    
    def fetch_photo_rankings(self) -> pd.DataFrame:
        """Fetch photo rankings data."""
        query = """
        SELECT 
            pr.current_percentile,
            pr.total_comparisons,
            pr.wins,
            pr.losses,
            pr.bradley_terry_score,
            pr.confidence,
            u.gender,
            'user_photo' as source_type
        FROM photo_rankings pr
        LEFT JOIN photos p ON pr.photo_id = p.id
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.total_comparisons > 0
        """
        
        try:
            df = pd.read_sql_query(query, self.conn)
            print(f"📊 Fetched {len(df)} photo rankings")
            return df
        except Exception as e:
            print(f"❌ Error fetching photo rankings: {e}")
            return pd.DataFrame()
    
    def fetch_sample_image_rankings(self) -> pd.DataFrame:
        """Fetch sample image rankings data."""
        query = """
        SELECT 
            sir.current_percentile,
            sir.total_comparisons,
            sir.wins,
            sir.losses,
            sir.bradley_terry_score,
            sir.confidence,
            si.gender,
            'sample_image' as source_type
        FROM sample_image_rankings sir
        LEFT JOIN sample_images si ON sir.sample_image_id = si.id
        WHERE sir.total_comparisons > 0
        """
        
        try:
            df = pd.read_sql_query(query, self.conn)
            print(f"📊 Fetched {len(df)} sample image rankings")
            return df
        except Exception as e:
            print(f"❌ Error fetching sample image rankings: {e}")
            return pd.DataFrame()
    
    def fetch_combined_rankings(self) -> pd.DataFrame:
        """Fetch combined rankings data."""
        query = """
        SELECT 
            cr.current_percentile,
            cr.total_comparisons,
            cr.wins,
            cr.losses,
            cr.bradley_terry_score,
            cr.confidence,
            cr.gender,
            CASE 
                WHEN cr.photo_id IS NOT NULL THEN 'user_photo'
                WHEN cr.sample_image_id IS NOT NULL THEN 'sample_image'
                ELSE 'unknown'
            END as source_type
        FROM combined_rankings cr
        WHERE cr.total_comparisons > 0
        """
        
        try:
            df = pd.read_sql_query(query, self.conn)
            print(f"📊 Fetched {len(df)} combined rankings")
            return df
        except Exception as e:
            print(f"❌ Error fetching combined rankings: {e}")
            return pd.DataFrame()
    
    def get_database_stats(self) -> Dict:
        """Get overall database statistics."""
        stats = {}
        
        try:
            # Count total rankings
            cursor = self.conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM photo_rankings WHERE total_comparisons > 0")
            stats['photo_rankings'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM sample_image_rankings WHERE total_comparisons > 0")
            stats['sample_image_rankings'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM combined_rankings WHERE total_comparisons > 0")
            stats['combined_rankings'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM comparisons")
            stats['total_comparisons'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(DISTINCT rater_id) FROM comparisons")
            stats['unique_raters'] = cursor.fetchone()[0]
            
            return stats
            
        except Exception as e:
            print(f"❌ Error getting database stats: {e}")
            return {}
    
    def analyze_percentile_distribution(self, df: pd.DataFrame, title: str) -> Dict:
        """Analyze percentile distribution for a given dataset."""
        if df.empty:
            return {}
        
        analysis = {
            'count': len(df),
            'mean': df['current_percentile'].mean(),
            'median': df['current_percentile'].median(),
            'std': df['current_percentile'].std(),
            'min': df['current_percentile'].min(),
            'max': df['current_percentile'].max(),
            'q25': df['current_percentile'].quantile(0.25),
            'q75': df['current_percentile'].quantile(0.75),
            'skewness': df['current_percentile'].skew(),
            'kurtosis': df['current_percentile'].kurtosis()
        }
        
        print(f"\n📈 {title} Analysis:")
        print(f"   Count: {analysis['count']:,}")
        print(f"   Mean: {analysis['mean']:.2f}")
        print(f"   Median: {analysis['median']:.2f}")
        print(f"   Std Dev: {analysis['std']:.2f}")
        print(f"   Range: {analysis['min']:.2f} - {analysis['max']:.2f}")
        print(f"   IQR: {analysis['q25']:.2f} - {analysis['q75']:.2f}")
        print(f"   Skewness: {analysis['skewness']:.3f}")
        print(f"   Kurtosis: {analysis['kurtosis']:.3f}")
        
        return analysis
    
    def create_comprehensive_visualization(self, photo_df: pd.DataFrame, sample_df: pd.DataFrame, 
                                         combined_df: pd.DataFrame, output_dir: str = "output"):
        """Create comprehensive percentile distribution visualizations."""
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Set up the figure with subplots
        fig = plt.figure(figsize=(20, 15))
        
        # 1. Overall distribution comparison
        plt.subplot(3, 3, 1)
        data_to_plot = []
        labels = []
        
        if not photo_df.empty:
            data_to_plot.append(photo_df['current_percentile'])
            labels.append(f'User Photos ({len(photo_df)})')
        
        if not sample_df.empty:
            data_to_plot.append(sample_df['current_percentile'])
            labels.append(f'Sample Images ({len(sample_df)})')
        
        if not combined_df.empty:
            data_to_plot.append(combined_df['current_percentile'])
            labels.append(f'Combined ({len(combined_df)})')
        
        if data_to_plot:
            plt.hist(data_to_plot, bins=50, alpha=0.7, label=labels, density=True)
            plt.xlabel('Percentile')
            plt.ylabel('Density')
            plt.title('Percentile Distribution Comparison')
            plt.legend()
            plt.grid(True, alpha=0.3)
        
        # 2. Box plot comparison
        plt.subplot(3, 3, 2)
        if data_to_plot:
            plt.boxplot(data_to_plot, labels=labels)
            plt.ylabel('Percentile')
            plt.title('Percentile Distribution Box Plot')
            plt.xticks(rotation=45, ha='right')
            plt.grid(True, alpha=0.3)
        
        # 3. Gender-based distribution (combined data)
        plt.subplot(3, 3, 3)
        if not combined_df.empty and 'gender' in combined_df.columns:
            for gender in combined_df['gender'].unique():
                if pd.notna(gender):
                    gender_data = combined_df[combined_df['gender'] == gender]['current_percentile']
                    plt.hist(gender_data, bins=30, alpha=0.7, 
                            label=f'{gender.title()} ({len(gender_data)})', density=True)
            plt.xlabel('Percentile')
            plt.ylabel('Density')
            plt.title('Percentile Distribution by Gender')
            plt.legend()
            plt.grid(True, alpha=0.3)
        
        # 4. Percentile vs Total Comparisons scatter
        plt.subplot(3, 3, 4)
        if not combined_df.empty:
            plt.scatter(combined_df['total_comparisons'], combined_df['current_percentile'], 
                       alpha=0.6, s=20)
            plt.xlabel('Total Comparisons')
            plt.ylabel('Percentile')
            plt.title('Percentile vs Number of Comparisons')
            plt.grid(True, alpha=0.3)
        
        # 5. Bradley-Terry Score vs Percentile
        plt.subplot(3, 3, 5)
        if not combined_df.empty:
            plt.scatter(combined_df['bradley_terry_score'], combined_df['current_percentile'], 
                       alpha=0.6, s=20)
            plt.xlabel('Bradley-Terry Score')
            plt.ylabel('Percentile')
            plt.title('Bradley-Terry Score vs Percentile')
            plt.grid(True, alpha=0.3)
        
        # 6. Confidence vs Percentile
        plt.subplot(3, 3, 6)
        if not combined_df.empty:
            plt.scatter(combined_df['confidence'], combined_df['current_percentile'], 
                       alpha=0.6, s=20)
            plt.xlabel('Confidence')
            plt.ylabel('Percentile')
            plt.title('Confidence vs Percentile')
            plt.grid(True, alpha=0.3)
        
        # 7. Percentile bands
        plt.subplot(3, 3, 7)
        if not combined_df.empty:
            # Create percentile bands
            bands = pd.cut(combined_df['current_percentile'], 
                          bins=[0, 10, 25, 50, 75, 90, 100], 
                          labels=['0-10%', '10-25%', '25-50%', '50-75%', '75-90%', '90-100%'])
            band_counts = bands.value_counts().sort_index()
            
            plt.bar(range(len(band_counts)), band_counts.values)
            plt.xlabel('Percentile Band')
            plt.ylabel('Count')
            plt.title('Distribution by Percentile Bands')
            plt.xticks(range(len(band_counts)), band_counts.index, rotation=45)
            plt.grid(True, alpha=0.3, axis='y')
        
        # 8. Win Rate Distribution
        plt.subplot(3, 3, 8)
        if not combined_df.empty:
            # Calculate win rates
            win_rates = combined_df['wins'] / (combined_df['wins'] + combined_df['losses'])
            win_rates = win_rates[~np.isnan(win_rates)]  # Remove NaN values
            
            if len(win_rates) > 0:
                plt.hist(win_rates, bins=30, alpha=0.7, edgecolor='black')
                plt.xlabel('Win Rate')
                plt.ylabel('Frequency')
                plt.title('Win Rate Distribution')
                plt.grid(True, alpha=0.3)
        
        # 9. Summary statistics text
        plt.subplot(3, 3, 9)
        plt.axis('off')
        
        summary_text = "Summary Statistics\n\n"
        
        if not combined_df.empty:
            summary_text += f"Total Ranked Items: {len(combined_df):,}\n"
            summary_text += f"Mean Percentile: {combined_df['current_percentile'].mean():.2f}\n"
            summary_text += f"Median Percentile: {combined_df['current_percentile'].median():.2f}\n"
            summary_text += f"Std Deviation: {combined_df['current_percentile'].std():.2f}\n\n"
            
            summary_text += f"Percentile Ranges:\n"
            summary_text += f"  Top 10%: {len(combined_df[combined_df['current_percentile'] >= 90]):,} items\n"
            summary_text += f"  Top 25%: {len(combined_df[combined_df['current_percentile'] >= 75]):,} items\n"
            summary_text += f"  Bottom 25%: {len(combined_df[combined_df['current_percentile'] <= 25]):,} items\n"
            summary_text += f"  Bottom 10%: {len(combined_df[combined_df['current_percentile'] <= 10]):,} items\n\n"
            
            total_comparisons = combined_df['total_comparisons'].sum()
            summary_text += f"Total Comparisons: {total_comparisons:,}\n"
            summary_text += f"Avg Comparisons per Item: {combined_df['total_comparisons'].mean():.1f}\n"
        
        plt.text(0.05, 0.95, summary_text, transform=plt.gca().transAxes, 
                fontsize=10, verticalalignment='top', fontfamily='monospace',
                bbox=dict(boxstyle='round', facecolor='lightgray', alpha=0.8))
        
        plt.tight_layout()
        
        # Save the comprehensive plot
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = os.path.join(output_dir, f"percentile_distribution_analysis_{timestamp}.png")
        plt.savefig(output_file, dpi=300, bbox_inches='tight')
        print(f"💾 Comprehensive visualization saved to: {output_file}")
        
        # Also save as PDF
        pdf_file = output_file.replace('.png', '.pdf')
        plt.savefig(pdf_file, bbox_inches='tight')
        print(f"💾 PDF version saved to: {pdf_file}")
        
        plt.show()
        
        return output_file
    
    def generate_summary_report(self, photo_df: pd.DataFrame, sample_df: pd.DataFrame, 
                               combined_df: pd.DataFrame, db_stats: Dict, output_dir: str = "output"):
        """Generate a text summary report."""
        
        os.makedirs(output_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = os.path.join(output_dir, f"percentile_analysis_report_{timestamp}.txt")
        
        with open(report_file, 'w') as f:
            f.write("BERKELEY GOGGLES - PERCENTILE DISTRIBUTION ANALYSIS REPORT\n")
            f.write("=" * 60 + "\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            # Database overview
            f.write("DATABASE OVERVIEW\n")
            f.write("-" * 20 + "\n")
            for key, value in db_stats.items():
                f.write(f"{key.replace('_', ' ').title()}: {value:,}\n")
            f.write("\n")
            
            # Detailed analysis for each dataset
            datasets = [
                (photo_df, "USER PHOTO RANKINGS"),
                (sample_df, "SAMPLE IMAGE RANKINGS"), 
                (combined_df, "COMBINED RANKINGS")
            ]
            
            for df, title in datasets:
                if not df.empty:
                    f.write(f"{title}\n")
                    f.write("-" * len(title) + "\n")
                    
                    analysis = self.analyze_percentile_distribution(df, title)
                    
                    f.write(f"Total Items: {analysis['count']:,}\n")
                    f.write(f"Mean Percentile: {analysis['mean']:.2f}\n")
                    f.write(f"Median Percentile: {analysis['median']:.2f}\n")
                    f.write(f"Standard Deviation: {analysis['std']:.2f}\n")
                    f.write(f"Range: {analysis['min']:.2f} - {analysis['max']:.2f}\n")
                    f.write(f"Interquartile Range: {analysis['q25']:.2f} - {analysis['q75']:.2f}\n")
                    f.write(f"Skewness: {analysis['skewness']:.3f}\n")
                    f.write(f"Kurtosis: {analysis['kurtosis']:.3f}\n")
                    
                    # Gender breakdown if available
                    if 'gender' in df.columns:
                        f.write("\nGender Breakdown:\n")
                        gender_counts = df['gender'].value_counts()
                        for gender, count in gender_counts.items():
                            if pd.notna(gender):
                                gender_percentiles = df[df['gender'] == gender]['current_percentile']
                                f.write(f"  {gender.title()}: {count:,} items (mean percentile: {gender_percentiles.mean():.2f})\n")
                    
                    f.write("\n")
            
            # Key insights
            if not combined_df.empty:
                f.write("KEY INSIGHTS\n")
                f.write("-" * 12 + "\n")
                
                # Percentile band distribution
                bands = pd.cut(combined_df['current_percentile'], 
                              bins=[0, 10, 25, 50, 75, 90, 100], 
                              labels=['Bottom 10%', 'Low (10-25%)', 'Below Avg (25-50%)', 
                                     'Above Avg (50-75%)', 'High (75-90%)', 'Top 10%'])
                band_counts = bands.value_counts().sort_index()
                
                f.write("Percentile Band Distribution:\n")
                for band, count in band_counts.items():
                    percentage = (count / len(combined_df)) * 100
                    f.write(f"  {band}: {count:,} items ({percentage:.1f}%)\n")
                
                f.write(f"\nItems with high confidence (>0.8): {len(combined_df[combined_df['confidence'] > 0.8]):,}\n")
                f.write(f"Items with many comparisons (>50): {len(combined_df[combined_df['total_comparisons'] > 50]):,}\n")
                
        print(f"📄 Summary report saved to: {report_file}")
        return report_file

def main():
    """Main function to run the analysis."""
    parser = argparse.ArgumentParser(description='Analyze percentile distribution of ranked datapoints')
    parser.add_argument('--db-path', '-d', 
                       default='/Users/bodi/elo_check/backend/prisma/dev.db',
                       help='Path to SQLite database file')
    parser.add_argument('--output-dir', '-o', 
                       default='output',
                       help='Output directory for generated files')
    parser.add_argument('--no-viz', action='store_true',
                       help='Skip visualization generation (generate report only)')
    
    args = parser.parse_args()
    
    # Check if database file exists
    if not os.path.exists(args.db_path):
        print(f"❌ Database file not found: {args.db_path}")
        print("Please provide a valid database path using --db-path")
        sys.exit(1)
    
    print("🚀 Starting Percentile Distribution Analysis...")
    print(f"📁 Database: {args.db_path}")
    print(f"📂 Output Directory: {args.output_dir}")
    
    # Initialize analyzer
    analyzer = PercentileAnalyzer(args.db_path)
    analyzer.connect()
    
    try:
        # Get database stats
        print("\n📊 Fetching database statistics...")
        db_stats = analyzer.get_database_stats()
        
        # Fetch all ranking data
        print("\n📈 Fetching ranking data...")
        photo_df = analyzer.fetch_photo_rankings()
        sample_df = analyzer.fetch_sample_image_rankings()
        combined_df = analyzer.fetch_combined_rankings()
        
        # Perform analysis
        print("\n🔍 Analyzing percentile distributions...")
        analyzer.analyze_percentile_distribution(photo_df, "User Photo Rankings")
        analyzer.analyze_percentile_distribution(sample_df, "Sample Image Rankings")
        analyzer.analyze_percentile_distribution(combined_df, "Combined Rankings")
        
        # Generate visualization
        if not args.no_viz:
            print("\n📊 Creating visualizations...")
            analyzer.create_comprehensive_visualization(photo_df, sample_df, combined_df, args.output_dir)
        
        # Generate summary report
        print("\n📄 Generating summary report...")
        analyzer.generate_summary_report(photo_df, sample_df, combined_df, db_stats, args.output_dir)
        
        print("\n✅ Analysis complete!")
        
    finally:
        analyzer.close()

if __name__ == "__main__":
    main()