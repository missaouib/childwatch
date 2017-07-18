import { browser, element, by } from 'protractor';

export class ChildwatchPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('cw-root h1')).getText();
  }
}
