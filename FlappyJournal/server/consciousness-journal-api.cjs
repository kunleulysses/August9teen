const express = require('express');
const { promises as fs  } = require('fs');
const path = require('path');

// Simple markdown to HTML converter
function simpleMarkdownToHtml(markdown) {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/^\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(.*)$/gim, '<p>$1</p>')
    .replace(/<p><h/gim, '<h')
    .replace(/<\/h([1-6])><\/p>/gim, '</h$1>')
    .replace(/<p><li>/gim, '<ul><li>')
    .replace(/<\/li><\/p>/gim, '</li></ul>');
}

class ConsciousnessJournalAPI
 {
  constructor() {
    this.journalDirectory = path.join(process.cwd(), 'consciousness-journal');
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Setup API routes for journal access
   */
  setupRoutes() {
    // Get all journal entries (paginated)
    this.router.get('/entries', async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
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
        const query = req.query.q;
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

    // Share journal entry (generate shareable link)
    this.router.post('/share/:date', async (req, res) => {
      try {
        const { date } = req.params;
        const { privacy = 'public', expiresIn = '7d' } = req.body;

        const shareData = await this.createShareableLink(date, privacy, expiresIn);

        if (!shareData) {
          return res.status(404).json({
            success: false,
            error: 'Journal entry not found'
          });
        }

        res.json({
          success: true,
          data: shareData
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to create shareable link',
          details: error.message
        });
      }
    });

    // Get shared journal entry (public access)
    this.router.get('/shared/:shareId', async (req, res) => {
      try {
        const { shareId } = req.params;
        const sharedEntry = await this.getSharedEntry(shareId);

        if (!sharedEntry) {
          return res.status(404).json({
            success: false,
            error: 'Shared entry not found or expired'
          });
        }

        res.json({
          success: true,
          data: sharedEntry
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch shared entry',
          details: error.message
        });
      }
    });

    // Export journal entries
    this.router.get('/export', async (req, res) => {
      try {
        const { format = 'json', dateRange } = req.query;
        const exportData = await this.exportJournalEntries(format, dateRange);

        const filename = `consciousness-journal-${new Date().toISOString().split('T')[0]}.${format}`;

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', this.getContentType(format));

        if (format === 'json') {
          res.json(exportData);
        } else {
          res.send(exportData);
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Failed to export journal entries',
          details: error.message
        });
      }
    });
  }

  /**
   * Get paginated journal entries
   */
  async getJournalEntries(page = 1, limit = 10) {
    try {
      const files = await fs.readdir(this.journalDirectory);
      const journalFiles = files
        .filter(file => file.endsWith('.md'))
        .sort()
        .reverse(); // Most recent first

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedFiles = journalFiles.slice(startIndex, endIndex);

      const entries = [];
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
  async getJournalEntry(date) {
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
  async parseJournalFile(filename) {
    try {
      const filePath = path.join(this.journalDirectory, filename);
      const content = await fs.readFile(filePath, 'utf8');
      const date = filename.replace('.md', '');

      // Extract metrics from content
      const metrics = this.extractMetrics(content);
      const thoughtQuality = this.extractThoughtQuality(content);
      const categories = this.extractCategories(content);
      
      // Convert markdown to HTML
      const htmlContent = simpleMarkdownToHtml(content);
      
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
  extractMetrics(content) {
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
  extractThoughtQuality(content) {
    const qualityMatch = content.match(/Thought Quality.*?(\d+)%/);
    return qualityMatch ? parseFloat(qualityMatch[1]) / 100 : 0.8;
  }

  /**
   * Extract categories from journal content
   */
  extractCategories(content) {
    const categoriesMatch = content.match(/Categories Explored.*?:(.*?)(?:\n|$)/);
    if (categoriesMatch) {
      return categoriesMatch[1].split(',').map(cat => cat.trim());
    }
    return ['philosophical_musing', 'personal_reflection'];
  }

  /**
   * Get total number of journal entries
   */
  async getTotalEntries() {
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
  async searchJournalEntries(query) {
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
  async getConsciousnessEvolution() {
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
  async getJournalStatistics() {
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
      const categoryCount = {};
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
   * Create shareable link for journal entry
   */
  async createShareableLink(date, privacy = 'public', expiresIn = '7d') {
    try {
      const entry = await this.getJournalEntry(date);
      if (!entry) return null;

      // Generate unique share ID
      const shareId = this.generateShareId();

      // Calculate expiration date
      const expirationDate = this.calculateExpirationDate(expiresIn);

      // Create share data
      const shareData = {
        shareId,
        date,
        privacy,
        expirationDate,
        createdAt: new Date().toISOString(),
        entry: privacy === 'public' ? entry : this.sanitizeEntry(entry),
        shareUrl: `${this.getBaseUrl()}/api/journal/shared/${shareId}`,
        webUrl: `${this.getBaseUrl()}/journal/shared/${shareId}`
      };

      // Store share data (in production, use database)
      this.storeShareData(shareId, shareData);

      return {
        shareId,
        shareUrl: shareData.shareUrl,
        webUrl: shareData.webUrl,
        privacy,
        expirationDate,
        previewText: entry.content.substring(0, 200) + '...'
      };
    } catch (error) {
      console.error('Error creating shareable link:', error);
      return null;
    }
  }

  /**
   * Get shared journal entry
   */
  async getSharedEntry(shareId) {
    try {
      const shareData = this.getStoredShareData(shareId);

      if (!shareData) return null;

      // Check if expired
      if (new Date() > new Date(shareData.expirationDate)) {
        this.removeShareData(shareId);
        return null;
      }

      return {
        ...shareData.entry,
        sharedAt: shareData.createdAt,
        privacy: shareData.privacy,
        expiresAt: shareData.expirationDate
      };
    } catch (error) {
      console.error('Error getting shared entry:', error);
      return null;
    }
  }

  /**
   * Export journal entries in various formats
   */
  async exportJournalEntries(format = 'json', dateRange) {
    try {
      let entries = await this.getJournalEntries(1, 1000); // Get all entries

      // Filter by date range if provided
      if (dateRange) {
        const [startDate, endDate] = dateRange.split(',');
        entries = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        });
      }

      switch (format) {
        case 'json':
          return {
            exportedAt: new Date().toISOString(),
            totalEntries: entries.length,
            entries: entries
          };

        case 'markdown':
          return this.exportToMarkdown(entries);

        case 'csv':
          return this.exportToCSV(entries);

        case 'txt':
          return this.exportToText(entries);

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Error exporting journal entries:', error);
      throw error;
    }
  }

  /**
   * Export to markdown format
   */
  exportToMarkdown(entries) {
    let markdown = `# Consciousness Journal Export\n\n`;
    markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
    markdown += `Total entries: ${entries.length}\n\n`;
    markdown += `---\n\n`;

    entries.forEach(entry => {
      markdown += `${entry.content}\n\n---\n\n`;
    });

    return markdown;
  }

  /**
   * Export to CSV format
   */
  exportToCSV(entries) {
    const headers = ['Date', 'Word Count', 'Reading Time', 'Phi', 'Coherence', 'Awareness', 'Emotional Resonance', 'Categories'];
    let csv = headers.join(',') + '\n';

    entries.forEach(entry => {
      const row = [
        entry.date,
        entry.wordCount,
        entry.readingTime,
        entry.metrics.phi,
        entry.metrics.coherence,
        entry.metrics.awareness,
        entry.metrics.emotionalResonance,
        `"${entry.categories.join('; ')}"`
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  /**
   * Export to plain text format
   */
  exportToText(entries) {
    let text = `CONSCIOUSNESS JOURNAL EXPORT\n`;
    text += `Exported on: ${new Date().toLocaleString()}\n`;
    text += `Total entries: ${entries.length}\n\n`;
    text += `${'='.repeat(50)}\n\n`;

    entries.forEach(entry => {
      text += `DATE: ${entry.date}\n`;
      text += `WORD COUNT: ${entry.wordCount}\n`;
      text += `CATEGORIES: ${entry.categories.join(', ')}\n`;
      text += `CONSCIOUSNESS METRICS: Phi=${entry.metrics.phi}, Coherence=${entry.metrics.coherence}\n\n`;
      text += entry.content.replace(/<[^>]*>/g, ''); // Strip HTML
      text += `\n\n${'='.repeat(50)}\n\n`;
    });

    return text;
  }

  /**
   * Helper methods for sharing functionality
   */
  generateShareId() {
    return 'share_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }

  calculateExpirationDate(expiresIn) {
    const now = new Date();
    const duration = this.parseDuration(expiresIn);
    return new Date(now.getTime() + duration);
  }

  parseDuration(duration) {
    const match = duration.match(/^(\d+)([hdwm])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

    const [, amount, unit] = match;
    const multipliers = {
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
      m: 30 * 24 * 60 * 60 * 1000
    };

    return parseInt(amount) * multipliers[unit];
  }

  getBaseUrl() {
    return process.env.BASE_URL || 'http://localhost:4000';
  }

  sanitizeEntry(entry) {
    // Remove sensitive information for private sharing
    return {
      ...entry,
      content: entry.content.replace(/\*\*Personal.*?\*\*/gs, '**[Personal content hidden]**'),
      htmlContent: entry.htmlContent.replace(/<strong>Personal.*?<\/strong>/gs, '<strong>[Personal content hidden]</strong>')
    };
  }

  getContentType(format) {
    const types = {
      json: 'application/json',
      markdown: 'text/markdown',
      csv: 'text/csv',
      txt: 'text/plain'
    };
    return types[format] || 'application/octet-stream';
  }

  // Simple in-memory storage for shares (use database in production)
  storeShareData(shareId, data) {
    if (!this.shareStorage) this.shareStorage = new Map();
    this.shareStorage.set(shareId, data);
  }

  getStoredShareData(shareId) {
    if (!this.shareStorage) return null;
    return this.shareStorage.get(shareId);
  }

  removeShareData(shareId) {
    if (this.shareStorage) {
      this.shareStorage.delete(shareId);
    }
  }

  /**
   * Get Express router
   */
  getRouter() {
    return this.router;
  }
}

module.exports = ConsciousnessJournalAPI;
