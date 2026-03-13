export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, msg: "Method not allowed" });
  }

  try {
    const { id, name } = req.body;

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

    res.status(200).json({
      success: true,
      fbToken: data.fbToken,
      fbShardURL: data.fbShardURL
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }
}
