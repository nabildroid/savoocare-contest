import * as Knex from "knex";

export async function createCodeTable(knex: Knex.Knex) {
  const hasTable = await knex.schema.hasTable("codes");
  if (!hasTable) {
    await knex.schema.createTable("codes", (table) => {
      table.string("subscription").primary();
      table.string("serial").notNullable().unique();
      table.boolean("selled").defaultTo(false);
      table
        .integer("contest")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("contests");

      table.string("seller").references("name").inTable("sellers");
      table.timestamps(true, true);
    });
  }
}

export type Code = {
  subscription: string;
  serial: string;
  selled: boolean;
  contest: string;
  seller?: string;
};
