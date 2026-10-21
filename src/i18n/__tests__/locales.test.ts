import { en as enRituals } from '../../content/rituals/en';
import { ru as ruRituals } from '../../content/rituals/ru';
import { CATALOG } from '../../rituals/catalog';
import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import itLocale from '../locales/it.json';
import ru from '../locales/ru.json';

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('translations', () => {
  it.each(Object.entries({ de, es, fr, it: itLocale, ru }))('%s has the same UI keys as en', (_, locale) => {
    expect(keys(locale).sort()).toEqual(keys(en).sort());
  });

  it.each(Object.entries({ en: enRituals, ru: ruRituals }))('%s has a text for every ritual', (_, texts) => {
    expect(Object.keys(texts).sort()).toEqual(CATALOG.map((r) => r.id).sort());
  });
});
