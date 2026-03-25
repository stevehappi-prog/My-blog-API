
const ArticleModel = require('../models/articleModel');

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.join(',');
  }
  if (typeof tags === 'string') {
    return tags;
  }
  return '';
}

exports.createArticle = (req, res) => {
  try {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;

    if (!titre || !contenu || !auteur || !date || !categorie) {
      return res.status(400).json({
        success: false,
        message: 'Les champs titre, contenu, auteur, date et categorie sont obligatoires.'
      });
    }

    ArticleModel.createArticle(
      {
        titre: titre.trim(),
        contenu: contenu.trim(),
        auteur: auteur.trim(),
        date: date.trim(),
        categorie: categorie.trim(),
        tags: normalizeTags(tags)
      },
      (err, article) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création de l’article.',
            error: err.message
          });
        }

        return res.status(201).json({
          success: true,
          message: 'Article créé avec succès.',
          data: article
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

exports.getAllArticles = (req, res) => {
  try {
    const { categorie, auteur, date } = req.query;

    ArticleModel.getAllArticles({ categorie, auteur, date }, (err, articles) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erreur serveur lors de la récupération des articles.',
          error: err.message
        });
      }

      return res.status(200).json({
        success: true,
        count: articles.length,
        data: articles
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

exports.getArticleById = (req, res) => {
  try {
    const { id } = req.params;

    ArticleModel.getArticleById(id, (err, article) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erreur serveur lors de la récupération de l’article.',
          error: err.message
        });
      }

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé.'
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

exports.updateArticle = (req, res) => {
  try {
    const { id } = req.params;
    const { titre, contenu, categorie, tags } = req.body;

    if (!titre || !contenu || !categorie) {
      return res.status(400).json({
        success: false,
        message: 'Les champs titre, contenu et categorie sont obligatoires.'
      });
    }

    ArticleModel.updateArticle(
      id,
      {
        titre: titre.trim(),
        contenu: contenu.trim(),
        categorie: categorie.trim(),
        tags: normalizeTags(tags)
      },
      (err, changes) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la mise à jour.',
            error: err.message
          });
        }

        if (changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Article non trouvé.'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Article mis à jour avec succès.'
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

exports.deleteArticle = (req, res) => {
  try {
    const { id } = req.params;

    ArticleModel.deleteArticle(id, (err, changes) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erreur serveur lors de la suppression.',
          error: err.message
        });
      }

      if (changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Article supprimé avec succès.'
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

exports.searchArticles = (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre query est obligatoire.'
      });
    }

    ArticleModel.searchArticles(query.trim(), (err, articles) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erreur serveur lors de la recherche.',
          error: err.message
        });
      }

      return res.status(200).json({
        success: true,
        count: articles.length,
        data: articles
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};
