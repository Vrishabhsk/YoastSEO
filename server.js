const express = require('express');
const cors = require('cors');
const { Paper, ContentAssessor, SeoAssessor, AssessmentResult } = require('yoastseo');
const InclusiveLanguageAssessor = require('yoastseo/build/scoring/inclusiveLanguageAssessor').default;
const CornerStoneContentAssessor = require('yoastseo/build/scoring/cornerstone/contentAssessor').default;
const CornerStoneSeoAssessor = require('yoastseo/build/scoring/cornerstone/seoAssessor').default;
const Researcher = require('yoastseo/build/languageProcessing/languages/en/Researcher').default;
const getFleschReadingScore = require('yoastseo/build/languageProcessing/researches/getFleschReadingScore').default;
const readingTime = require('yoastseo/build/languageProcessing/researches/readingTime').default;
const ReadabilityScoreAggregator =
  require('yoastseo/build/scoring/scoreAggregators/ReadabilityScoreAggregator').default;
const SEOScoreAggregator = require('yoastseo/build/scoring/scoreAggregators/SEOScoreAggregator').default;

// Config.
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
const port = 3000;

app.post('/yoast-analysis', (req, res) => {
  const paper = new Paper(req.body.content, {
    title: 'Small Joys that fill Big Hearts',
    keyword: req.body.keyword ?? 'Joys',
    locale: 'en_US',
    permalink: 'https://yoast-seo.rt.gw/wp-admin',
    description:
      'Life is full of small joys that often go unnoticed. The sun rises each day, painting the sky in soft shades of pink and orange',
  });

  const researcher = new Researcher(paper);

  const content = new ContentAssessor(researcher);
  content.assess(paper);
  const contentResults = content.getValidResults();

  const seo = new SeoAssessor(researcher);
  seo.assess(paper);
  const seoResults = seo.getValidResults();

  const cornerstoneContent = new CornerStoneContentAssessor(researcher);
  cornerstoneContent.assess(paper);
  const cornerstoneContentResults = cornerstoneContent.getValidResults();

  const cornerstoneSeo = new CornerStoneSeoAssessor(researcher);
  cornerstoneSeo.assess(paper);
  const cornerstoneSeoResults = cornerstoneSeo.getValidResults();

  const inclusiveLanguage = new InclusiveLanguageAssessor(researcher);
  inclusiveLanguage.assess(paper);
  const inclusiveLanguageResults = inclusiveLanguage.getValidResults();
  const inclusiveLanguageScore = inclusiveLanguage.calculateOverallScore();

  const wordCount = researcher.getResearch('wordCountInText').count;
  const time = readingTime(paper, researcher);
  const fleschReadingScore = getFleschReadingScore(paper, researcher);
  const words = researcher.getResearch('getProminentWordsForInsights');

  res.send({
    data: {
      cornerstoneContent: cornerstoneContentResults,
      cornerstoneSeo: cornerstoneSeoResults,
      seo: seoResults,
      readability: contentResults,
      wordCount,
      readingTime: time,
      fleschReadingScore: fleschReadingScore,
      prominentWords: words,
      inclusiveLanguage: {
        score: inclusiveLanguageScore,
        results: inclusiveLanguageResults,
      },
      cornerstoneContentResult: new ReadabilityScoreAggregator().aggregate(cornerstoneContentResults),
      readabilityResult: new ReadabilityScoreAggregator().aggregate(contentResults),
      seoResult: new SEOScoreAggregator().aggregate(seoResults),
      cornerstoneSeoResult: new SEOScoreAggregator().aggregate(cornerstoneSeoResults),
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
