const express = require('express');
const cors = require('cors');
const { Paper, ContentAssessor, SeoAssessor } = require('yoastseo');
const Researcher = require('yoastseo/build/languageProcessing/languages/en/Researcher').default;
const getFleschReadingScore = require('yoastseo/build/languageProcessing/researches/getFleschReadingScore').default;
const readingTime = require('yoastseo/build/languageProcessing/researches/readingTime').default;

// Config.
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
const port = 3000;

app.post('/yoast-analysis', (req, res) => {
  const paper = new Paper(req.body.content, {
    title: req.body.title,
    keyword: req.body.keyword ?? '',
    locale: 'en_US',
  });

  const researcher = new Researcher(paper);

  const content = new ContentAssessor(researcher);
  content.assess(paper);
  const contentResults = content.getValidResults();

  const seo = new SeoAssessor(researcher);
  seo.assess(paper);
  const seoResults = seo.getValidResults();

  const wordCount = researcher.getResearch('wordCountInText').count;
  const time = readingTime(paper, researcher);
  const fleschReadingScore = getFleschReadingScore(paper, researcher);

  res.send({
    data: {
      seo: seoResults,
      readability: contentResults,
      wordCount,
      readingTime: time,
      fleschReadingScore: fleschReadingScore,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
