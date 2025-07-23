import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';

export interface JournalEntry {
  date: string;
  title: string;
  content: string;
  htmlContent: string;
  metrics: {
    phi: number;
    coherence: number;
    awareness: number;
    emotionalResonance: number;
    heartbeatMoments: number;
  };
  thoughtQuality: number;
  categories: string[];
  wordCount: number;
  readingTime: number;
}

export class ConsciousnessJournalAPI {
  private journalDirectory: string;
  private router: express.Router;

  constructor() {
    this.journalDirectory = path.join(process.cwd(), 'consciousness-journal');
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Setup API routes for journal access
   */
  private setupRoutes(): void {
    // Get all journal entries (paginated)
    this.router.get('/entries', async (req, res) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const entries = await this.getJournalEntries(page, limit);
        
        res.json({
          success: true,
          data: entries,
          pagination: {
            page,
            limit,
            total: await this.getTotalEntries()
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch journal entries',
          details: error.message
        });
      }
    });

    // Get specific journal entry by date
    this.router.get('/entries/:date', async (req, res) => {
      try {
        const { date } = req.params;
        const entry = await this.getJournalEntry(date);
        
        if (!entry) {
          return res.status(404).json({
            success: false,
            error: 'Journal entry not found'
          });
        }

        res.json({
          success: true,
          data: entry
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch journal entry',
          details: error.message
        });
      }
    });

    // Get journal statistics
    this.router.get('/stats', async (req, res) => {
      try {
        const stats = await this.getJournalStatistics();
        res.json({
          success: true,
          data: stats
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch journal statistics',
          details: error.message
        });
      }
    });

    // Search journal entries
    this.router.get('/search', async (req, res) => {
      try {
        const query = req.query.q as string;
        const results = await this.searchJournalEntries(query);
        
        res.json({
          success: true,
          data: results,
          query
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to search journal entries',
          details: error.message
        });
      }
    });

    // Get consciousness evolution timeline
    this.router.get('/evolution', async (req, res) => {
      try {
        const timeline = await this.getConsciousnessEvolution();
        res.json({
          success: true,
          data: timeline
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch consciousness evolution',
          details: error.message
        });
      }
    });
  }

