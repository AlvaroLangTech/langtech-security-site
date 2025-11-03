import { useEffect, useMemo, useRef, useState } from "react";


/** =========================
 *  Tipos e dados
 *  ========================= */
type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  note?: string;
  category: "hosting" | "dev";
  icon?: string;
};

type CardData = {
  id: string;
  name: string;
  desc?: string;
  priceCents: number;
  note?: string;
  features: string[];
  icon?: string;
  category: CartItem["category"];
  highlight?: boolean;
};

const HOSTING: CardData[] = [
  {
    id: "tri",
    name: "Trimestral",
    desc: "Entrada acessível com monitoramento 24h.",
    priceCents: 12000,
    note: "No PIX: R$ 340/3m (5% off)",
    features: ["HTTPS + Firewall ativo", "Backup diário", "Domínio personalizado", "Estrutura otimizada para buscas"],
    icon: "🛡️",
    category: "hosting",
  },
  {
    id: "sem",
    name: "Semestral",
    desc: "Equilíbrio custo/benefício.",
    priceCents: 12000,
    note: "No PIX: R$ 690/6m (12% off)",
    features: ["HTTPS + Firewall ativo", "Backup diário", "Desempenho profissional", "Estrutura otimizada para buscas"],
    icon: "🗂️",
    category: "hosting",
    highlight: true,
  },
  {
    id: "anu",
    name: "Anual",
    desc: "Melhor preço mensal.",
    priceCents: 12000,
    note: "No PIX: R$ 1.290/12m (10% off)",
    features: ["HTTPS + Firewall ativo", "Backup diário", "Observabilidade + cache", "Visibilidade nas buscas"],
    icon: "☁️",
    category: "hosting",
  },
];

const DEV_PACKS: CardData[] = [
  {
    id: "landing",
    name: "Landing Page",
    desc: "Design premium para conversão.",
    priceCents: 54000,
    note: "A partir de R$ 540",
    features: ["Layout moderno", "SEO básico", "Publicação + HTTPS"],
    icon: "📣",
    category: "dev",
  },
  {
    id: "admin",
    name: "Painel Administrativo",
    desc: "Gerencie conteúdo e integrações.",
    priceCents: 89000,
    note: "A partir de R$ 890",
    features: ["CRUD + permissões", "Relatórios", "Suporte técnico"],
    icon: "🧭",
    category: "dev",
    highlight: true,
  },
  {
    id: "full",
    name: "Sistema Completo",
    desc: "Aplicação sob medida com banco de dados.",
    priceCents: 129000,
    note: "A partir de R$ 1.290",
    features: ["Arquitetura escalável", "Automação", "Observabilidade"],
    icon: "🏗️",
    category: "dev",
  },
];

const WHATSAPP_NUMBER = "55XXXXXXXXXXX";
const brl = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

/** =========================
 *  App
 *  ========================= */
