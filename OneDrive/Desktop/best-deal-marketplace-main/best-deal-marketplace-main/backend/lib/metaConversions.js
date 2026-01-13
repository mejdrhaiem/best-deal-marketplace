const https = require('https');

function postToGraph(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'graph.facebook.com',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let chunks = '';
      res.on('data', (d) => (chunks += d));
      res.on('end', () => {
        try {
          resolve(JSON.parse(chunks));
        } catch (e) {
          resolve(chunks);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function sendEvent({ eventName, eventId, contents, value, currency = 'TND', clientIp, userAgent }) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (!pixelId || !accessToken) return;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        },
        custom_data: {
          value,
          currency,
          contents,
          content_type: 'product',
          content_ids: Array.isArray(contents) ? contents.map((c) => c.id) : undefined,
        },
      },
    ],
    ...(testCode ? { test_event_code: testCode } : {}),
  };

  const path = `/v18.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
  return postToGraph(path, payload);
}

module.exports = { sendEvent };

