const contactEmail = "interact56@naver.com";

export function articleContactMailto({
  language,
  path,
  title
}: {
  language: string;
  path: string;
  title: string;
}) {
  const params = new URLSearchParams({
    body: contactBody(language, title, path),
    subject: contactSubject(language, title)
  });

  return `mailto:${contactEmail}?${params.toString()}`;
}

function contactSubject(language: string, title: string) {
  if (language === "ko") return `[문의/정정] ${title}`;
  if (language === "ja") return `【問い合わせ・訂正】${title}`;
  if (language === "es") return `[Consulta/corrección] ${title}`;
  if (language === "pt-br" || language === "pt") return `[Contato/correção] ${title}`;
  return `[Question/correction] ${title}`;
}

function contactBody(language: string, title: string, path: string) {
  if (language === "ko") {
    return [
      "안녕하세요. 아래 글에 대해 문의드립니다.",
      "",
      `글 제목: ${title}`,
      `글 링크: ${path}`,
      "",
      "문의 내용:",
      "- ",
      "",
      "정정이 필요한 부분이 있다면 여기에 적어주세요:",
      "- ",
      "",
      "감사합니다."
    ].join("\n");
  }

  if (language === "ja") {
    return [
      "こんにちは。下記の記事について問い合わせます。",
      "",
      `記事タイトル: ${title}`,
      `記事リンク: ${path}`,
      "",
      "問い合わせ内容:",
      "- ",
      "",
      "訂正が必要な箇所:",
      "- "
    ].join("\n");
  }

  if (language === "es") {
    return [
      "Hola. Quiero consultar sobre el siguiente artículo.",
      "",
      `Título: ${title}`,
      `Enlace: ${path}`,
      "",
      "Consulta:",
      "- ",
      "",
      "Parte que debería corregirse:",
      "- "
    ].join("\n");
  }

  if (language === "pt-br" || language === "pt") {
    return [
      "Olá. Quero entrar em contato sobre o artigo abaixo.",
      "",
      `Título: ${title}`,
      `Link: ${path}`,
      "",
      "Mensagem:",
      "- ",
      "",
      "Parte que precisa de correção:",
      "- "
    ].join("\n");
  }

  return [
    "Hello. I am contacting you about the article below.",
    "",
    `Article title: ${title}`,
    `Article link: ${path}`,
    "",
    "Message:",
    "- ",
    "",
    "Possible correction:",
    "- "
  ].join("\n");
}