export default function App() {
  const [selected, setSelected] = useState<Record<CartItem["category"], CartItem | null>>({
    hosting: null,
    dev: null,
  });
  const [openCart, setOpenCart] = useState(false);

  // refs para rolagem
  const devSectionRef = useRef<HTMLElement | null>(null);

  // persistência
  useEffect(() => {
    const raw = localStorage.getItem("lt_cart_v2");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setSelected({
          hosting: data.hosting ?? null,
          dev: data.dev ?? null,
        });
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("lt_cart_v2", JSON.stringify(selected));
  }, [selected]);

  // adicionar/substituir item
  function addToCart(card: CardData) {
    const item: CartItem = {
      id: card.id,
      name: card.name,
      priceCents: card.priceCents,
      note: card.note,
      category: card.category,
      icon: card.icon,
    };
    setSelected((s) => ({ ...s, [card.category]: item }));

    // se escolheu hospedagem, rola para pacotes de desenvolvimento
    if (card.category === "hosting" && devSectionRef.current) {
      devSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      // pequeno destaque visual (classe "pulse" por 800ms)
      devSectionRef.current.classList.add("pulse");
      setTimeout(() => devSectionRef.current && devSectionRef.current.classList.remove("pulse"), 800);
    }
    // não abrir o carrinho automaticamente — apenas mostrar o ícone
  }

  const totalCents = useMemo(
    () => (selected.hosting?.priceCents ?? 0) + (selected.dev?.priceCents ?? 0),
    [selected]
  );

  const itemsCount = useMemo(
    () => Number(!!selected.hosting) + Number(!!selected.dev),
    [selected]
  );

  function buildWhatsAppLink() {
    const parts: string[] = [];
    if (selected.hosting) {
      parts.push(
        `Hospedagem: ${selected.hosting.name} (${brl(selected.hosting.priceCents)}${
          selected.hosting.note ? ` • ${selected.hosting.note}` : ""
        })`
      );
    }
    if (selected.dev) {
      parts.push(
        `Desenvolvimento: ${selected.dev.name} (${brl(selected.dev.priceCents)}${
          selected.dev.note ? ` • ${selected.dev.note}` : ""
        })`
      );
    }
    const resumo = parts.length ? parts.join("\n") : "Nenhum item selecionado.";
    const msg = `Olá! Gostaria de contratar:\n\n${resumo}\n\nTotal estimado: ${brl(
      totalCents
    )}\n\nPodem me atender?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div>
      {/* Header */}
      <header className="container">
        <div className="frost p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold tracking-tight">Planos de Hospedagem LangTech Security</h1>
            <span className="badge">Feche no WhatsApp</span>
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Hospedagem profissional, segura e monitorada 24h. Todos com HTTPS/SSL, firewall ativo e suporte.
          </p>

          <div className="highlight frost">
            <div>
              <div className="muted">Projeto em Destaque</div>
              <div className="proj">Veja um exemplo hospedado na nossa infraestrutura</div>
              <a className="badge" href="https://profjairon.com.br" target="_blank" rel="noreferrer">
                profjairon.com.br
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hospedagem — bloquinhos lado a lado */}
      <main className="container" style={{ marginTop: 16 }}>
        <section className="frost p-6">
          <h2 className="title-center">Escolha sua Hospedagem</h2>
          <div className="grid-plans">
            {HOSTING.map((p) => {
              const isSelected = selected.hosting?.id === p.id;
              const isDim = !!selected.hosting && selected.hosting!.id !== p.id;
              return (
                <article
                  key={p.id}
                  className={`card frost ${p.highlight ? "best" : ""} ${isSelected ? "is-selected" : ""} ${isDim ? "is-dim" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2">
                      <span className="card-ico">{p.icon}</span> {p.name}
                    </h3>
                    {p.highlight && <span className="best-badge">Melhor escolha</span>}
                  </div>

                  <div className="price">{brl(p.priceCents)}/mês</div>
                  {p.note && <div className="muted text-sm">{p.note}</div>}
                  {p.desc && <p className="text-sm" style={{ color: "var(--muted)" }}>{p.desc}</p>}

                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>

                  <button
                    className="btn btn-primary w-full mt-2"
                    onClick={() => addToCart(p)}
                    disabled={isSelected}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? "Selecionado" : "Selecionar"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* Desenvolvimento — bloquinhos lado a lado */}
        <section className="frost p-6" style={{ marginTop: 16 }} ref={devSectionRef}>
          <h2 className="title-center">Pacotes de Desenvolvimento Web</h2>
          <div className="grid-plans">
            {DEV_PACKS.map((p) => {
              const isSelected = selected.dev?.id === p.id;
              const isDim = !!selected.dev && selected.dev!.id !== p.id;
              return (
                <article
                  key={p.id}
                  className={`card frost ${p.highlight ? "best" : ""} ${isSelected ? "is-selected" : ""} ${isDim ? "is-dim" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2">
                      <span className="card-ico">{p.icon}</span> {p.name}
                    </h3>
                    {p.highlight && <span className="best-badge">Mais pedido</span>}
                  </div>

                  <div className="price">{brl(p.priceCents)}</div>
                  {p.note && <div className="muted text-sm">{p.note}</div>}
                  {p.desc && <p className="text-sm" style={{ color: "var(--muted)" }}>{p.desc}</p>}

                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>

                  <button
                    className="btn btn-primary w-full mt-2"
                    onClick={() => addToCart(p)}
                    disabled={isSelected}
                    aria-pressed={isSelected}
                  >
                    {isSelected ? "Selecionado" : "Selecionar"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </main>

        {/* Chip de Atendimento (fixo no topo direito) */}
      <div className="support-chip" role="button" aria-label="Atendimento">
        🧑‍💻 Atendimento
      </div>

      {/* FAB do carrinho com badge de itens */}
      {(selected.hosting || selected.dev) && (
        <button className="fab fab-below-support" onClick={() => setOpenCart(true)} aria-label="Abrir carrinho">
          🛒
          <span className="cart-badge" aria-label={`Itens no carrinho: ${itemsCount}`}>{itemsCount}</span>
        </button>
      )}


      {/* Drawer do carrinho (abre só no clique) */}
      {openCart && (
        <div className="drawer" role="dialog" aria-modal="true" onClick={() => setOpenCart(false)}>
          <aside className="drawer-panel frost" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Seu pedido</h3>
              <button className="btn btn-outline" onClick={() => setOpenCart(false)}>Fechar</button>
            </header>

            <div className="hr"></div>

            <div className="flex flex-col gap-3">
              {!selected.hosting && !selected.dev && <p className="muted">Nenhum item selecionado.</p>}

              {selected.hosting && (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">Hospedagem — {selected.hosting.name}</div>
                    {selected.hosting.note && <div className="text-xs muted">{selected.hosting.note}</div>}
                  </div>
                  <div className="font-extrabold">{brl(selected.hosting.priceCents)}</div>
                </div>
              )}

              {selected.dev && (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">Desenvolvimento — {selected.dev.name}</div>
                    {selected.dev.note && <div className="text-xs muted">{selected.dev.note}</div>}
                  </div>
                  <div className="font-extrabold">{brl(selected.dev.priceCents)}</div>
                </div>
              )}

              {(selected.hosting || selected.dev) && (
                <>
                  <div className="hr"></div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Total</div>
                    <div className="font-extrabold">{brl(totalCents)}</div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn btn-outline w-full" onClick={() => setSelected({ hosting: null, dev: null })}>
                      Limpar tudo
                    </button>
                    <a className="btn btn-primary w-full" href={buildWhatsAppLink()} target="_blank" rel="noreferrer">
                      Finalizar no WhatsApp
                    </a>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
