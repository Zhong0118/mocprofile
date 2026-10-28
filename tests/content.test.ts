import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { content } from '@/content';
import { findTemplateResidue, validateContent } from '@/content/validate';
import type { ContentBundle } from '@/content/types';
import { emptyContent, fixtureContent } from '@/fixtures/content';

const assetExists = (p: string) => fs.existsSync(path.join(__dirname, '..', 'public', p));
/** Deep copy of the data; locale objects (which contain functions) are copied one level deep. */
function mutate(b: ContentBundle, fn: (c: ContentBundle) => void): ContentBundle {
  const { locales, ...data } = b;
  const copy = {
    ...structuredClone(data),
    locales: {
      zh: { ...locales.zh, projects: { ...locales.zh.projects }, person: { ...locales.zh.person } },
      en: { ...locales.en, projects: { ...locales.en.projects }, person: { ...locales.en.person } },
    },
  } as ContentBundle;
  fn(copy);
  return copy;
}

describe('production content', () => {
  it('passes every content check, including local file existence and template residue', () => {
    expect(validateContent(content, { assetExists })).toEqual([]);
    expect(findTemplateResidue(content)).toEqual([]);
  });

  it('contains no template identities, popularity metrics or placeholder links', () => {
    const text = JSON.stringify(content);
    for (const s of ['张三', 'XX 大学', 'example.com', 'yourname', 'stargazers', '"stars"', '"forks"', 'GPA']) {
      expect(text).not.toContain(s);
    }
  });

  it('does not invent publications, experience or awards, and publishes no email', () => {
    expect(content.publications).toEqual([]);
    expect(content.experience).toEqual([]);
    expect(content.awards).toEqual([]);
    expect(content.person.email).toBeUndefined();
    // No address of any kind in the published content (the author's private address must never appear).
    expect(JSON.stringify(content)).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });

  it('keeps one repository per listed project and only verified licenses', () => {
    expect(content.repositories).toHaveLength(8);
    expect(new Set(content.repositories.map((r) => r.url)).size).toBe(8);
    expect(content.repositories.filter((r) => r.license).map((r) => r.id)).toEqual(['paper-reader-skill']);
  });

  it('never imports test fixtures or the dev review page from production code', () => {
    const dir = path.join(__dirname, '..', 'src');
    const files = fs.readdirSync(dir, { recursive: true }) as string[];
    const offenders = files
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith('fixtures'))
      .filter((f) => /from ['"]@\/fixtures|fixtures\/content/.test(fs.readFileSync(path.join(dir, f), 'utf8')));
    expect(offenders).toEqual([]);
    const app = fs.readFileSync(path.join(dir, 'App.tsx'), 'utf8');
    expect(app).toMatch(/import\.meta\.env\.DEV \? lazy\(\(\) => import\('@\/pages\/ContentReviewPage'\)\)/);
  });
});

describe('validateContent catches real risks', () => {
  const check = (fn: (c: ContentBundle) => void) => validateContent(mutate(fixtureContent, fn)).join('\n');

  it('accepts the fixtures as a baseline; template residue is a separate check', () => {
    expect(validateContent(fixtureContent)).toEqual([]);
    expect(validateContent(emptyContent)).toEqual([]);
    expect(findTemplateResidue(fixtureContent).join()).toContain('Fixture Person');
  });

  it('flags template residue in public content', () => {
    expect(findTemplateResidue(mutate(content, (c) => (c.person.displayName = '张三'))).join()).toContain('template marker "张三"');
  });

  it('flags duplicate ids and duplicate repositories', () => {
    expect(check((c) => c.projects.push({ ...c.projects[0] }))).toMatch(/duplicate id "fx-project-a"/);
    expect(check((c) => c.repositories.push({ ...c.repositories[0], id: 'fx-repo-copy' }))).toMatch(/duplicates fx-repo-a/);
  });

  it('flags broken project, repository and skill references', () => {
    expect(check((c) => (c.directions[0].projectIds = ['missing']))).toMatch(/unknown project "missing"/);
    expect(check((c) => (c.repositories[0].projectIds = ['missing']))).toMatch(/repository fx-repo-a: unknown project "missing"/);
    expect(check((c) => (c.skills[0].skills[0].projectIds = []))).toMatch(/skill fx-python: no evidence/);
    expect(check((c) => (c.skills[0].skills[1].projectIds = ['fx-project-b']))).toMatch(/"PyTorch" is not in the tech stack/);
    expect(check((c) => (c.repositories[0].url = 'https://github.com/someone/else'))).toMatch(/url does not match owner\/name/);
  });

  it('refuses popularity metrics on repositories', () => {
    expect(check((c) => Object.assign(c.repositories[0], { stars: 120 }))).toMatch(/must not store "stars"/);
  });

  it('flags placeholder and platform-homepage links', () => {
    expect(check((c) => (c.person.links.scholar = 'https://scholar.google.com'))).toMatch(/platform homepage/);
    expect(check((c) => (c.projects[0].resources.code = '#'))).toMatch(/placeholder link/);
    expect(check((c) => (c.projects[1].resources.demo = 'javascript:void(0)'))).toMatch(/placeholder link/);
  });

  it('flags missing local files', () => {
    const errors = validateContent(
      mutate(content, (c) => (c.person.avatar = { src: '/images/avatar.jpg', width: 176, height: 176 })),
      { assetExists },
    );
    expect(errors.join()).toMatch(/\/images\/avatar\.jpg does not exist/);
  });

  it('flags impossible status combinations and dates', () => {
    expect(check((c) => (c.publications[0].publicationStatus = 'under-review'))).toMatch(/under-review work must not list a venue/);
    expect(check((c) => (c.publications[2].venue = undefined))).toMatch(/published work needs its venue/);
    expect(check((c) => (c.projects[1].end = '2020'))).toMatch(/end before start/);
    expect(check((c) => (c.experience[0].start = '2024-13'))).toMatch(/invalid date/);
  });

  it('flags publications that do not mark the site owner', () => {
    expect(check((c) => (c.publications[1].authors = [{ name: 'Someone Else' }]))).toMatch(/site owner not marked/);
  });

  it('requires a source note for README numbers and a module config for every module', () => {
    expect(
      check((c) => {
        const a = c.locales.zh.projects['fx-project-a'];
        c.locales.zh.projects['fx-project-a'] = { ...a, sections: [{ ...a.sections![0], paragraphs: ['200 个 case，65 个测试'] }, a.sections![1]] };
      }),
    ).toMatch(/states numbers without a source note/);
    expect(check((c) => delete (c.site.modules as Record<string, unknown>).awards)).toMatch(/missing config for module "awards"/);
  });

  it('flags missing translations and detail pages without detail material', () => {
    expect(
      check((c) => {
        const { ['fx-project-b']: _drop, ...rest } = c.locales.en.projects;
        c.locales.en = { ...c.locales.en, projects: rest };
      }),
    ).toMatch(/locale en: missing projects text for "fx-project-b"/);
    expect(check((c) => (c.projects[1].detail = true))).toMatch(/fx-project-b: detail page enabled/);
  });
});
