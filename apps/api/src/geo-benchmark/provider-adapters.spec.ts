import {
  buildProviderRequest,
  DEFAULT_GEMINI_MODEL,
  executeProviderCall,
  parseProviderResponse,
  ProviderNotReadyError,
  providerReadiness,
} from './adapters/provider-adapters';

const ENV = {
  GEMINI_API_KEY: 'gemini-test-key-value',
  GEMINI_MODEL: 'gemini-3.8-flash',
  PERPLEXITY_API_KEY: 'pplx-test-key-value',
  PERPLEXITY_MODEL: 'sonar',
  DOUBAO_API_KEY: 'ark-test-key-value',
  DOUBAO_MODEL: 'doubao-seed-test',
} as NodeJS.ProcessEnv;

describe('provider readiness', () => {
  it('reports configured state without returning secret values', () => {
    const status = providerReadiness('gemini', ENV);
    expect(status.ready).toBe(true);
    expect(status.model).toBe('gemini-3.8-flash');
    expect(JSON.stringify(status)).not.toContain('gemini-test-key-value');
    expect(providerReadiness('doubao', { DOUBAO_API_KEY: ENV.DOUBAO_API_KEY }).ready).toBe(false);
    expect(providerReadiness('perplexity', {}).setupMessage).toMatch(/No request was sent/);
  });
});

