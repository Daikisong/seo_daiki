export function marketGuideLabel(language: string): string {
  if (language === "es") return "Guía de compra";
  if (language === "pt-br" || language === "pt") return "Guia de compra";
  if (language === "ja") return "レビューガイド";
  if (language === "ko") return "리뷰 가이드";
  return "Review guide";
}

export function breadcrumbLabel(language: string): string {
  if (language === "ko") return "현재 위치";
  return "Breadcrumbs";
}

export function marketsLabel(language: string): string {
  if (language === "ko") return "홈";
  return "Home";
}

export function editorLabel(language: string): string {
  if (language === "ko") return "에디터 가이드";
  return "Editorial guide";
}

export function avatarInitials(reviewer: string | undefined, language: string): string {
  if (language === "ko") return "감";
  return (reviewer ?? "Editor").slice(0, 1).toUpperCase();
}

export function firstPublishedLabel(language: string): string {
  if (language === "es") return "Publicado:";
  if (language === "pt-br" || language === "pt") return "Publicado:";
  if (language === "ja") return "初回公開:";
  if (language === "ko") return "최초 발행:";
  return "Published:";
}

export function reviewPeriodLabel(language: string): string {
  if (language === "ko") return "테스트 기간";
  return "Review window";
}

export function evidenceSetLabel(language: string): string {
  if (language === "ko") return "테스트 환경";
  return "Evidence set";
}

export function comparisonToolsLabel(language: string): string {
  if (language === "ko") return "측정 장비";
  return "Comparison tools";
}

export function decisionCriteriaLabel(language: string): string {
  if (language === "ko") return "평가 항목";
  return "Decision criteria";
}

export function comparisonToolsSentence(language: string): string {
  if (language === "ko") return "공식 자료, 비교표, 체크리스트를 함께 사용했습니다.";
  return "Official sources, comparison tables, and checklists were used together.";
}

export function decisionCriteriaSentence(language: string): string {
  if (language === "ko") return "가격, 정책, 위험 요소, 사용자 조건을 나눠 봅니다.";
  return "We separate price, policy, risk, and user-fit criteria.";
}

export function reviewMethodLabel(language: string): string {
  if (language === "ko") return "검토 방식";
  return "Review method";
}

export function readerPathLabel(language: string): string {
  if (language === "es") return "Ir rápido";
  if (language === "pt-br" || language === "pt") return "Acesso rápido";
  if (language === "ja") return "クイック移動";
  if (language === "ko") return "빠른 이동";
  return "Quick navigation";
}

export function readerPathStepLabel(language: string, step: number): string {
  if (language === "ja") return `Step ${step}`;
  if (language === "ko") return `${step}단계`;
  return `Step ${step}`;
}

export function readerPathAnswerDetail(language: string): string {
  if (language === "es") return "Empieza por la respuesta práctica antes de revisar detalles.";
  if (language === "pt-br" || language === "pt") return "Comece pela resposta prática antes dos detalhes.";
  if (language === "ja") return "詳細を見る前に、まず結論を確認します。";
  if (language === "ko") return "핵심 요약 확인";
  return "Start with the practical answer before the details.";
}

export function readerPathChecklistDetail(language: string): string {
  if (language === "es") return "Comprueba los puntos que cambian la decisión.";
  if (language === "pt-br" || language === "pt") return "Confira os pontos que mudam a decisão.";
  if (language === "ja") return "判断を変える確認項目を先に見ます。";
  if (language === "ko") return "내 상황 점검";
  return "Check the items that can change the decision.";
}

export function readerPathCompareDetail(language: string): string {
  if (language === "es") return "Compara opciones, riesgos o criterios en una vista rápida.";
  if (language === "pt-br" || language === "pt") return "Compare opções, riscos ou critérios de forma rápida.";
  if (language === "ja") return "選択肢、リスク、基準を短く比較します。";
  if (language === "ko") return "기준 한눈에 비교";
  return "Compare options, risks, or criteria in one quick view.";
}

export function readerPathSourcesDetail(language: string): string {
  if (language === "es") return "Termina verificando fuentes oficiales o primarias.";
  if (language === "pt-br" || language === "pt") return "Finalize conferindo fontes oficiais ou primárias.";
  if (language === "ja") return "最後に公式または一次情報を確認します。";
  if (language === "ko") return "공식 자료 확인";
  return "Finish by checking official or primary sources.";
}

export function tocLabel(language: string): string {
  if (language === "es") return "Contenido";
  if (language === "pt-br" || language === "pt") return "Nesta guia";
  if (language === "ja") return "目次";
  if (language === "ko") return "이 글의 목차";
  return "In this guide";
}

export function trustStripLabel(language: string): string {
  if (language === "es") return "Cómo se revisó";
  if (language === "pt-br" || language === "pt") return "Como verificamos";
  if (language === "ja") return "確認方法";
  if (language === "ko") return "검토 방식";
  return "How this was checked";
}

export function reviewSummaryLabel(language: string): string {
  if (language === "ko") return "빠른 결론과 핵심 요약";
  return "Quick verdict and key summary";
}

export function quickVerdictLabel(language: string): string {
  if (language === "ko") return "빠른 결론";
  return "Quick verdict";
}

