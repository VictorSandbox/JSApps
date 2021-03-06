// Router files - defined endpoint and the app route
//https://ncoughlin.com/express-js-ejs-render-page-dynamic-content/  - dynamic ejs template
//https://github.com/scotch-io/node-api-course
// req.params.variable from handler
// req.body.fieldname from form
// req.query.variable from url with get

// author router setup
const express = require("express");
const Author = require("../models/author");
const Book = require("../models/book");
const router = express.Router();

// endpoint - new author
router.get("/new", (req, res) => {
  //res.render('index')
  res.render("../views/author/newAuthors", { author: new Author() });
});

// endpoint - all authors
router.get("/", async (req, res) => {
  //res.render('index')
  //res.render('author/authors')
  //res.send('all author')
  try {
    const authors = await Author.find({});
    res.render("../views/author/authors", {
      authors: authors,
    });

  } catch {
    res.direct("/");
  }
});

// endpoint handler by author id
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const book = await Book.find({author: author.id}).limit(3).exec()

    res.render("../views/author/showAuthors", {
      author:author,
      booksByAuthor:book
    })

  } catch(err) {
    console.log(err)
    res.redirect("/")
  }
});

// endpoint handler -  create a new author
router.post("/addauthor", async (req, res) => {
  // body parser is used to get data from the referred page - req.body.name/ object in form
  try {
    const author = new Author({
      name: req.body.name,  // bodyparser
    });

    let newAuthor = await author.save(); //when fail its goes to catch
    console.log(newAuthor); //when success it print.
    res.redirect("/author/");

  } catch (err) {
    console.error(err);
    res.render("../views/author/newAuthors", {
      errorMessage: "Error creating author",
    });

    res.status(500);
  }

  //res.send(req.body.name)
  //res.render('author/newAuthors')
});

// install npm i method-override to test put and delete
//endpoint handler - edit specific author
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("../views/author/editAuthor", { author: author });
  } catch (err) {
    console.log(err.message);
    res.redirect("/author/");
  }
});


// endpoint handler 
router.put("/:id", async (req, res) => {
  let author
 
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name
    await author.save();
    res.redirect(`/author/${author.id}`)

  } catch (err) {
    console.log(err.message)
    if (author === null) {
      res.redirect("/");
    } else {
      console.error(err);
      res.render("../views/author/editAuthor", {
        errorMessage: "Error updating author",
        author: author,
      });
    }
  }
});

// method overrride - https://stackoverflow.com/questions/27058516/create-a-href-link-that-uses-http-delete-verb-in-express-js
// right attitude and determination - Kingsley Ijomah
// https://github.com/expressjs/method-override
// https://stackabuse.com/building-a-rest-api-with-node-and-express/  with AjaX

//endpoint handler - delete author by id
router.delete("/:id", async(req, res) => {
  try {
    author = await Author.findById(req.params.id);
    await author.remove();  // due to the pre method, an error is throw if there is a author has a book
    res.redirect("/")
  } catch (err) {
    console.log(err.message)
    if (author === null) {
      res.redirect("/");
    } else {
      console.error(err);
      res.redirect(`/author/${author.id}`)
     
    }
  }
});

module.exports = router;
