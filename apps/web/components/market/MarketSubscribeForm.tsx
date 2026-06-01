"use client";

import { FormEvent, useState } from "react";

export function MarketSubscribeForm({
  language,
  market
}: {
  language: string;
  market: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const response = await fetch("/api/subscribe/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, language, market })
    });
    setState(response.ok ? "saved" : "error");
    if (response.ok) {
      setEmail("");
    }
  }

  const copy = subscribeCopy(language);
  return (
    <form className="market-section-subscribe-form" onSubmit={onSubmit}>
      <label htmlFor="market-subscribe-email">{copy.label}</label>
      <div>
        <input
          id="market-subscribe-email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          required
          type="email"
          value={email}
        />
        <button disabled={state === "saving"} type="submit">
          {state === "saving" ? copy.saving : copy.button}
        </button>
      </div>
      {state === "saved" ? <p role="status">{copy.saved}</p> : null}
      {state === "error" ? <p role="alert">{copy.error}</p> : null}
    </form>
  );
}

function subscribeCopy(language: string) {
  if (language === "ko") {
    return {
      label: "이메일",
      placeholder: "you@example.com",
      button: "구독하기",
      saving: "저장 중",
      saved: "구독 요청을 저장했습니다. 새 아이템 요약을 받을 수 있게 준비됩니다.",
      error: "이메일 저장에 실패했습니다. 주소 형식을 다시 확인해 주세요."
    };
  }
  if (language === "ja") {
    return {
      label: "メール",
      placeholder: "you@example.com",
      button: "購読",
      saving: "保存中",
      saved: "購読リクエストを保存しました。",
      error: "保存できませんでした。メール形式を確認してください。"
    };
  }
  if (language === "es") {
    return {
      label: "Email",
      placeholder: "tu@example.com",
      button: "Suscribirse",
      saving: "Guardando",
      saved: "Solicitud de suscripción guardada.",
      error: "No se pudo guardar el email. Revisa el formato."
    };
  }
  if (language === "pt-br" || language === "pt") {
    return {
      label: "Email",
      placeholder: "voce@example.com",
      button: "Assinar",
      saving: "Salvando",
      saved: "Pedido de assinatura salvo.",
      error: "Não foi possível salvar o email. Verifique o formato."
    };
  }
  if (language === "fr") {
    return {
      label: "E-mail",
      placeholder: "vous@example.com",
      button: "S'abonner",
      saving: "Enregistrement",
      saved: "Demande d'abonnement enregistrée.",
      error: "Impossible d'enregistrer l'e-mail. Vérifiez le format."
    };
  }
  if (language === "de") {
    return {
      label: "E-Mail",
      placeholder: "du@example.com",
      button: "Abonnieren",
      saving: "Speichern",
      saved: "Abo-Anfrage gespeichert.",
      error: "E-Mail konnte nicht gespeichert werden. Prüfe das Format."
    };
  }
  if (language === "it") {
    return {
      label: "Email",
      placeholder: "tu@example.com",
      button: "Abbonati",
      saving: "Salvataggio",
      saved: "Richiesta di iscrizione salvata.",
      error: "Impossibile salvare l'email. Controlla il formato."
    };
  }
  if (language === "nl") {
    return {
      label: "E-mail",
      placeholder: "jij@example.com",
      button: "Abonneren",
      saving: "Opslaan",
      saved: "Abonnementsverzoek opgeslagen.",
      error: "E-mail kon niet worden opgeslagen. Controleer het adres."
    };
  }
  if (language === "pl") {
    return {
      label: "E-mail",
      placeholder: "ty@example.com",
      button: "Subskrybuj",
      saving: "Zapisywanie",
      saved: "Prośba o subskrypcję została zapisana.",
      error: "Nie udało się zapisać e-maila. Sprawdź format."
    };
  }
  if (language === "tr") {
    return {
      label: "E-posta",
      placeholder: "sen@example.com",
      button: "Abone ol",
      saving: "Kaydediliyor",
      saved: "Abonelik isteği kaydedildi.",
      error: "E-posta kaydedilemedi. Adres biçimini kontrol et."
    };
  }
  if (language === "id") {
    return {
      label: "Email",
      placeholder: "anda@example.com",
      button: "Berlangganan",
      saving: "Menyimpan",
      saved: "Permintaan berlangganan disimpan.",
      error: "Email tidak bisa disimpan. Periksa format alamat."
    };
  }
  return {
    label: "Email",
    placeholder: "you@example.com",
    button: "Subscribe",
    saving: "Saving",
    saved: "Subscription request saved.",
    error: "Could not save the email. Check the address and try again."
  };
}