export function scoreLabel(language: string): string {
  if (language === "ko") return "종합 점수";
  return "Overall score";
}

export function scoreNoteLabel(language: string): string {
  if (language === "ko") return "게시 전 검토 구조 기준";
  return "Based on the publishing-readiness structure";
}

export function methodDisclosureLabel(language: string): string {
  if (language === "ko") return "공식 자료, 글 구성 방식, 비교 기준을 나눠 확인했습니다.";
  return "We separate source checks, top-page format patterns, and decision criteria.";
}

export function fitLabel(language: string): string {
  if (language === "ko") return "추천 대상";
  return "Best fit";
}

export function defaultFitSentence(language: string): string {
  if (language === "ko") return "핵심 조건을 확인한 뒤 결정해야 하는 독자";
  return "Readers who need the key decision criteria before acting.";
}

export function sourceCountLabel(language: string, count: number): string {
  if (language === "es") return `${count} fuentes revisadas, con prioridad para fuentes oficiales o primarias.`;
  if (language === "pt-br" || language === "pt") return `${count} fontes verificadas, priorizando fontes oficiais ou primárias.`;
  if (language === "ja") return `${count}件の情報源を確認し、公式または一次情報を優先しました。`;
  if (language === "ko") return `확인한 출처 ${count}개, 공식 자료와 1차 자료를 우선했습니다.`;
  return `${count} sources checked, prioritizing official or primary sources.`;
}

export function checkedAtSentence(language: string, checkedAt: string): string {
  if (language === "es") return `Datos revisados el ${checkedAt}; precios y políticas pueden cambiar.`;
  if (language === "pt-br" || language === "pt") return `Dados verificados em ${checkedAt}; preços e políticas podem mudar.`;
  if (language === "ja") return `${checkedAt}時点で確認。価格や制度は変わる場合があります。`;
  if (language === "ko") return `${checkedAt} 기준으로 확인했으며 가격과 정책은 바뀔 수 있습니다.`;
  return `Checked on ${checkedAt}; prices and policies can change.`;
}

export function checklistLabel(language: string): string {
  if (language === "es") return "Lista rápida de comprobación";
  if (language === "pt-br" || language === "pt") return "Checklist rápido";
  if (language === "ja") return "確認チェックリスト";
  if (language === "ko") return "빠른 체크리스트";
  return "Quick checklist";
}

export function checkActionLabel(language: string): string {
  if (language === "ko") return "확인하기";
  if (language === "es") return "Comprobar";
  if (language === "pt-br" || language === "pt") return "Verificar";
  if (language === "ja") return "確認";
  return "Check";
}

export function sourcesLabel(language: string): string {
  if (language === "es") return "Fuentes consultadas";
  if (language === "pt-br" || language === "pt") return "Fontes consultadas";
  if (language === "ja") return "確認した情報源";
  if (language === "ko") return "확인한 출처";
  return "Sources checked";
}

export function checkedAtLabel(language: string): string {
  if (language === "es") return "Revisado:";
  if (language === "pt-br" || language === "pt") return "Verificado:";
  if (language === "ja") return "確認日:";
  if (language === "ko") return "확인일:";
  return "Checked:";
}

export function updatedLabel(language: string): string {
  if (language === "es") return "Actualizado:";
  if (language === "pt-br" || language === "pt") return "Atualizado:";
  if (language === "ja") return "更新:";
  if (language === "ko") return "업데이트:";
  return "Updated:";
}

export function atAGlanceLabel(language: string): string {
  if (language === "es") return "En resumen";
  if (language === "pt-br" || language === "pt") return "Resumo rápido";
  if (language === "ja") return "要点";
  if (language === "ko") return "핵심 요약";
  return "At a glance";
}

export function quickAnswerLabel(language: string): string {
  if (language === "ko") return "바로 답";
  return "Quick answer";
}

export function relatedLabel(language: string): string {
  if (language === "ko") return "관련 글";
  if (language === "es") return "Lecturas relacionadas";
  if (language === "pt-br" || language === "pt") return "Leituras relacionadas";
  if (language === "ja") return "関連記事";
  return "Related guides";
}

export function resourceLabel(language: string): string {
  if (language === "ko") return "함께 보면 좋은 리소스";
  if (language === "es") return "Recursos útiles";
  if (language === "pt-br" || language === "pt") return "Recursos úteis";
  if (language === "ja") return "参考リソース";
  return "Useful resources";
}

export function feedbackLabel(language: string): string {
  if (language === "ko") return "글 피드백";
  return "Article feedback";
}

export function feedbackQuestionLabel(language: string): string {
  if (language === "ko") return "정보 오류가 있나요?";
  return "Found an issue?";
}

export function feedbackActionLabel(language: string): string {
  if (language === "ko") return "수정 요청하기";
  return "Request a correction";
}

export function helpfulLabel(language: string): string {
  if (language === "ko") return "이 글이 도움이 되셨나요?";
  return "Was this helpful?";
}

export function helpfulYesLabel(language: string): string {
  if (language === "ko") return "도움 됨";
  return "Helpful";
}

export function helpfulNoLabel(language: string): string {
  if (language === "ko") return "도움 안 됨";
  return "Not helpful";
}
