import assert from 'node:assert/strict';
import test from 'node:test';
import { htmlLangFromPathname, oemRfqAlternates, siteAlternates } from './i18n-routes.ts';

test('htmlLangFromPathname: English routes', () => {
  assert.equal(htmlLangFromPathname('/en'), 'en');
  assert.equal(htmlLangFromPathname('/en/partner/oem'), 'en');
  assert.equal(htmlLangFromPathname('/en/smart-ring-oem-odm'), 'en');
});

test('htmlLangFromPathname: Chinese routes', () => {
  assert.equal(htmlLangFromPathname('/'), 'zh-CN');
  assert.equal(htmlLangFromPathname('/partner/oem'), 'zh-CN');
  assert.equal(htmlLangFromPathname('/knowledge'), 'zh-CN');
  assert.equal(htmlLangFromPathname('/enfoo'), 'zh-CN');
});

test('oemRfqAlternates is reciprocal and x-default is English RFQ', () => {
  const site = 'https://www.longvon.com';
  const zh = oemRfqAlternates(site, 'zh');
  const en = oemRfqAlternates(site, 'en');
  assert.equal(zh.canonical, 'https://www.longvon.com/partner/oem');
  assert.equal(en.canonical, 'https://www.longvon.com/en/partner/oem');
  assert.deepEqual(zh.languages, en.languages);
  assert.equal(zh.languages['zh-CN'], 'https://www.longvon.com/partner/oem');
  assert.equal(zh.languages.en, 'https://www.longvon.com/en/partner/oem');
  assert.equal(zh.languages['x-default'], 'https://www.longvon.com/en/partner/oem');
});

test('siteAlternates default x-default remains Chinese for non-RFQ pairs', () => {
  const site = 'https://www.longvon.com';
  const home = siteAlternates(site, '/', 'en');
  assert.equal(home.canonical, 'https://www.longvon.com/en');
  assert.equal(home.languages['x-default'], 'https://www.longvon.com');
});
