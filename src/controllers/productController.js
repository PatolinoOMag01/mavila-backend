import db from "../config/db.js";

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;

    const [products] = await db.query(
      `
      SELECT
        id,
        nome,
        slug,
        subtitulo,
        descricao,
        preco,
        ativo,
        criado_em
      FROM produtos
      WHERE slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado.",
      });
    }

    const product = products[0];

    const [variants] = await db.query(
      `
      SELECT
        id,
        nome_cor,
        slug_cor,
        imagem
      FROM variantes
      WHERE produto_id = ?
      ORDER BY id ASC
      `,
      [product.id]
    );

    const variantIds = variants.map(
      (variant) => variant.id
    );

    let stockRows = [];

    if (variantIds.length > 0) {
      const placeholders = variantIds
        .map(() => "?")
        .join(",");

      const [stock] = await db.query(
        `
        SELECT
          variante_id,
          tamanho,
          quantidade
        FROM estoque
        WHERE variante_id IN (${placeholders})
        ORDER BY tamanho ASC
        `,
        variantIds
      );

      stockRows = stock;
    }

    const formattedVariants = variants.map(
      (variant) => {
        const stock = {};

        stockRows
          .filter(
            (item) =>
              item.variante_id === variant.id
          )
          .forEach((item) => {
            stock[item.tamanho] =
              item.quantidade;
          });

        return {
          id: variant.id,
          color: variant.nome_cor,
          slug: variant.slug_cor,
          image: variant.imagem,
          stock,
        };
      }
    );

    return res.json({
      success: true,
      product: {
        id: product.id,
        name: product.nome,
        slug: product.slug,
        subtitle: product.subtitulo,
        description: product.descricao,
        price: Number(product.preco),
        active: Boolean(product.ativo),
        variants: formattedVariants,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao buscar produto:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erro ao buscar produto.",
      error: error.message,
    });
  }
}