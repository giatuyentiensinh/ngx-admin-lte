import { Om2mCliPage } from './app.po';

describe('om2m-cli App', () => {
  let page: Om2mCliPage;

  beforeEach(() => {
    page = new Om2mCliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
