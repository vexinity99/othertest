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
        "user-agent": "Mozilla/5.0",
        "origin": "https://play.blooket.com",
        "referer": "https://play.blooket.com/"
      },
      body: JSON.stringify({
        id,
        name
      })
    });

    const data = await r.json();

    if (!data.success) {
      return res.status(500).json({
        success:false,
        msg:data.error || "Join failed"
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
