const appName = 'phoenixMiuka Workers';
const courseCatalog = [
  {
    id: 101,
    title: 'Cloudflare Workers 入門',
    instructor: 'Miuka',
    duration: '3h',
    level: 'Beginner'
  },
  {
    id: 102,
    title: 'Pages での静的サイト制作',
    instructor: 'Miuka',
    duration: '2h 30m',
    level: 'Intermediate'
  },
  {
    id: 103,
    title: '本番運用を意識したAPI設計',
    instructor: 'Miuka',
    duration: '4h',
    level: 'Advanced'
  }
];

const events = [
  {
    title: 'Cloudflare Workshop',
    date: '2026-09-15',
    venue: 'Online'
  },
  {
    title: 'Frontend Practice',
    date: '2026-09-22',
    venue: 'Tokyo'
  },
  {
    title: 'Production Review',
    date: '2026-09-29',
    venue: 'Hybrid'
  }
];

const fortuneMessages = [
  '今日は素敵な発見がある日です。',
  '小さな改善が大きな成果につながります。',
  '自分のペースを守ると、成長が加速します。'
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'Content-Type'
    }
  });
}

function parseName(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, OPTIONS',
          'access-control-allow-headers': 'Content-Type'
        }
      });
    }

    if (url.pathname === '/') {
      return jsonResponse({
        app: appName,
        message: 'Cloudflare Workers is running.',
        endpoints: ['/api', '/api/course', '/api/hello', '/api/fortune', '/api/events']
      });
    }

    if (url.pathname === '/api') {
      return jsonResponse({
        app: appName,
        status: 'ok',
        routes: ['/api/course', '/api/hello?name=Miuka', '/api/fortune', '/api/events']
      });
    }

    if (url.pathname === '/api/course') {
      return jsonResponse({
        app: appName,
        total: courseCatalog.length,
        courses: courseCatalog
      });
    }

    if (url.pathname === '/api/hello') {
      const name = parseName(url.searchParams.get('name'));

      if (!name) {
        return jsonResponse({
          error: 'name parameter is required.'
        }, 400);
      }

      return jsonResponse({
        message: `Hello, ${name}!`,
        app: appName
      });
    }

    if (url.pathname === '/api/fortune') {
      const index = Math.floor(Math.random() * fortuneMessages.length);
      return jsonResponse({
        fortune: fortuneMessages[index],
        app: appName
      });
    }

    if (url.pathname === '/api/events') {
      return jsonResponse({
        app: appName,
        events
      });
    }

    return jsonResponse({
      error: 'Not found.'
    }, 404);
  }
};