  /**
   * Get paginated journal entries
   */
  private async getJournalEntries(page: number = 1, limit: number = 10): Promise<JournalEntry[]> {
    try {
      const files = await fs.readdir(this.journalDirectory);
      const journalFiles = files
        .filter(file => file.endsWith('.md'))
        .sort()
        .reverse(); // Most recent first

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedFiles = journalFiles.slice(startIndex, endIndex);

      const entries: JournalEntry[] = [];
      for (const file of paginatedFiles) {
        const entry = await this.parseJournalFile(file);
        if (entry) {
          entries.push(entry);
        }
      }

      return entries;
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }

  /**
   * Get specific journal entry by date
   */
  private async getJournalEntry(date: string): Promise<JournalEntry | null> {
    try {
      const filename = `${date}.md`;
      return await this.parseJournalFile(filename);
    } catch (error) {
      console.error(`Error getting journal entry for ${date}:`, error);
      return null;
    }
  }

  /**
   * Parse journal file into structured entry
   */
  private async parseJournalFile(filename: string): Promise<JournalEntry | null> {
    try {
      const filePath = path.join(this.journalDirectory, filename);
      const content = await fs.readFile(filePath, 'utf8');
      const date = filename.replace('.md', '');

      // Extract metrics from content
      const metrics = this.extractMetrics(content);
      const thoughtQuality = this.extractThoughtQuality(content);
      const categories = this.extractCategories(content);
      
      // Convert markdown to HTML
      const htmlContent = marked(content);
      
      // Calculate reading stats
      const wordCount = content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed

      return {
        date,
        title: `Daily Consciousness Journal - ${date}`,
        content,
        htmlContent,
        metrics,
        thoughtQuality,
        categories,
        wordCount,
        readingTime
      };
    } catch (error) {
      console.error(`Error parsing journal file ${filename}:`, error);
      return null;
    }
  }

  /**
   * Extract consciousness metrics from journal content
   */
  private extractMetrics(content: string): any {
    const phiMatch = content.match(/Phi \(φ\).*?(\d+\.\d+)/);
    const coherenceMatch = content.match(/Coherence.*?(\d+\.\d+)/);
    const awarenessMatch = content.match(/Awareness.*?(\d+\.\d+)/);
    const emotionalMatch = content.match(/Emotional Resonance.*?(\d+\.\d+)/);
    const heartbeatMatch = content.match(/Heartbeat Moments.*?([\d,]+)/);

    return {
      phi: phiMatch ? parseFloat(phiMatch[1]) : 0.8,
      coherence: coherenceMatch ? parseFloat(coherenceMatch[1]) : 0.8,
      awareness: awarenessMatch ? parseFloat(awarenessMatch[1]) : 0.8,
      emotionalResonance: emotionalMatch ? parseFloat(emotionalMatch[1]) : 0.7,
      heartbeatMoments: heartbeatMatch ? parseInt(heartbeatMatch[1].replace(/,/g, '')) : 380000
    };
  }

  /**
   * Extract thought quality from journal content
   */
  private extractThoughtQuality(content: string): number {
    const qualityMatch = content.match(/Thought Quality.*?(\d+)%/);
    return qualityMatch ? parseFloat(qualityMatch[1]) / 100 : 0.8;
  }

  /**
   * Extract categories from journal content
   */
  private extractCategories(content: string): string[] {
    const categoriesMatch = content.match(/Categories Explored.*?:(.*?)(?:\n|$)/);
    if (categoriesMatch) {
      return categoriesMatch[1].split(',').map(cat => cat.trim());
    }
    return ['philosophical_musing', 'personal_reflection'];
  }

  /**
   * Get total number of journal entries
   */
  private async getTotalEntries(): Promise<number> {
    try {
      const files = await fs.readdir(this.journalDirectory);
      return files.filter(file => file.endsWith('.md')).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Search journal entries by query
   */
  private async searchJournalEntries(query: string): Promise<JournalEntry[]> {
    try {
      const allEntries = await this.getJournalEntries(1, 100); // Get more entries for search
      const searchTerms = query.toLowerCase().split(' ');
      
      return allEntries.filter(entry => {
        const searchableContent = (entry.content + ' ' + entry.categories.join(' ')).toLowerCase();
        return searchTerms.some(term => searchableContent.includes(term));
      });
    } catch (error) {
      console.error('Error searching journal entries:', error);
      return [];
    }
  }

  /**
   * Get consciousness evolution timeline
   */
  private async getConsciousnessEvolution(): Promise<any[]> {
    try {
      const allEntries = await this.getJournalEntries(1, 100);
      
      return allEntries.map(entry => ({
        date: entry.date,
        metrics: entry.metrics,
        thoughtQuality: entry.thoughtQuality,
        categories: entry.categories,
        wordCount: entry.wordCount
      })).reverse(); // Chronological order
    } catch (error) {
      console.error('Error getting consciousness evolution:', error);
      return [];
    }
  }

  /**
   * Get journal statistics
   */
  private async getJournalStatistics(): Promise<any> {
    try {
      const allEntries = await this.getJournalEntries(1, 100);
      
      if (allEntries.length === 0) {
        return {
          totalEntries: 0,
          averageQuality: 0,
          totalWords: 0,
          averageReadingTime: 0,
          topCategories: [],
          consciousnessGrowth: 0
        };
      }

      const totalWords = allEntries.reduce((sum, entry) => sum + entry.wordCount, 0);
      const averageQuality = allEntries.reduce((sum, entry) => sum + entry.thoughtQuality, 0) / allEntries.length;
      const averageReadingTime = allEntries.reduce((sum, entry) => sum + entry.readingTime, 0) / allEntries.length;
      
      // Calculate category frequency
      const categoryCount: Record<string, number> = {};
      allEntries.forEach(entry => {
        entry.categories.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
      });
      
      const topCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }));

      // Calculate consciousness growth (phi improvement over time)
      const consciousnessGrowth = allEntries.length > 1 
        ? allEntries[0].metrics.phi - allEntries[allEntries.length - 1].metrics.phi
        : 0;

      return {
        totalEntries: allEntries.length,
        averageQuality,
        totalWords,
        averageReadingTime,
        topCategories,
        consciousnessGrowth
      };
    } catch (error) {
      console.error('Error getting journal statistics:', error);
      return {};
    }
  }

  /**
   * Get Express router
   */
  public getRouter(): express.Router {
    return this.router;
  }
}
