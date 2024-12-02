const express = require('express');
const { Paper, ContentAssessor, SeoAssessor } = require('yoastseo');
const { AbstractResearcher } = require('yoastseo/build/languageProcessing');
const readingTime = require('yoastseo/build/languageProcessing/researches/readingTime').default;
const app = express();
const port = 3000;

app.get('/keyphrase', (req, res) => {
  try {
    const paper = new Paper(
      `Boost Your Productivity with Google Docs App Scripts
Are you looking for innovative ways to enhance your productivity? Google Docs App Scripts might be the solution you need! These powerful scripts enable automation, customization, and seamless integration with other tools. Whether you're managing documents, creating templates, or analyzing data, Google Docs App Scripts can save you time and effort.

With just a few lines of JavaScript, you can automate repetitive tasks, like formatting, data entry, or even generating reports. App Scripts allow you to customize Google Docs to suit your workflow, helping you stay organized and efficient. For businesses, this means streamlined operations and better collaboration across teams.

Moreover, integrating Google Docs App Scripts with Google Sheets, Gmail, or Calendar enhances productivity even further. Imagine automating email updates or syncing your documents with real-time data – the possibilities are endless.

Getting started is simple: access the Script Editor from Google Docs, write your script, and deploy it with ease. For beginners, Google provides extensive documentation and examples to help you create powerful scripts quickly.

Don’t miss the opportunity to unlock the full potential of Google Docs. Start exploring App Scripts today and take your productivity to the next level!
Boost Your Productivity with Google Docs App Scripts
Are you looking for innovative ways to enhance your productivity? Google Docs App Scripts might be the solution you need! These powerful scripts enable automation, customization, and seamless integration with other tools. Whether you're managing documents, creating templates, or analyzing data, Google Docs App Scripts can save you time and effort.

With just a few lines of JavaScript, you can automate repetitive tasks, like formatting, data entry, or even generating reports. App Scripts allow you to customize Google Docs to suit your workflow, helping you stay organized and efficient. For businesses, this means streamlined operations and better collaboration across teams.

Moreover, integrating Google Docs App Scripts with Google Sheets, Gmail, or Calendar enhances productivity even further. Imagine automating email updates or syncing your documents with real-time data – the possibilities are endless.

Getting started is simple: access the Script Editor from Google Docs, write your script, and deploy it with ease. For beginners, Google provides extensive documentation and examples to help you create powerful scripts quickly.

Don’t miss the opportunity to unlock the full potential of Google Docs. Start exploring App Scripts today and take your productivity to the next level!
`,
      {
        title: 'Boost Your Productivity with Google Docs App Scripts',
        keyword: 'Productivity',
        locale: 'en_US',
      }
    );

    const researcher = new AbstractResearcher(paper);

    const assessor = new ContentAssessor(researcher);
    assessor.assess(paper);
    const results = assessor.getValidResults();

    const assessor2 = new SeoAssessor(researcher);
    assessor2.assess(paper);
    const results2 = assessor2.getValidResults();

    const wordCount = researcher.getResearch('wordCountInText').count;
    const time = readingTime(paper, researcher);

    res.send({
      content: results,
      assessor2: results2,
      wordCount: wordCount,
      readingTime: time,
    });
  } catch (error) {
    console.log('hit');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
