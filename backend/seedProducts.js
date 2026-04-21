const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "./src/database/store.db");
const db = new sqlite3.Database(dbPath);

const categories = [
  "eletronicos",
  "casa",
  "moda",
  "acessorios",
  "beleza"
];

const catalog = {
  eletronicos: [
    "Smartphone Premium",
    "Notebook Pro",
    "Monitor UltraWide",
    "Fone Bluetooth",
    "Smartwatch X",
    "Tablet Vision",
    "Teclado Mecânico",
    "Mouse Gamer",
    "Caixa de Som Smart",
    "Webcam Full HD",
    "Hub USB-C",
    "Carregador Turbo",
    "Console Digital",
    "Projetor 4K",
    "Drone Vision",
    "Microfone Studio",
    "SSD Portátil",
    "Roteador Mesh",
    "TV Smart Max",
    "Câmera Action"
  ],
  casa: [
    "Sofá Moderno",
    "Luminária Elegance",
    "Mesa de Centro",
    "Poltrona Design",
    "Tapete Minimalista",
    "Jogo de Cama Luxo",
    "Organizador Multiuso",
    "Cadeira Decorativa",
    "Prateleira Premium",
    "Kit Cozinha Chef",
    "Espelho Decorativo",
    "Abajur Soft",
    "Mesa Jantar Prime",
    "Rack Home",
    "Banco Estofado",
    "Cortina Premium",
    "Vaso Decorativo",
    "Jarra Vidro",
    "Kit Banheiro",
    "Aparador Clean"
  ],
  moda: [
    "Jaqueta Urban",
    "Camiseta Essential",
    "Tênis Street",
    "Calça Slim",
    "Vestido Classic",
    "Moletom Premium",
    "Camisa Social Fit",
    "Shorts Casual",
    "Blazer Modern",
    "Saia Midi",
    "Polo Basic",
    "Jaqueta Denim",
    "Tênis Runner",
    "Bolsa Fashion",
    "Top Active",
    "Bermuda Style",
    "Camiseta Oversized",
    "Vestido Flow",
    "Calça Cargo",
    "Casaco Winter"
  ],
  acessorios: [
    "Relógio Classic",
    "Óculos Vision",
    "Mochila Tech",
    "Bolsa Urban",
    "Carteira Leather",
    "Boné Street",
    "Pulseira Style",
    "Cinto Premium",
    "Mala Compact",
    "Case Executive",
    "Anel Minimal",
    "Corrente Steel",
    "Pulseira Gold",
    "Mochila Travel",
    "Carteira Slim",
    "Óculos Retro",
    "Boné Premium",
    "Colar Shine",
    "Case Luxo",
    "Mala Travel Pro"
  ],
  beleza: [
    "Perfume Signature",
    "Kit Skincare Glow",
    "Sérum Facial",
    "Secador Pro",
    "Chapinha Premium",
    "Máscara Capilar",
    "Creme Hidratante",
    "Body Splash",
    "Kit Make Luxo",
    "Escova Elétrica",
    "Óleo Capilar",
    "Sabonete Facial",
    "Base Matte",
    "Paleta Glam",
    "Protetor Solar",
    "Creme Noturno",
    "Esfoliante Facial",
    "Lip Gloss Shine",
    "Perfume Floral",
    "Kit Hair Care"
  ]
};

