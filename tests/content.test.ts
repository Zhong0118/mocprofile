import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { content } from '@/content';
import { validateContent } from '@/content/validate';
import type { ContentBundle } from '@/content/types';
import { emptyContent, fixtureContent } from '@/fixtures/content';

const assetExists = (p: string) => fs.existsSync(path.join(__dirname, '..', 'public', p));
const clone = (b: ContentBundle): ContentBundle => structuredClone({ ...b, locales: undefined }) as never;
/** Deep copy that keeps the locale objects (which contain functions) by reference. */
function mutate(b: ContentBundle, fn: (c: ContentBundle) => void): ContentBundle {
  const copy = { ...clone(b), locales: { zh: { ...b.locales.zh }, en: { ...b.locales.en } } } as ContentBundle;
  fn(copy);
  return copy;
}

describe('production content', () => {
  it('passes every content check, including local file existence', () => {
    expect(validateContent(content, { assetExists })).toEqual([]);
  });

  it('contains no template identities, demo metrics or placeholder links', () => {
    const text = JSON.stringify(content);
    for (const s of ['张三', 'XX 大学', 'example.com', 'yourname', 'stars', 'forks', 'GPA']) {
      expect(text).not.toContain(s);
    }
  });

  it('does not invent publications, experience or awards', () => {
    expect(content.publications).toEqual([]);
    expect(content.experience).toEqual([]);
    expect(content.awards).toEqual([]);
    expect(content.person.email).toBeUndefined();
  });

  it('never imports test fixtures from the production content graph', () => {
    const dir = path.join(__dirname, '..', 'src');
    const files = fs.readdirSync(dir, { recursive: true }) as string[];
    const offenders = files
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith('fixtures'))
      .filter((f) => /from ['"]@\/fixtures|fixtures\/content/.test(fs.readFileSync(path.join(dir, f), 'utf8')));
    expect(offenders).toEqual([]);
  });
});

describe('validateContent catches real risks', () => {
  const check = (fn: (c: ContentBundle) => void) =>
    validateContent(mutate(fixtureContent, fn), { allowTemplateMarkers: true }).join('\n');

  it('accepts the fixtures as a baseline', () => {
    expect(validateContent(fixtureContent, { allowTemplateMarkers: true })).toEqual([]);
    expect(validateContent(emptyContent, { allowTemplateMarkers: true })).toEqual([]);
  });

  it('flags template residue', () => {
    const errors = validateContent(mutate(content, (c) => (c.person.displayName = '张三')));
    expect(errors.join()).toContain('template marker "张三"');
  });

  it('flags duplicate ids', () => {
    expect(check((c) => c.projects.push({ ...c.projects[0] }))).toMatch(/duplicate id "fx-project-a"/);
  });

  it('flags placeholder and platform-homepage links', () => {
    expect(check((c) => (c.person.links.scholar = 'https://scholar.google.com'))).toMatch(/platform homepage/);
    expect(check((c) => (c.projects[0].resources.code = '#'))).toMatch(/placeholder link/);
    expect(check((c) => (c.projects[0].resources.demo = 'javascript:void(0)'))).toMatch(/placeholder link/);
  });

  it('flags missing local files', () => {
    const errors = validateContent(
      mutate(content, (c) => (c.person.avatar = { src: '/images/avatar.jpg', width: 176, height: 176 })),
      { assetExists },
    );
    expect(errors.join()).toMatch(/\/images\/avatar\.jpg does not exist/);
  });

  it('flags impossible status combinations', () => {
    expect(check((c) => {
      c.publications[0].publicationStatus = 'under-review';
    })).toMatch(/under-review work must not list a venue/);
    expect(check((c) => {
      c.publications[2].venue = undefined;
    })).toMatch(/published work needs its venue/);
    expect(check((c) => {
      c.projects[1].end = '2020';
    })).toMatch(/end before start/);
    expect(check((c) => {
      c.experience[0].start = '2024-13';
    })).toMatch(/invalid date/);
  });

  it('flags publications that do not mark the site owner', () => {
    expect(check((c) => (c.publications[1].authors = [{ name: 'Someone Else' }]))).toMatch(/site owner not marked/);
  });

  it('flags broken references and missing translations', () => {
    expect(check((c) => (c.focus[0].projectId = 'missing'))).toMatch(/unknown project "missing"/);
    expect(
      check((c) => {
        const { ['fx-project-b']: _drop, ...rest } = c.locales.en.projects;
        c.locales.en = { ...c.locales.en, projects: rest };
      }),
    ).toMatch(/locale en: missing projects text for "fx-project-b"/);
  });

  it('flags detail pages without real detail material', () => {
    expect(check((c) => (c.projects[1].detail = true))).toMatch(/fx-project-b: detail page enabled/);
  });
});
