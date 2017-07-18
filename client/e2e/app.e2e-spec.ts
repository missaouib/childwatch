import { ChildwatchPage } from './app.po';

describe('childwatch App', () => {
  let page: ChildwatchPage;

  beforeEach(() => {
    page = new ChildwatchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('cw works!');
  });
});