const imageMap = {
  eletronicos: {
    smartphone: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
    ],
    notebook: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
    ],
    monitor: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80"
    ],
    fone: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80"
    ],
    smartwatch: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80"
    ],
    tablet: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1589739900243-4b52cd9d1043?auto=format&fit=crop&w=900&q=80"
    ],
    teclado: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80"
    ],
    mouse: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80"
    ],
    som: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"
    ],
    webcam: [
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80"
    ],
    carregador: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80"
    ],
    console: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80"
    ],
    projetor: [
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80"
    ],
    drone: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80"
    ],
    microfone: [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80"
    ],
    ssd: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80"
    ],
    roteador: [
      "https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=900&q=80"
    ],
    tv: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80"
    ],
    camera: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"
    ],
    default: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80"
    ]
  },

  casa: {
    sofa: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
    ],
    luminaria: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"
    ],
    mesa: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80"
    ],
    poltrona: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
    ],
    tapete: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
    ],
    cama: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
    ],
    cadeira: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80"
    ],
    prateleira: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"
    ],
    cozinha: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80"
    ],
    espelho: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80"
    ],
    abajur: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"
    ],
    cortina: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80"
    ],
    vaso: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80"
    ],
    banheiro: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80"
    ],
    default: [
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80"
    ]
  },

  moda: {
    jaqueta: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80"
    ],
    camiseta: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
    ],
    tenis: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
    ],
    calca: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"
    ],
    vestido: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
    ],
    moletom: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80"
    ],
    camisa: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80"
    ],
    blazer: [
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?auto=format&fit=crop&w=900&q=80"
    ],
    saia: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80"
    ],
    polo: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80"
    ],
    bolsa: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"
    ],
    top: [
      "https://images.unsplash.com/photo-1506629905607-d9f472ae84c7?auto=format&fit=crop&w=900&q=80"
    ],
    bermuda: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80"
    ],
    casaco: [
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=900&q=80"
    ],
    default: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80"
    ]
  },

  acessorios: {
    relogio: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
    ],
    oculos: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
    ],
    mochila: [
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80"
    ],
    bolsa: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"
    ],
    carteira: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80"
    ],
    bone: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80"
    ],
    pulseira: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80"
    ],
    cinto: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80"
    ],
    mala: [
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=900&q=80"
    ],
    anel: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80"
    ],
    corrente: [
      "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=900&q=80"
    ],
    colar: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80"
    ],
    case: [
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80"
    ],
    default: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=80"
    ]
  },

  beleza: {
    perfume: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
    ],
    skincare: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80"
    ],
    serum: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"
    ],
    secador: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80"
    ],
    chapinha: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80"
    ],
    mascara: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
    ],
    creme: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80"
    ],
    splash: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
    ],
    make: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
    ],
    escova: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80"
    ],
    oleo: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"
    ],
    sabonete: [
      "https://images.unsplash.com/photo-1601612628452-9e99ced43524?auto=format&fit=crop&w=900&q=80"
    ],
    base: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
    ],
    paleta: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
    ],
    protetor: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80"
    ],
    gloss: [
      "https://images.unsplash.com/photo-1631730486572-22653f2a4d2b?auto=format&fit=crop&w=900&q=80"
    ],
    hair: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80"
    ],
    default: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80"
    ]
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function pickRandom(array) {
  return array[randomInt(0, array.length - 1)];
}