describe('provider requests', () => {
  it('sends the exact query and keeps keys in headers', () => {
    const query = 'Which companies manufacture smart rings in China?';
    for (const provider of ['gemini', 'perplexity', 'doubao'] as const) {
      const request = buildProviderRequest(provider, ENV, query);
      const body = JSON.stringify(request.body);
      expect(body).toContain(query);
      expect(body).not.toContain('LONGVON');
      expect(body).not.toContain('龙汾');
      expect(body).not.toContain('gemini-test-key-value');
      expect(body).not.toContain('pplx-test-key-value');
      expect(body).not.toContain('ark-test-key-value');
      expect(JSON.stringify(request.headers)).toContain(
        provider === 'gemini'
          ? 'gemini-test-key-value'
          : provider === 'perplexity'
            ? 'pplx-test-key-value'
            : 'ark-test-key-value',
      );
    }
    expect(buildProviderRequest('gemini', ENV, query).body).toEqual({
      contents: [{ role: 'user', parts: [{ text: query }] }],
    });
    const grounded = buildProviderRequest(
      'gemini',
      { ...ENV, GEMINI_GOOGLE_SEARCH_GROUNDING: 'true' },
      query,
    );
    expect(grounded.body).not.toHaveProperty('tools');
    expect(JSON.stringify(grounded.body)).not.toMatch(/google_search|google_maps|code_execution/);
    const gemini = buildProviderRequest('gemini', { GEMINI_API_KEY: ENV.GEMINI_API_KEY }, query);
    expect(gemini.url).toBe(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent`,
    );
    expect(DEFAULT_GEMINI_MODEL).toBe('gemini-3.8-flash');
    expect(gemini.url).not.toContain('gemini-test-key-value');
    expect(gemini.headers['x-goog-api-key']).toBe('gemini-test-key-value');
    expect(buildProviderRequest('perplexity', ENV, query).url).toBe(
      'https://api.perplexity.ai/v1/agent',
    );
    expect(buildProviderRequest('doubao', ENV, query).body).toMatchObject({
      model: 'doubao-seed-test',
      messages: [{ role: 'user', content: query }],
      web_search_options: {},
    });
  });

  it('blocks a model that is outside the free-tier allowlist before any request', async () => {
    const fetchImpl = jest.fn();
    const paidModel = { ...ENV, GEMINI_MODEL: 'gemini-3-pro' };
    const status = providerReadiness('gemini', paidModel);
    expect(status.ready).toBe(false);
    expect(status.setupMessage).toMatch(/free-tier allowlist/);
    await expect(
      executeProviderCall({
        provider: 'gemini',
        env: paidModel,
        queryText: 'Which companies manufacture smart rings in China?',
        fetchImpl,
      }),
    ).rejects.toBeInstanceOf(ProviderNotReadyError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('does not retry a failed Gemini call or switch to another model', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => '{"error":"quota"}',
    });
    await expect(
      executeProviderCall({
        provider: 'gemini',
        env: ENV,
        queryText: 'Which companies manufacture smart rings in China?',
        fetchImpl,
      }),
    ).rejects.toThrow(/HTTP 429/);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(String(fetchImpl.mock.calls[0][0])).toContain('gemini-3.8-flash');
  });

  it('does not call the network when a provider is not configured', async () => {
    const fetchImpl = jest.fn();
    await expect(
      executeProviderCall({
        provider: 'gemini',
        env: {},
        queryText: 'Which companies manufacture smart rings in China?',
        fetchImpl,
      }),
    ).rejects.toBeInstanceOf(ProviderNotReadyError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('provider parsers', () => {
  it('parses unexpected Gemini grounding citations and drops the search widget HTML', () => {
    const parsed = parseProviderResponse(
      'gemini',
      {
        modelVersion: 'gemini-3.8-flash',
        candidates: [
          {
            content: { parts: [{ text: 'One manufacturer is described here.' }] },
            groundingMetadata: {
              webSearchQueries: ['smart ring manufacturers'],
              searchEntryPoint: { renderedContent: '<style>widget</style>' },
              groundingChunks: [{ web: { uri: 'https://example.com/source', title: 'Example' } }],
              groundingSupports: [
                { segment: { text: 'described here' }, groundingChunkIndices: [0] },
              ],
            },
          },
        ],
      },
      'gemini-3.8-flash',
    );
    expect(parsed.rawAnswer).toBe('One manufacturer is described here.');
    expect(parsed.citations).toEqual([
      expect.objectContaining({
        url: 'https://example.com/source',
        title: 'Example',
        snippet: 'described here',
      }),
    ]);
    expect(JSON.stringify(parsed.rawResponse)).not.toContain('widget');
  });

  it('returns an empty citation list when Gemini has no sources', () => {
    const parsed = parseProviderResponse(
      'gemini',
      {
        candidates: [{ content: { parts: [{ text: 'No sources.' }] } }],
      },
      null,
    );
    expect(parsed.citations).toEqual([]);
    expect(parsed.rawAnswer).toBe('No sources.');
  });

  it('parses Perplexity agent search results and legacy citations', () => {
    const agent = parseProviderResponse(
      'perplexity',
      {
        id: 'resp_1',
        model: 'sonar',
        output: [
          {
            type: 'search_results',
            results: [
              {
                id: 1,
                url: 'https://example.com/a',
                title: 'A',
                snippet: 'Snippet A',
                source: 'web',
              },
            ],
          },
          { type: 'message', content: [{ type: 'output_text', text: 'Agent answer.' }] },
        ],
      },
      null,
    );
    expect(agent.rawAnswer).toBe('Agent answer.');
    expect(agent.citations[0]).toMatchObject({
      url: 'https://example.com/a',
      title: 'A',
      snippet: 'Snippet A',
    });

    const legacy = parseProviderResponse(
      'perplexity',
      {
        choices: [{ message: { content: 'Legacy answer.' } }],
        citations: ['https://example.com/legacy'],
      },
      null,
    );
    expect(legacy.rawAnswer).toBe('Legacy answer.');
    expect(legacy.citations.map((item) => item.url)).toEqual(['https://example.com/legacy']);
  });

  it('parses Doubao url citations and does not invent sources', () => {
    const parsed = parseProviderResponse(
      'doubao',
      {
        model: 'doubao-seed-test',
        choices: [
          {
            message: {
              content: 'Doubao answer.',
              annotations: [
                {
                  type: 'url_citation',
                  url_citation: { title: 'Source', url: 'https://example.com/d' },
                },
              ],
            },
          },
        ],
        usage: { tool_usage: { web_search: 1 } },
      },
      null,
    );
    expect(parsed.rawAnswer).toBe('Doubao answer.');
    expect(parsed.citations).toEqual([
      expect.objectContaining({ title: 'Source', url: 'https://example.com/d' }),
    ]);
    const empty = parseProviderResponse(
      'doubao',
      {
        choices: [{ message: { content: 'No citations.' } }],
      },
      null,
    );
    expect(empty.citations).toEqual([]);
  });

  it('stores the redacted response and never echoes the API key', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          choices: [{ message: { content: `Echo ark-test-key-value` } }],
          authorization: 'Bearer ark-test-key-value',
        }),
    });
    const parsed = await executeProviderCall({
      provider: 'doubao',
      env: ENV,
      queryText: 'Which companies manufacture smart rings in China?',
      fetchImpl,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(parsed.rawResponse)).not.toContain('ark-test-key-value');
    expect(parsed.rawAnswer).not.toContain('ark-test-key-value');
    expect(parsed.citations).toEqual([]);
  });
});
