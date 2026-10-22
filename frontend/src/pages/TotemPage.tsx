import { FormEvent, useState } from "react";
import { checkout, returnBook } from "../modules/totem/totem.api";

type Operation = "checkout" | "return";
type OperationStatus = "idle" | "loading" | "success" | "error";
type Step = 1 | 2 | 3;

const stepLabels = ["Operação", "Etiquetas", "Resumo"];

function getFriendlyErrorMessage(error: unknown, operation: Operation) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("Um ou mais livros não foram encontrados")) {
    return "Não encontramos um ou mais exemplares. Confira as etiquetas e tente novamente.";
  }

  if (message.includes("Há livros indisponíveis para empréstimo")) {
    return "Um ou mais exemplares não estão disponíveis para empréstimo. Peça ajuda à equipe da biblioteca.";
  }

  if (message.includes("Livro não encontrado para devolução")) {
    return "Não encontramos este exemplar. Confira a etiqueta e tente novamente.";
  }

  if (message.includes("Não há empréstimo em aberto para este exemplar")) {
    return "Este exemplar não tem um empréstimo em aberto para devolver.";
  }

  return operation === "checkout"
    ? "Não foi possível concluir o empréstimo agora. Confira sua conexão e tente novamente."
    : "Não foi possível concluir a devolução agora. Confira sua conexão e tente novamente.";
}

