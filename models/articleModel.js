
const db = require('../config/db');

const ArticleModel = {
  createArticle: ({ titre, contenu, auteur, date, categorie, tags }, callback) => {
    const sql = `
      INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [titre, contenu, auteur, date, categorie, tags], function (err) {
      if (err) return callback(err);
      callback(null, {
        id: this.lastID,
        titre,
        contenu,
        auteur,
        date,
        categorie,
        tags
      });
    });
  },

  getAllArticles: ({ categorie, auteur, date }, callback) => {
    let sql = `SELECT * FROM articles WHERE 1=1`;
    const params = [];

    if (categorie) {
      sql += ` AND categorie = ?`;
      params.push(categorie);
    }

    if (auteur) {
      sql += ` AND auteur = ?`;
      params.push(auteur);
    }

    if (date) {
      sql += ` AND date = ?`;
      params.push(date);
    }

    sql += ` ORDER BY id DESC`;

    db.all(sql, params, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },

  getArticleById: (id, callback) => {
    const sql = `SELECT * FROM articles WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  },

  updateArticle: (id, { titre, contenu, categorie, tags }, callback) => {
    const sql = `
      UPDATE articles
      SET titre = ?, contenu = ?, categorie = ?, tags = ?
      WHERE id = ?
    `;
    db.run(sql, [titre, contenu, categorie, tags, id], function (err) {
      if (err) return callback(err);
      callback(null, this.changes);
    });
  },

  deleteArticle: (id, callback) => {
    const sql = `DELETE FROM articles WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) return callback(err);
      callback(null, this.changes);
    });
  },

  searchArticles: (query, callback) => {
    const sql = `
      SELECT * FROM articles
      WHERE titre LIKE ? OR contenu LIKE ?
      ORDER BY id DESC
    `;
    const search = `%${query}%`;
    db.all(sql, [search, search], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }
};

module.exports = ArticleModel;
