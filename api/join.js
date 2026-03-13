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

    const r = await fetch("https://fb.blooket.com/c/firebase/join", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        id,
        name
      })
    });

    const text = await r.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        success:false,
        msg:"Blooket returned invalid response",
        raw:text.slice(0,200)
      });
    }

    if (!data.fbToken) {
      return res.status(500).json({
        success:false,
        msg:"Token not returned",
        data
      });
    }

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
