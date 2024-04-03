const Guide = require("../db/Guide");
const Todo = require("../db/Todo");
const User = require("../db/User");
const {
  getPageOffsetAndLimit,
  getPaginationLinks,
} = require("../shared/paging");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createGuidePage(req, res) {
  res.render("guides/create");
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createGuide(req, res) {
  const { title, content, notify } = req.body;

  Guide.create({ title, content }).then((newGuide) => {
    if (notify) {
      return User.findAll().then((users) => {
        const newTodos = users.map((user) => {
          return {
            userId: user.dataValues.id,
            guideId: newGuide.id,
            completed: false,
          };
        });

        return Todo.bulkCreate(newTodos).then(() => {
          req.flash("success", "Tartib muvaffaqiyatli tahrirlandi");
          req.flash("success", "Bildirishnomalar hammaga jo'natildi");

          res.redirect("/guides/list");
        });
      });
    }

    req.flash("success", "Tartib muvaffaqiyatli yaratildi");

    res.redirect("/guides/list");
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function listGuides(req, res) {
  const page = +req.query.page || 1;
  const { offset, limit } = getPageOffsetAndLimit(page, 5);

  return Guide.findAndCountAll({
    order: [["createdAt", "DESC"]],
    offset,
    limit,
  }).then(({ rows: guides, count }) => {
    const pageInfo = getPaginationLinks(page, count, 5);

    res.render("guides/list", { guides, pageInfo });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function showGuide(req, res) {
  const { id } = req.params;

  return Guide.findByPk(id).then((guide) => {
    if (!guide) {
      req.flash("warning", "Tartib topilmadi");

      return res.redirect("/guides/list");
    }

    res.render("guides/show", { guide });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function editGuidePage(req, res) {
  const { id } = req.params;

  return Guide.findByPk(id).then((guide) => {
    if (!guide) {
      req.flash("warning", "Tartib topilmadi");

      return res.redirect("/guides/list");
    }

    res.render("guides/edit", { guide });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function editGuide(req, res) {
  const { id } = req.params;
  const { title, content, notify } = req.body;

  return Guide.findByPk(id).then((guide) => {
    if (!guide) {
      req.flash("error", "Tartib topilmadi");

      return res.redirect("/guides/list");
    }

    return guide.update({ title, content }).then((newGuide) => {
      if (notify) {
        return User.findAll().then((users) => {
          const newTodos = users.map((user) => {
            return {
              userId: user.id,
              guideId: newGuide.id,
              completed: false,
            };
          });

          return Todo.bulkCreate(newTodos).then(() => {
            req.flash("success", "Tartib muvaffaqiyatli tahrirlandi");
            req.flash("success", "Bildirishnomalar hammaga jo'natildi");

            res.redirect("/guides/list");
          });
        });
      }

      req.flash("success", "Tartib muvaffaqiyatli tahrirlandi");

      res.redirect("/guides/list");
    });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function removeGuide(req, res) {
  const { id } = req.params;

  return Guide.findByPk(id).then((guide) => {
    if (!guide) {
      req.flash("error", "Tartib topilmadi");

      return res.redirect("/guides/list");
    }

    return guide.destroy().then(() => {
      req.flash("success", "Tartib muvaffaqiyatli o'chirildi");

      res.redirect("/guides/list");
    });
  });
}

module.exports = {
  createGuidePage,
  createGuide,
  listGuides,
  showGuide,
  editGuidePage,
  editGuide,
  removeGuide,
};
