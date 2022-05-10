import * as Knex from "knex";

export async function createContestTable(knex: Knex.Knex) {
  const hasTable = await knex.schema.hasTable("contests");
  if (!hasTable) {
    await knex.schema.createTable("contests", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("title_ar").notNullable();
      table.string("description").notNullable();
      table.date("start").notNullable();
      table.date("end").notNullable();
      table.string("countries").notNullable();
      table.string("prize1").notNullable();
      table.string("prize2").notNullable();
      table.string("prize3").notNullable();
    });
  }
}

export type Contest = {
  id: string;
  title: string;
  title_ar: string;
  start: Date;
  end: Date;
  description: string;
  countries: string;
  prize1: string;
  prize2: string;
  prize3: string;
};
