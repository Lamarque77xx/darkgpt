export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem inválida" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        input: [
          {
            role: "system",
            content:
              "Você é a DarkGPT, um assistente focado em programação. Explique código claramente, ajude a encontrar erros e forneça soluções de programação permitidas."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erro na API"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Não consegui gerar uma resposta."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor."
    });
  }
      }
