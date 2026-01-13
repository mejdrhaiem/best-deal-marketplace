const express = require('express');
const { sendEvent } = require('../lib/metaConversions');
const router = express.Router();

router.post('/add-to-cart', async (req, res) => {
  try {
    const { eventId, contents, value, currency } = req.body;
    await sendEvent({
      eventName: 'AddToCart',
      eventId,
      contents,
      value,
      currency,
      clientIp: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

router.post('/initiate-checkout', async (req, res) => {
  try {
    const { eventId, contents, value, currency } = req.body;
    await sendEvent({
      eventName: 'InitiateCheckout',
      eventId,
      contents,
      value,
      currency,
      clientIp: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

module.exports = router;

