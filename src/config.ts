/**
 * Configuração do app. É aqui que se trocam links, contatos, código de acesso
 * e os números de corte usados nos cálculos (seção 7.0 da especificação).
 */

// ---------------------------------------------------------------------------
// Identidade (seção 9.1)
// ---------------------------------------------------------------------------

export const APP_NAME = 'Modulação Intestinal na Prática';
export const APP_SHORT_NAME = 'Modulação';
export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0';

export const ASSINATURA = 'Jéssica Antunes · Nutricionista · CRN2 21581D';
export const NUTRI_NOME = 'Jéssica Antunes';
export const NUTRI_CRN = 'CRN2 21581D';

export const ATENDIMENTO = {
  online: 'On-line (Google Meet)',
  presencial: [
    { cidade: 'Palmeira das Missões', endereco: 'R. Pinheiro Machado, 678' },
    { cidade: 'Ronda Alta', endereco: 'R. 15 de Novembro, 667, Centro' },
  ],
} as const;

export const WHATSAPP_NUMERO = '5554991929487';
export const WHATSAPP_EXIBICAO = '(54) 99192-9487';
export const WHATSAPP_MENSAGEM =
  'Oi, Nutri, sou aluna do curso Modulação Intestinal na Prática e gostaria de saber sobre a consulta.';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;

export const INSTAGRAM_USUARIO = '@nutri.jessicaantunes';
export const INSTAGRAM_URL = 'https://instagram.com/nutri.jessicaantunes';
export const INSTAGRAM_TEXTO = 'Dúvidas sobre o conteúdo do curso, me chame no Instagram.';

// ---------------------------------------------------------------------------
// Kiwify (preencher). Sem link da aula, o app abre a área de membros.
// Sem nenhum link, mostra "Abra esta aula na área de membros da Kiwify".
// ---------------------------------------------------------------------------

export const KIWIFY_AREA_URL = '';

export const KIWIFY_AULA_URLS: Record<number, string> = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  13: '',
  14: '',
  15: '',
  16: '',
  17: '',
};

// ---------------------------------------------------------------------------
// Código de acesso (seção 3.5). Guarda só o hash SHA-256 do código normalizado
// (minúsculas, sem acento, sem espaços). Para trocar: npm run gerar-codigo -- PALAVRA
// Código provisório: NAPRATICA
// ---------------------------------------------------------------------------

export const ACCESS_CODE_ENABLED = true;
export const ACCESS_CODE_HASH = '6b55d9a41e9f4f2dfb8bc9cd6c2e870fee96e9b3a070ce63c496c3ede786300a';

// ---------------------------------------------------------------------------
// Banco de dados
// ---------------------------------------------------------------------------

export const DB_NAME = 'modulacao-intestinal';
export const DB_NAME_DEMO = 'modulacao-demo';

// ---------------------------------------------------------------------------
// Lembretes de agenda (seção 3.6).
// 'auto': no iPhone com o app instalado usa a função da Netlify; no resto, gera o
// arquivo no próprio aparelho. 'local': sempre no aparelho. 'funcao': sempre pela função.
// ---------------------------------------------------------------------------

export const ICS_MODO: 'auto' | 'local' | 'funcao' = 'auto';
export const ICS_FUNCAO_URL = '/.netlify/functions/agenda';
export const LEMBRETE_REGISTRO_DIAS = 60;

// ---------------------------------------------------------------------------
// Números de corte (seção 7.0)
// ---------------------------------------------------------------------------

/** Nota do dia a partir da qual o dia conta como "com sintoma". */
export const LIMIAR_DIA_COM_SINTOMA = 4;
/** Cinco dias de sete. */
export const META_DIAS_HABITO = 5;
/** Abaixo disso, a leitura avisa que está fraca. */
export const MIN_DIAS_LEITURA = 4;
/** Seção 7.5. */
export const FATOR_COMUM_DIFERENCA = 0.3;
/** Seção 7.6. */
export const PADRAO_MIN_DIAS_REGISTRADOS = 14;
export const PADRAO_MIN_OCORRENCIAS = 3;
export const PADRAO_DIFERENCA_PROPORCAO = 0.25;
export const PADRAO_DIFERENCA_NOTA = 2;
/** Seção 7.10. */
export const JANELA_SUSPEITOS_HORAS = 6;
export const SINTOMA_SUSPEITO_MIN = 4;
/** Seção 7.9. */
export const FODMAP_AUMENTO_CLARO = 3;
export const FODMAP_AUMENTO_LEVE = 2;
export const FODMAP_QUEDA_PONTOS = 2;
export const FODMAP_QUEDA_PROPORCAO = 0.7;
/** Seção 7.8. */
export const REAV_QUEDA_SINTOMA = 2;
export const REAV_SINTOMA_BAIXO = 3;
export const REAV_ENERGIA_SUBIU = 1;
export const REAV_ESFORCO_CAIU = 2;
export const REAV_HABITOS_BAIXOS = 4;
/** Seção 7.13. */
export const DIAS_SEM_EVACUAR_AVISO = 3;
export const CRISE_SUGERIR_DIAS = 2;
export const CRISE_SEM_MELHORA_DIAS = 2;
export const DIARREIA_PERSISTENTE_DIAS = 14;
export const ESTUFAMENTO_DIARIO = { nota: 4, diasNaSemana: 6, semanasSeguidas: 2 } as const;
export const ALTERNANCIA_SEMANAS_SEGUIDAS = 2;
/** Seção 7.14. */
export const ML_POR_KG = 35;
export const COPOS_POR_DIA = 8;
export const DISTRIBUICAO_COPOS = [3, 3, 2] as const;
export const FIBRA_META_MIN = 25;
export const FIBRA_META_MAX = 30;
export const LEMBRETE_COPIA_DIAS = 7;

/** Peso aceito na calculadora de água (seção 7.14). */
export const PESO_MIN_KG = 30;
export const PESO_MAX_KG = 300;
/** Quantos dias para trás o registro pode ser editado (seção 6.4). */
export const REGISTRO_DIAS_PARA_TRAS = 30;
/** Mínimo de dias registrados para o lembrete de cópia (seção 3.3). */
export const LEMBRETE_COPIA_MIN_DIAS = 3;
/** Recusada a sugestão do modo crise, quantos dias até perguntar de novo (seção 7.13). */
export const CRISE_SUGESTAO_PAUSA_DIAS = 3;
/** Dias sem registrar durante o plano para mostrar o recado de retomada (seção 6.7). */
export const PLANO_DIAS_SEM_REGISTRO_RETOMAR = 5;
/** Mínimo de dias registrados para o alerta de diarreia persistente (seção 7.13). */
export const DIARREIA_PERSISTENTE_MIN_REGISTROS = 10;