export function TotemPage() {
  const [step, setStep] = useState<Step>(1);
  const [operation, setOperation] = useState<Operation>("checkout");
  const [libraryId] = useState("BIB-CENTRAL");
  const [borrowerId, setBorrowerId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [epcs, setEpcs] = useState<string[]>([]);
  const [status, setStatus] = useState<OperationStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  function continueToScanning() {
    if (operation === "checkout" && !borrowerId.trim()) {
      setFeedback("Informe sua identificação para continuar com o empréstimo.");
      return;
    }

    setFeedback("");
    setStep(2);
  }

  function addTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const epc = tagInput.trim();

    if (!epc) {
      setFeedback("Digite a identificação da etiqueta para adicioná-la.");
      return;
    }

    if (epcs.includes(epc)) {
      setFeedback("Esta etiqueta já foi adicionada.");
      return;
    }

    if (operation === "return" && epcs.length > 0) {
      setFeedback("A devolução é feita com um exemplar por vez.");
      return;
    }

    setEpcs((current) => [...current, epc]);
    setTagInput("");
    setFeedback("");
  }

  function removeTag(epc: string) {
    setEpcs((current) => current.filter((item) => item !== epc));
    setFeedback("");
  }

  async function completeOperation() {
    setStatus("loading");
    setFeedback("");

    try {
      if (operation === "checkout") {
        await checkout({
          libraryId,
          borrowerId: borrowerId.trim(),
          epcs,
          deviceCode: "KIOSK-01"
        });
      } else {
        await returnBook({
          libraryId,
          epc: epcs[0],
          deviceCode: "KIOSK-01"
        });
      }

      setCompletedAt(
        new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeStyle: "short"
        }).format(new Date())
      );
      setStatus("success");
    } catch (error) {
      setFeedback(getFriendlyErrorMessage(error, operation));
      setStatus("error");
    }
  }

  function startNewOperation() {
    setStep(1);
    setOperation("checkout");
    setBorrowerId("");
    setTagInput("");
    setEpcs([]);
    setStatus("idle");
    setFeedback("");
    setCompletedAt("");
  }

  return (
    <section className="kiosk-page">
      <header className="kiosk-header">
        <div>
          <p className="kiosk-eyebrow">Autoatendimento</p>
          <h1>Olá! Vamos começar?</h1>
          <p className="kiosk-intro">
            Siga os passos na tela para fazer seu empréstimo ou devolver um livro.
          </p>
        </div>
        <div className="kiosk-ready">
          <span aria-hidden="true" />
          Totem disponível
        </div>
      </header>

      <ol className="kiosk-stepper" aria-label="Etapas do autoatendimento">
        {stepLabels.map((label, index) => {
          const stepNumber = (index + 1) as Step;
          const isComplete = step > stepNumber || status === "success";

          return (
            <li
              aria-current={step === stepNumber ? "step" : undefined}
              className={`kiosk-step${step === stepNumber ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
              key={label}
            >
              <span className="kiosk-step-number">
                {isComplete ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </span>
              <span>{label}</span>
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <section className="kiosk-card" aria-labelledby="kiosk-operation-title">
          <div className="kiosk-card-heading">
            <span className="kiosk-step-caption">PASSO 1 DE 3</span>
            <h2 id="kiosk-operation-title">O que você gostaria de fazer?</h2>
            <p>Escolha uma opção para continuar.</p>
          </div>

          <div className="kiosk-operation-options">
            <button
              aria-pressed={operation === "checkout"}
              className={`kiosk-operation-option${operation === "checkout" ? " is-selected" : ""}`}
              onClick={() => {
                setOperation("checkout");
                setFeedback("");
              }}
              type="button"
            >
              <span className="kiosk-option-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5v-17ZM5 17a2.5 2.5 0 0 1 2.5-2.5H20M9 7h7" />
                </svg>
              </span>
              <span className="kiosk-option-copy">
                <strong>Fazer empréstimo</strong>
                <span>Leve livros para casa</span>
              </span>
              <span className="kiosk-option-check" aria-hidden="true" />
            </button>
            <button
              aria-pressed={operation === "return"}
              className={`kiosk-operation-option${operation === "return" ? " is-selected" : ""}`}
              onClick={() => {
                setOperation("return");
                setFeedback("");
                if (epcs.length > 1) {
                  setEpcs([]);
                }
              }}
              type="button"
            >
              <span className="kiosk-option-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-2" />
                </svg>
              </span>
              <span className="kiosk-option-copy">
                <strong>Devolver livro</strong>
                <span>Devolva um exemplar por vez</span>
              </span>
              <span className="kiosk-option-check" aria-hidden="true" />
            </button>
          </div>

          {operation === "checkout" && (
            <label className="kiosk-field" htmlFor="kiosk-borrower-id">
              Sua identificação
              <span>Use o número informado pela biblioteca.</span>
              <input
                autoComplete="off"
                id="kiosk-borrower-id"
                onChange={(event) => {
                  setBorrowerId(event.target.value);
                  setFeedback("");
                }}
                placeholder="Digite sua identificação"
                value={borrowerId}
              />
            </label>
          )}

          {feedback && (
            <p className="kiosk-alert kiosk-alert-error" role="alert">
              {feedback}
            </p>
          )}

          <div className="kiosk-actions kiosk-actions-end">
            <button className="kiosk-primary-button" onClick={continueToScanning} type="button">
              Continuar
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="kiosk-card" aria-labelledby="kiosk-scan-title">
          <div className="kiosk-card-heading">
            <span className="kiosk-step-caption">PASSO 2 DE 3</span>
            <h2 id="kiosk-scan-title">
              {operation === "checkout" ? "Aproxime seus livros do leitor" : "Aproxime o livro do leitor"}
            </h2>
            <p>
              {operation === "checkout"
                ? "As etiquetas serão adicionadas à sua lista de empréstimo."
                : "A devolução é feita com um exemplar por vez."}
            </p>
          </div>

          <form className="kiosk-scan-form" onSubmit={addTag}>
            <label className="kiosk-field" htmlFor="kiosk-epc">
              Identificação da etiqueta do livro
              <input
                autoComplete="off"
                autoFocus
                id="kiosk-epc"
                onChange={(event) => {
                  setTagInput(event.target.value);
                  setFeedback("");
                }}
                placeholder="Digite ou leia a etiqueta do livro"
                value={tagInput}
              />
            </label>
            <button
              className="kiosk-secondary-button"
              disabled={operation === "return" && epcs.length > 0}
              type="submit"
            >
              Adicionar livro
            </button>
          </form>

          <div className="kiosk-tag-list" aria-live="polite">
            <div className="kiosk-tag-list-heading">
              <h3>Livros adicionados</h3>
              <span>{epcs.length} {epcs.length === 1 ? "livro" : "livros"}</span>
            </div>
            {epcs.length > 0 ? (
              <ul>
                {epcs.map((epc) => (
                  <li key={epc}>
                    <span className="kiosk-tag-check" aria-hidden="true">✓</span>
                    <span>{epc}</span>
                    <button
                      aria-label={`Remover livro ${epc}`}
                      className="kiosk-remove-tag"
                      onClick={() => removeTag(epc)}
                      type="button"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="kiosk-empty-tags">Nenhum livro adicionado ainda.</p>
            )}
          </div>

          {feedback && (
            <p className="kiosk-alert kiosk-alert-error" role="alert">
              {feedback}
            </p>
          )}

          <div className="kiosk-actions kiosk-actions-between">
            <button
              className="kiosk-back-button"
              onClick={() => {
                setStep(1);
                setFeedback("");
              }}
              type="button"
            >
              Voltar
            </button>
            <button
              className="kiosk-primary-button"
              disabled={epcs.length === 0}
              onClick={() => {
                setFeedback("");
                setStatus("idle");
                setStep(3);
              }}
              type="button"
            >
              Ver resumo
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="kiosk-card" aria-labelledby="kiosk-summary-title">
          <div className="kiosk-card-heading">
            <span className="kiosk-step-caption">PASSO 3 DE 3</span>
            <h2 id="kiosk-summary-title">
              {status === "success" ? "Tudo certo!" : "Confira sua operação"}
            </h2>
            <p>
              {status === "success"
                ? "A operação foi concluída."
                : "Confira os dados antes de confirmar."}
            </p>
          </div>

          {status === "success" ? (
            <div className="kiosk-result kiosk-result-success" role="status">
              <span className="kiosk-result-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </span>
              <div>
                <h3>{operation === "checkout" ? "Empréstimo confirmado" : "Devolução confirmada"}</h3>
                <p>
                  {operation === "checkout"
                    ? "Aproveite sua leitura! Seus livros foram registrados."
                    : "Obrigado! O livro foi recebido pela biblioteca."}
                </p>
              </div>
            </div>
          ) : status === "error" ? (
            <p className="kiosk-alert kiosk-alert-error" role="alert">{feedback}</p>
          ) : null}

          <dl className="kiosk-summary">
            <div>
              <dt>Operação</dt>
              <dd>{operation === "checkout" ? "Empréstimo" : "Devolução"}</dd>
            </div>
            {operation === "checkout" && (
              <div>
                <dt>Identificação</dt>
                <dd>{borrowerId.trim()}</dd>
              </div>
            )}
            <div>
              <dt>{operation === "checkout" ? "Livros para levar" : "Livro devolvido"}</dt>
              <dd>{epcs.length}</dd>
            </div>
            {status === "success" && (
              <div>
                <dt>Concluído em</dt>
                <dd>{completedAt}</dd>
              </div>
            )}
          </dl>

          <ul className="kiosk-receipt-tags" aria-label="Livros desta operação">
            {epcs.map((epc) => <li key={epc}>{epc}</li>)}
          </ul>

          {status === "success" ? (
            <div className="kiosk-actions kiosk-actions-end">
              <button className="kiosk-primary-button" onClick={startNewOperation} type="button">
                Iniciar nova operação
              </button>
            </div>
          ) : (
            <div className="kiosk-actions kiosk-actions-between">
              <button
                className="kiosk-back-button"
                disabled={status === "loading"}
                onClick={() => {
                  setStatus("idle");
                  setFeedback("");
                  setStep(2);
                }}
                type="button"
              >
                Voltar aos livros
              </button>
              <button
                className="kiosk-primary-button"
                disabled={status === "loading"}
                onClick={completeOperation}
                type="button"
              >
                {status === "loading" ? (
                  <>
                    <span aria-hidden="true" className="kiosk-spinner" />
                    {operation === "checkout" ? "Registrando empréstimo..." : "Registrando devolução..."}
                  </>
                ) : (
                  operation === "checkout" ? "Confirmar empréstimo" : "Confirmar devolução"
                )}
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
