import * as Knex from "knex";

export async function createApplicationTable(knex: Knex.Knex) {
  const hasTable = await knex.schema.hasTable("applications");
  if (!hasTable) {
    await knex.schema.createTable("applications", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("age").notNullable();
      table.string("subscription").references("subscription").inTable("codes");
      table.timestamps(true, true);
    });
  }
}

export type Application = {
  id: string;
  name: string;
  age: number;
  subscription: string;
};
