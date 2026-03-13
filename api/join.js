export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success:false, msg:"POST only" });
  }

  try {

    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { id, name } = body;

    if (!id || !name) {
      return res.status(400).json({
        success:false,
        msg:"Missing id or name"
      });
    }

    const r = await fetch("https://play.blooket.com/api/firebase/join", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "origin": "https://play.blooket.com",
        "referer": "https://play.blooket.com/"
      },
      body: JSON.stringify({
        id,
        name
      })
    });

    const text = await r.text();

    // detect Cloudflare / HTML response
    if (text.startsWith("<!DOCTYPE")) {
      return res.status(500).json({
        success:false,
        msg:"Blooket blocked the request (Cloudflare protection)"
      });
    }

    const data = JSON.parse(text);

    return res.json({
      success:true,
      fbToken:data.fbToken,
      fbShardURL:data.fbShardURL
    });

  } catch (err) {

    return res.status(500).json({
      success:false,
      msg:err.message
    });

  }

}
