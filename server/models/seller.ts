import * as Knex from "knex";

export async function createSellerTable(knex: Knex.Knex) {
  const hasTable = await knex.schema.hasTable("sellers");
  if (!hasTable) {
    await knex.schema.createTable("sellers", (table) => {
      table.string("name").primary();
      table.timestamps(true, true);
    });
  }
}

export type Seller = {
  name: string;
};
