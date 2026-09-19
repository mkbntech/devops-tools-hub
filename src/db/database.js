const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const { TOOLS, SEED_REVIEWS } = require('./seed-data');

let db;

function initDatabase() {
  const dbDir = path.dirname(config.sqlitePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(config.sqlitePath);
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      license TEXT NOT NULL,
      stars TEXT NOT NULL,
      website TEXT NOT NULL,
      github TEXT NOT NULL,
      icon TEXT NOT NULL,
      tags TEXT NOT NULL,
      what_it_does TEXT NOT NULL,
      why_its_used TEXT NOT NULL,
      architecture TEXT,
      key_features TEXT,
      quickstart TEXT,
      when_to_use TEXT
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT,
      experience TEXT,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      what_liked TEXT,
      gotchas TEXT,
      comment TEXT NOT NULL,
      upvotes INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES tools(id)
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
  `);

  // Check if tools table is empty, and seed
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM tools');
  const { count } = countStmt.get();

  if (count === 0) {
    console.log('[DB] Seeding tools database...');
    const insertTool = db.prepare(`
      INSERT INTO tools (
        id, name, tagline, category, status, license, stars, website, github,
        icon, tags, what_it_does, why_its_used, architecture, key_features, quickstart, when_to_use
      ) VALUES (
        @id, @name, @tagline, @category, @status, @license, @stars, @website, @github,
        @icon, @tags, @whatItDoes, @whyItsUsed, @architecture, @keyFeatures, @quickstart, @whenToUse
      )
    `);

    const insertManyTools = db.transaction((tools) => {
      for (const t of tools) {
        insertTool.run({
          id: t.id,
          name: t.name,
          tagline: t.tagline,
          category: t.category,
          status: t.status,
          license: t.license,
          stars: t.stars,
          website: t.website,
          github: t.github,
          icon: t.icon,
          tags: JSON.stringify(t.tags || []),
          whatItDoes: t.whatItDoes || '',
          whyItsUsed: t.whyItsUsed || '',
          architecture: t.architecture || '',
          keyFeatures: JSON.stringify(t.keyFeatures || []),
          quickstart: t.quickstart || '',
          whenToUse: t.whenToUse || ''
        });
      }
    });

    insertManyTools(TOOLS);
    console.log(`[DB] Successfully seeded ${TOOLS.length} tools.`);

    const insertReview = db.prepare(`
      INSERT INTO reviews (
        product_id, author, role, experience, rating, what_liked, gotchas, comment, upvotes, created_at
      ) VALUES (
        @productId, @author, @role, @experience, @rating, @whatLiked, @gotchas, @comment, @upvotes, @createdAt
      )
    `);

    const insertManyReviews = db.transaction((reviews) => {
      for (const r of reviews) {
        insertReview.run({
          productId: r.productId,
          author: r.author,
          role: r.role || 'DevOps Practitioner',
          experience: r.experience || 'Production User',
          rating: r.rating,
          whatLiked: r.whatLiked || '',
          gotchas: r.gotchas || '',
          comment: r.comment,
          upvotes: r.upvotes || 0,
          createdAt: r.createdAt || new Date().toISOString()
        });
      }
    });

    insertManyReviews(SEED_REVIEWS);
    console.log(`[DB] Successfully seeded ${SEED_REVIEWS.length} community reviews.`);
  }

  return db;
}

function parseToolRow(row) {
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
    keyFeatures: JSON.parse(row.key_features || '[]'),
    whatItDoes: row.what_it_does,
    whyItsUsed: row.why_its_used,
    whenToUse: row.when_to_use
  };
}

// Database query helpers
const dbHelpers = {
  getAllTools({ category, search, status, sort } = {}) {
    let query = 'SELECT * FROM tools WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ' AND (name LIKE ? OR tagline LIKE ? OR category LIKE ? OR tags LIKE ? OR what_it_does LIKE ?)';
      params.push(term, term, term, term, term);
    }

    if (sort === 'name-asc') {
      query += ' ORDER BY name ASC';
    } else if (sort === 'name-desc') {
      query += ' ORDER BY name DESC';
    } else {
      // Default order: maintainer ranking / insertion order
      query += ' ORDER BY rowid ASC';
    }

    const rows = db.prepare(query).all(...params);
    return rows.map(parseToolRow);
  },

  getToolById(id) {
    const row = db.prepare('SELECT * FROM tools WHERE id = ?').get(id);
    return parseToolRow(row);
  },

  getCategories() {
    const rows = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM tools 
      GROUP BY category 
      ORDER BY count DESC, category ASC
    `).all();
    return rows;
  },

  getReviews(productId) {
    const rows = db.prepare(`
      SELECT * FROM reviews 
      WHERE product_id = ? 
      ORDER BY upvotes DESC, created_at DESC
    `).all(productId);
    return rows;
  },

  getReviewSummary(productId) {
    const row = db.prepare(`
      SELECT 
        COUNT(*) as count,
        COALESCE(AVG(rating), 0) as averageRating
      FROM reviews 
      WHERE product_id = ?
    `).get(productId);

    // Get distribution of stars 1-5
    const distRows = db.prepare(`
      SELECT rating, COUNT(*) as count
      FROM reviews
      WHERE product_id = ?
      GROUP BY rating
    `).all(productId);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const d of distRows) {
      distribution[d.rating] = d.count;
    }

    return {
      productId,
      count: row.count,
      averageRating: Math.round(row.averageRating * 10) / 10,
      distribution
    };
  },

  addReview({ productId, author, role, experience, rating, whatLiked, gotchas, comment }) {
    const stmt = db.prepare(`
      INSERT INTO reviews (
        product_id, author, role, experience, rating, what_liked, gotchas, comment, upvotes, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, 0, ?
      )
    `);

    const createdAt = new Date().toISOString();
    const info = stmt.run(
      productId,
      author.trim(),
      (role || 'DevOps Engineer').trim(),
      (experience || 'Practitioner').trim(),
      Number(rating),
      (whatLiked || '').trim(),
      (gotchas || '').trim(),
      comment.trim(),
      createdAt
    );

    return {
      id: info.lastInsertRowid,
      productId,
      author,
      role,
      experience,
      rating: Number(rating),
      whatLiked,
      gotchas,
      comment,
      upvotes: 0,
      createdAt
    };
  },

  upvoteReview(reviewId) {
    const stmt = db.prepare('UPDATE reviews SET upvotes = upvotes + 1 WHERE id = ?');
    stmt.run(reviewId);
    const updated = db.prepare('SELECT upvotes FROM reviews WHERE id = ?').get(reviewId);
    return updated ? updated.upvotes : 0;
  },

  getStats() {
    const toolCount = db.prepare('SELECT COUNT(*) as count FROM tools').get().count;
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
    const avgRatingRow = db.prepare('SELECT COALESCE(AVG(rating), 0) as avg FROM reviews').get();
    const catCount = db.prepare('SELECT COUNT(DISTINCT category) as count FROM tools').get().count;

    return {
      totalTools: toolCount,
      totalReviews: reviewCount,
      averageRating: Math.round(avgRatingRow.avg * 10) / 10,
      totalCategories: catCount
    };
  }
};

module.exports = {
  initDatabase,
  dbHelpers
};