function normalizeText(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function detectImageKey(category, productName) {
  const name = normalizeText(productName);

  const rules = {
    eletronicos: [
      ["smartphone", "smartphone"],
      ["notebook", "notebook"],
      ["monitor", "monitor"],
      ["fone", "fone"],
      ["smartwatch", "smartwatch"],
      ["tablet", "tablet"],
      ["teclado", "teclado"],
      ["mouse", "mouse"],
      ["som", "som"],
      ["webcam", "webcam"],
      ["carregador", "carregador"],
      ["console", "console"],
      ["projetor", "projetor"],
      ["drone", "drone"],
      ["microfone", "microfone"],
      ["ssd", "ssd"],
      ["roteador", "roteador"],
      ["tv", "tv"],
      ["camera", "camera"],
      ["câmera", "camera"]
    ],
    casa: [
      ["sofa", "sofa"],
      ["sofá", "sofa"],
      ["luminaria", "luminaria"],
      ["luminária", "luminaria"],
      ["mesa", "mesa"],
      ["poltrona", "poltrona"],
      ["tapete", "tapete"],
      ["cama", "cama"],
      ["cadeira", "cadeira"],
      ["prateleira", "prateleira"],
      ["cozinha", "cozinha"],
      ["espelho", "espelho"],
      ["abajur", "abajur"],
      ["cortina", "cortina"],
      ["vaso", "vaso"],
      ["banheiro", "banheiro"]
    ],
    moda: [
      ["jaqueta", "jaqueta"],
      ["camiseta", "camiseta"],
      ["tenis", "tenis"],
      ["tênis", "tenis"],
      ["calca", "calca"],
      ["calça", "calca"],
      ["vestido", "vestido"],
      ["moletom", "moletom"],
      ["camisa", "camisa"],
      ["blazer", "blazer"],
      ["saia", "saia"],
      ["polo", "polo"],
      ["bolsa", "bolsa"],
      ["top", "top"],
      ["bermuda", "bermuda"],
      ["casaco", "casaco"]
    ],
    acessorios: [
      ["relogio", "relogio"],
      ["relógio", "relogio"],
      ["oculos", "oculos"],
      ["óculos", "oculos"],
      ["mochila", "mochila"],
      ["bolsa", "bolsa"],
      ["carteira", "carteira"],
      ["bone", "bone"],
      ["boné", "bone"],
      ["pulseira", "pulseira"],
      ["cinto", "cinto"],
      ["mala", "mala"],
      ["anel", "anel"],
      ["corrente", "corrente"],
      ["colar", "colar"],
      ["case", "case"]
    ],
    beleza: [
      ["perfume", "perfume"],
      ["skincare", "skincare"],
      ["serum", "serum"],
      ["sérum", "serum"],
      ["secador", "secador"],
      ["chapinha", "chapinha"],
      ["mascara", "mascara"],
      ["máscara", "mascara"],
      ["creme", "creme"],
      ["splash", "splash"],
      ["make", "make"],
      ["escova", "escova"],
      ["oleo", "oleo"],
      ["óleo", "oleo"],
      ["sabonete", "sabonete"],
      ["base", "base"],
      ["paleta", "paleta"],
      ["protetor", "protetor"],
      ["gloss", "gloss"],
      ["hair", "hair"]
    ]
  };

  const categoryRules = rules[category] || [];

  for (const [term, key] of categoryRules) {
    if (name.includes(normalizeText(term))) {
      return key;
    }
  }

  return "default";
}

function getProductImage(category, productName) {
  const key = detectImageKey(category, productName);
  const categoryImages = imageMap[category] || {};
  const images = categoryImages[key] || categoryImages.default || [];
  return images.length ? pickRandom(images) : "https://via.placeholder.com/400x300?text=Produto";
}

function buildDescription(name, category, index) {
  return `${name} ${index + 1} da categoria ${category}, com acabamento premium, visual moderno e excelente apresentação para vitrine de ecommerce profissional. Produto pensado para enriquecer o catálogo da loja, trazendo mais variedade, realismo e força para o portfólio full stack.`;
}

function getBasePriceByCategory(category) {
  const ranges = {
    eletronicos: [199.9, 5999.9],
    casa: [79.9, 2499.9],
    moda: [49.9, 999.9],
    acessorios: [29.9, 799.9],
    beleza: [19.9, 699.9]
  };

  const [min, max] = ranges[category];
  return randomFloat(min, max);
}

function generateProduct(category, name, index) {
  const finalName = `${name} ${index + 1}`;
  const price = getBasePriceByCategory(category);
  const oldPrice = Number((price * randomFloat(1.08, 1.38)).toFixed(2));
  const rating = randomFloat(4.1, 5.0);
  const reviewsCount = randomInt(8, 1200);
  const stock = randomInt(5, 200);
  const featured = index % 9 === 0 ? 1 : 0;

  const badgeOptions = ["", "", "", "Novo", "Oferta", "Destaque"];
  const badge = featured ? "Destaque" : pickRandom(badgeOptions);

  return {
    name: finalName,
    price,
    old_price: oldPrice,
    category,
    image: getProductImage(category, finalName),
    description: buildDescription(name, category, index),
    stock,
    rating,
    reviews_count: reviewsCount,
    featured,
    badge
  };
}

function ensureTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL CHECK(price > 0),
        old_price REAL,
        category TEXT NOT NULL DEFAULT 'decoracao',
        image TEXT,
        description TEXT DEFAULT 'Produto disponível na loja com ótima apresentação e visual premium.',
        stock INTEGER DEFAULT 10,
        rating REAL DEFAULT 4.5,
        reviews_count INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        badge TEXT DEFAULT ''
      )
      `,
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}

function clearProducts() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM products`, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function insertBatch(products) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO products (
        name,
        price,
        old_price,
        category,
        image,
        description,
        stock,
        rating,
        reviews_count,
        featured,
        badge
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.serialize(() => {
      products.forEach((product) => {
        stmt.run([
          product.name,
          product.price,
          product.old_price,
          product.category,
          product.image,
          product.description,
          product.stock,
          product.rating,
          product.reviews_count,
          product.featured,
          product.badge
        ]);
      });

      stmt.finalize((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });
}

async function seed() {
  try {
    await ensureTable();
    await clearProducts();

    const TOTAL = 20000;
    const BATCH = 500;
    let inserted = 0;

    for (const category of categories) {
      const names = catalog[category];
      const limitPerCategory = TOTAL / categories.length;

      for (let i = 0; i < limitPerCategory; i += BATCH) {
        const batch = [];

        for (let j = 0; j < BATCH; j++) {
          const index = i + j;
          const name = names[index % names.length];
          batch.push(generateProduct(category, name, index));
        }

        await insertBatch(batch);
        inserted += batch.length;
        console.log("Inseridos:", inserted);
      }
    }

    console.log(`✅ Banco populado com ${inserted} produtos com imagens coerentes.`);
  } catch (error) {
    console.error("❌ Erro ao popular produtos:", error);
  } finally {
    db.close();
  }
}

seed();