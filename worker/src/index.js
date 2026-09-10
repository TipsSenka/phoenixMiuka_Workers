const COURSES = [
  {
    id: 1,
    title: 'Cloudflare Workers 入門',
    category: 'infra',
    teacher: 'Miuka',
    level: '初級',
  },
  {
    id: 2,
    title: 'Pages で静的サイトを公開',
    category: 'frontend',
    teacher: 'Miuka',
    level: '初級',
  },
  {
    id: 3,
    title: 'API と UI をつなぐ設計',
    category: 'architecture',
    teacher: 'Miuka',
    level: '中級',
  },
];

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...(init.headers || {}),
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (url.pathname === '/' || url.pathname === '/api') {
      return jsonResponse({
        ok: true,
        app: env.APP_NAME || 'phoenixMiuka',
        message: 'Worker API is ready.',
        endpoints: ['/api', '/api/course', '/api/hello?name=山田'],
      }, { status: 200 });
    }

    if (url.pathname === '/api/course') {
      return jsonResponse({
        ok: true,
        data: COURSES,
        total: COURSES.length,
      }, { status: 200 });
    }

    if (url.pathname === '/api/hello') {
      const name = url.searchParams.get('name');

      if (!name || !name.trim()) {
        return jsonResponse({
          ok: false,
          error: 'name is required',
        }, { status: 400 });
      }

      return jsonResponse({
        ok: true,
        message: `Hello, ${name.trim()}!`,
      }, { status: 200 });
    }

    if (url.pathname === '/api/fortune') {
      const fortunes = [
        '今週は小さな改善が大きな成果を生みます。',
        'チームの連携が、想定以上の速度を生み出します。',
        '一歩ずつ積み上げた内容が、次の成果へつながります。',
      ];

      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      return jsonResponse({
        ok: true,
        message: fortune,
      }, { status: 200 });
    }

    return jsonResponse({
      ok: false,
      error: 'Not found',
    }, { status: 404 });
  },
};
