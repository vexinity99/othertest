export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success:false, msg:"Only POST allowed" });
  }

  try {

    let body = req.body;

    // Vercel sometimes sends body as string
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
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id,
        name
      })
    });

    const data = await r.json();

    return res.status(200).json({
      success: true,
      fbToken: data.fbToken,
      fbShardURL: data.fbShardURL
    });

  } catch (err) {

    return res.status(500).json({
      success:false,
      msg: err.message
    });

  }
}
