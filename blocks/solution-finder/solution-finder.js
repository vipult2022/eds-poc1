const REQUIRED_FIELDS = [
  'solutionId',
  'name',
  'summary',
  'audience',
  'businessNeed',
  'market',
  'region',
  'capability',
  'availability',
  'detailPath',
];

const FILTERS = ['audience', 'businessNeed', 'market', 'region'];

function toKey(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, character) => character.toUpperCase());
}

function readConfig(block) {
  return Object.fromEntries([...block.children].map((row) => {
    const [labelCell, valueCell] = row.children;
    return [toKey(labelCell?.textContent || ''), valueCell?.textContent.trim() || ''];
  }));
}

function createOption(value, label = value) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

function createField(name, labelText, allLabel, currentValue) {
  const wrapper = document.createElement('div');
  wrapper.className = `solution-finder-field solution-finder-${name}`;

  const label = document.createElement('label');
  label.htmlFor = `solution-finder-${name}`;
  label.textContent = labelText;

  const select = document.createElement('select');
  select.id = label.htmlFor;
  select.name = name;
  select.append(createOption('', allLabel));
  select.value = currentValue;

  wrapper.append(label, select);
  return { wrapper, select };
}

function normalizeSolutions(rows) {
  const seen = new Set();

  return rows.reduce((solutions, row, index) => {
    const missing = REQUIRED_FIELDS.filter((field) => !row[field]);
    if (missing.length) {
      // eslint-disable-next-line no-console
      console.warn(`Skipping solution row ${index}: missing ${missing.join(', ')}`);
      return solutions;
    }

    if (seen.has(row.solutionId)) {
      // eslint-disable-next-line no-console
      console.warn(`Skipping duplicate solutionId: ${row.solutionId}`);
      return solutions;
    }

    seen.add(row.solutionId);
    solutions.push({
      ...row,
      featured: row.featured === true || row.featured === 'true',
    });
    return solutions;
  }, []);
}

async function loadSolutions(indexPath) {
  const response = await fetch(indexPath);
  if (!response.ok) {
    throw new Error(`Unable to load solution catalog: ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.data)) {
    throw new Error('Solution catalog response does not contain a data array');
  }

  return normalizeSolutions(payload.data)
    .filter(({ availability }) => availability === 'Active');
}

function getFilterValues(solutions, name) {
  return [...new Set(solutions.map((solution) => solution[name]))]
    .sort((a, b) => a.localeCompare(b));
}

function createCard(solution) {
  const item = document.createElement('li');
  const article = document.createElement('article');

  const heading = document.createElement('h2');
  const link = document.createElement('a');
  link.href = solution.detailPath;
  link.textContent = solution.name;
  heading.append(link);

  const summary = document.createElement('p');
  summary.textContent = solution.summary;

  const attributes = document.createElement('p');
  attributes.className = 'solution-finder-attributes';
  attributes.textContent = [
    solution.capability,
    solution.audience,
    solution.region,
  ].join(' · ');

  article.append(heading, summary, attributes);
  item.append(article);
  return item;
}

function updateUrl(state) {
  const url = new URL(window.location.href);
  Object.entries(state).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  });
  window.history.replaceState({}, '', url);
}

function getInitialState() {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') || '',
    audience: params.get('audience') || '',
    businessNeed: params.get('businessNeed') || '',
    market: params.get('market') || '',
    region: params.get('region') || '',
  };
}

/**
 * Decorates the solution finder block.
 * @param {Element} block The solution finder block
 */
export default async function decorate(block) {
  const config = readConfig(block);
  const state = getInitialState();

  const form = document.createElement('form');
  form.className = 'solution-finder-form';
  form.setAttribute('role', 'search');

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'solution-finder-field solution-finder-search';
  const searchLabel = document.createElement('label');
  searchLabel.htmlFor = 'solution-finder-search';
  searchLabel.textContent = config.searchLabel;
  const search = document.createElement('input');
  search.id = searchLabel.htmlFor;
  search.name = 'q';
  search.type = 'search';
  search.value = state.q;
  searchWrapper.append(searchLabel, search);

  const fieldDefinitions = [
    ['audience', config.audienceLabel, config.allAudiences],
    ['businessNeed', config.businessNeedLabel, config.allBusinessNeeds],
    ['market', config.marketLabel, config.allMarkets],
    ['region', config.regionLabel, config.allRegions],
  ];
  const fields = Object.fromEntries(fieldDefinitions.map(([name, label, allLabel]) => {
    const field = createField(name, label, allLabel, state[name]);
    return [name, field];
  }));

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'button secondary solution-finder-clear';
  clear.textContent = config.clearLabel;

  form.append(
    searchWrapper,
    ...FILTERS.map((name) => fields[name].wrapper),
    clear,
  );

  const status = document.createElement('p');
  status.className = 'solution-finder-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.textContent = config.loadingMessage;

  const results = document.createElement('ul');
  results.className = 'solution-finder-results';
  results.setAttribute('aria-busy', 'true');

  block.replaceChildren(form, status, results);

  try {
    const solutions = await loadSolutions(config.index);

    FILTERS.forEach((name) => {
      getFilterValues(solutions, name).forEach((value) => {
        fields[name].select.append(createOption(value));
      });
      fields[name].select.value = getFilterValues(solutions, name).includes(state[name])
        ? state[name]
        : '';
      state[name] = fields[name].select.value;
    });

    const render = () => {
      const query = state.q.trim().toLowerCase();
      const matches = solutions.filter((solution) => {
        const searchable = [
          solution.name,
          solution.summary,
          solution.capability,
        ].join(' ').toLowerCase();
        const matchesQuery = !query || searchable.includes(query);
        const matchesFilters = FILTERS.every((name) => (
          !state[name] || solution[name] === state[name]
        ));
        return matchesQuery && matchesFilters;
      });

      results.replaceChildren(...matches.map(createCard));
      results.hidden = matches.length === 0;
      status.textContent = matches.length
        ? `${matches.length} ${matches.length === 1
          ? config.resultSingular
          : config.resultPlural}`
        : config.emptyMessage;
      updateUrl(state);
    };

    search.addEventListener('input', () => {
      state.q = search.value;
      render();
    });

    FILTERS.forEach((name) => {
      fields[name].select.addEventListener('change', () => {
        state[name] = fields[name].select.value;
        render();
      });
    });

    clear.addEventListener('click', () => {
      form.reset();
      state.q = '';
      FILTERS.forEach((name) => {
        state[name] = '';
      });
      render();
      search.focus();
    });

    results.setAttribute('aria-busy', 'false');
    render();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Solution finder failed to load', error);
    results.setAttribute('aria-busy', 'false');
    results.hidden = true;
    status.textContent = config.errorMessage;
  }
}
